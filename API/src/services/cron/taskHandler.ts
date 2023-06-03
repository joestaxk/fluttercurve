import Cron from "./init";
import cronService from "./services";

interface taskHandlerInterface {
    init: any;
    depositCronUpdates: () => void;
    depositService: () => void;
    ongoingServices: never[];
}

const newJob = new Cron();
console.log("---- reading TaskHandler --------")
var taskHandler = {} as taskHandlerInterface;

// what are the task we want to hanlde.

/**
 * # Send bulk email @ night
 * # Go through DB in search of expired deposit and kick it off
 * # Increase Invesments when it's time.
 * # Send Email if needed. and more.
 */



taskHandler.ongoingServices = [];


taskHandler.depositCronUpdates = function() {
    console.log("---- reading depositCronUpdate --------")
    const task:any = newJob.add(cronService.depositService, "minutes", "depositservice", true);
    taskHandler.ongoingServices.push(task as never);
}


taskHandler.init = {
    depositCronUpdates: taskHandler.depositCronUpdates,
} as any


export default taskHandler;