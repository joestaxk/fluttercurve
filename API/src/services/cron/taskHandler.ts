import calculateCompoundingPlan from "../calcDepositPlans";
import Cron from "./init";
import cronService from "./services";

export interface taskHandlerInterface {
    deliverEmails: () => void;
    calculateMonthlyEarnings: () => void;
    calculateDailyEarnings: () => void;
    QueuedMail: () => void;
    depositCompoundingCronUpdates: () => void;
    depositCronUpdates: () => void;
    depositService: () => void;
}

const newJob = new Cron();
var taskHandler:any = {} as taskHandlerInterface;

// what are the task we want to hanlde.

/**
 * # Send bulk email @ night
 * # Go through DB in search of expired deposit and kick it off
 * # Increase Invesments when it's time.
 * # Send Email if needed. and more.
 */



// taskHandler.ongoingServices = [];


taskHandler.depositCronUpdates = function() {
    console.log("---- reading depositCronUpdate --------")
    newJob.add(cronService.depositService, "minutes5", "depositservice", true);
}

taskHandler.depositCompoundingCronUpdates = function() {
    console.log("---- reading depositCompoundingCronUpdates --------")
    newJob.add(cronService.depositCompoundingService, "minutes5", "compoundingservice", true);
}

taskHandler.QueuedMail = function() {
    console.log("---- reading Queued mails --------")
    newJob.add(cronService.mailBoy, "minutes10", "queuedmail", true);
}

taskHandler.deliverEmails = function() {
    console.log("---- reading Queued mails --------")
    newJob.add(cronService.deliveryMailBoy, "minutes10", "deliveryMailBoy", true);
}


// daily cron
taskHandler.calculateDailyEarnings = function(){
    console.log("---- reading calculate Daily Earnings --------")
    newJob.add(cronService.dailyEarning, "daily6hrs", "calculateDailyEarnings", true);  
}

// monthly cron
taskHandler.calculateMonthlyEarnings = function(){
    console.log("---- reading calculate Monthly Earnings --------")
    newJob.add(cronService.monthlyEarning, "daily6hrs", "calculateMonthlyEarnings", true);
}
 
// fixer data
taskHandler.fixerData = function(){
    console.log("---- reading calculate Monthly Earnings --------")
    newJob.add(cronService.fixerData, "minutes15", "fixerData", true);
}

// taskHandler.init = {
//     depositCronUpdates: taskHandler.depositCronUpdates,
//     depositCompoundingCronUpdates: taskHandler.depositCompoundingCronUpdates,
//     QueuedMail: taskHandler.QueuedMail,
//     deliverEmails: taskHandler.deliverEmails,
//     calculateDailyEarnings: taskHandler.calculateDailyEarnings,
//     calculateMonthlyEarnings: taskHandler.calculateMonthlyEarnings
// } as any


export default taskHandler;