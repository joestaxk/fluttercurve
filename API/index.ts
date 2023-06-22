import app  from "./src/app"
import config from "./src/config/config"
import authenticate from "./src/database/db";
import taskHandler, { taskHandlerInterface } from "./src/services/cron/taskHandler";


function init() {
   authenticate()
  .then(() => {
    // Schedule tasks to be run on the server.
    for (const props in taskHandler) {
      taskHandler[props]()
    }
    console.log(`Server listening to http://localhost:${config.PORT}`)
  })
  .catch(console.error)
}

let server = app.listen(config.PORT, init);
 
// exit handler func
function exitHandler() {
  if (server) {
    server.close(() => {
      console.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// unexpected handler func
function unexpectedErrorHandler(error:any) {
  switch (error.code) {
    case 'EADDRINUSE':
      console.error(`PORT::${error.port} Address already in use!`)
      config.PORT = (error.port + 1)
      server.listen(config.PORT)
      break;
    default:
      console.error(error);
      exitHandler();
      break;
    }
};

// node process runtime errors
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  console.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
