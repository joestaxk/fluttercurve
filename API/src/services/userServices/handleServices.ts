import { stat } from "fs";
import config from "../../config/config";
import userDeposit from "../../models/Users/deposit";
import userAccount from "../../models/Users/userAccount";
import Client from "../../models/Users/users";
import templates from "../../utils/emailTemplates";
import helpers from "../../utils/helpers";
import adminNotification from "../../models/Users/adminNotifications";

interface handlerServiceInterface {
    // get the user wallet account
    successfulDepositCharge(chargeID: string): unknown;
    updateEarning: ({ plan, duration, investedAmt, progressAmt, remainingDays, investmentCompleted, status, expiresAt, createdAt, updateTimestamp }: any) => Promise<void>;
}

let handleServices = {} as handlerServiceInterface

// deposit onlLY
/**
 * 
 * @param chargeID 
 * @returns 
 * 
 * @description `What happens here? when a user make a deposit, we keep in check for successful update`
 */
handleServices.successfulDepositCharge = async function(chargeID:string) {
    const res:any = await userDeposit.findOne({where: {chargeID}});
    if(!res?.clientId) return;

    // we got the user so as to send client mail
    const {uuid, id, userName, fullName, email, ipAddress, currency}:any =  await Client.findOne({where: {uuid: res.clientId}})

    // STORE A EMAIL and send later
    await templates.successfulChargeMailTemplate(uuid, [
        {
            type: "p",
            msg: `Congratulations. Your Deposit of ${helpers.currencyFormatLong(res?.investedAmt, currency)}, has been credited to wallet successfully. Your ${res.plan} Investment Plan, starts from today.
                Login into your account to keep track of what's going on.`
        },
        {
            type: "a",
            link: config.APP_URI,
            value: "Confirm Deposit Now"
        }
    ], email, userName)

    // UPDATE USERACCOUNT
    // get the user wallet account
    const ifAny = await userAccount.findOne({where: {clientId: id}});
    // Each time a new user wallet is created, that user just made some investment.
    await userDeposit.update({status: "SUCCESSFUL"}, {where: {chargeID}})
    // new deposit alert
    await adminNotification.create({
        clientId: uuid,
        type: "DEPOSIT",
        fullName,
        depositType: res.plan,
        userIp: ipAddress,
    })
    if(!ifAny) {
        // create new account for the user
        await userAccount.create({
            totalDeposit: parseInt(res.investedAmt),
            totalWithdrawal: 0,
            totalEarning: 0,
            clientId: id,
        })
        return;
    }

    // why this line: this is because a user can only have 1 account, so we update this incase of any new deposit.
    await userAccount.increment('totalDeposit', {
        by: parseInt(res.investedAmt),
        where: {
            clientId: id
        }
    })
}



handleServices.updateEarning = async function({clientId, chargeID, duration, investedAmt, progressAmt, intrestRate, remainingDays, status, updateTimestamp}: any) {
    // check status
    if(status !== "SUCCESSFUL") return;
    console.log(`working on depositing services......`)

    // check if investment is almost finishing
    if(duration === progressAmt) return;
    
    // check if it's the next day
    // const timeFrame:any = helpers.calcTimeDifferenceInHours(updateTimestamp);
    // if(timeFrame < 23) return console.log("----------------------NOT up to a day yet---------------------------");

    
    ++remainingDays
    if(remainingDays <= parseFloat(duration)) {
        const earnings = calculateEarnings(
            parseInt(investedAmt),
            parseFloat(intrestRate)/100,
            remainingDays
        )
        userDeposit.update({
            progressAmt: (earnings).toString(),
            investmentCompleted: parseFloat(duration) === remainingDays  ? true : false,
            remainingDays: remainingDays
        } ,{where: {chargeID}})
    
        
        // When ever the investment is completed, let's increment user's account
        if(parseFloat(duration) === remainingDays) {
            const {id} = await Client.findOne({where: {uuid: clientId}}) as any
            await userAccount.increment('totalEarning', {
                by: earnings,
                where: {
                    clientId: id
                }
            })
        }
    }
}



function calculateEarnings(investedAmt:number, interestRate: number, targetDay:number) {
    // Calculate the value of the investment at the end of the target day
    var valueAtTargetDay:number = investedAmt * Math.pow(1 + interestRate, targetDay);
  
    // Calculate the earnings for the target day
    var earningsForTargetDay:any = valueAtTargetDay - investedAmt;
  
    // Round the earnings to 2 decimal places
    earningsForTargetDay = earningsForTargetDay.toFixed(2);
  
    return parseFloat(earningsForTargetDay);
  }

export default handleServices;