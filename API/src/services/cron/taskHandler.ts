import calculateCompoundingPlan from "../calcDepositPlans";
import Cron from "./init";
import cronService from "./services";

interface taskHandlerInterface {
    calculateMonthlyEarnings: () => void;
    calculateDailyEarnings: () => void;
    QueuedMail: () => void;
    depositCompoundingCronUpdates: () => void;
    init: any;
    depositCronUpdates: () => void;
    depositService: () => void;
    ongoingServices: never[];
}

const newJob = new Cron();
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

taskHandler.depositCompoundingCronUpdates = async function() {
    console.log("---- reading depositCompoundingCronUpdates --------")
    const task:any = newJob.add(cronService.depositCompoundingService, "minutes", "compoundingservice", true);
    taskHandler.ongoingServices.push(task as never);
}

taskHandler.QueuedMail = async function() {
    console.log("---- reading Queued mails --------")
    const task:any = newJob.add(cronService.mailBoy, "minutes", "queuedmail", true);
    taskHandler.ongoingServices.push(task as never);
}


// daily cron
taskHandler.calculateDailyEarnings = async function(){
    console.log("---- reading calculate Daily Earnings --------")
    const task:any = newJob.add(cronService.dailyEarning, "daily", "calculateDailyEarnings", true);
    taskHandler.ongoingServices.push(task as never);
}

// monthly cron
taskHandler.calculateMonthlyEarnings = async function(){
    console.log("---- reading calculate Monthly Earnings --------")
    const task:any = newJob.add(cronService.monthlyEarning, "daily", "calculateMonthlyEarnings", true);
    taskHandler.ongoingServices.push(task as never);
}
 


taskHandler.init = {
    depositCronUpdates: taskHandler.depositCronUpdates,
    depositCompoundingCronUpdates: taskHandler.depositCompoundingCronUpdates,
    QueuedMail: taskHandler.QueuedMail,
    calculateDailyEarnings: taskHandler.calculateDailyEarnings,
    calculateMonthlyEarnings: taskHandler.calculateMonthlyEarnings
} as any


export default taskHandler;