"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const config_1 = __importDefault(require("./src/config/config"));
const db_1 = __importDefault(require("./src/database/db"));
const taskHandler_1 = __importDefault(require("./src/services/cron/taskHandler"));
function init() {
    (0, db_1.default)()
        .then(() => {
        // Schedule tasks to be run on the server.
        for (const props in taskHandler_1.default.init) {
            taskHandler_1.default.init[props]();
        }
        taskHandler_1.default.ongoingServices.forEach((cron) => cron);
        console.log(`Server listening to http://localhost:${config_1.default.PORT}`);
    })
        .catch(console.error);
}
let server = app_1.default.listen(config_1.default.PORT, init);
// exit handler func
function exitHandler() {
    if (server) {
        server.close(() => {
            console.info('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
}
;
// unexpected handler func
function unexpectedErrorHandler(error) {
    switch (error.code) {
        case 'EADDRINUSE':
            console.error(`PORT::${error.port} Address already in use!`);
            config_1.default.PORT = (error.port + 1);
            server.listen(config_1.default.PORT);
            break;
        default:
            console.error(error);
            exitHandler();
            break;
    }
}
;
// node process runtime errors
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    console.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
