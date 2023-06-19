import { stat } from "fs";
import config from "../../config/config";
import Client from "../../models/Users/users";
import templates from "../../utils/emailTemplates";
import helpers from "../../utils/helpers";
import userCompounding from "../../models/mode/compounding";
import compoundingDeposit from "../../models/mode/compoundingDeposit";

interface handlerServiceInterface {
    successfulCompoundingCharge: (chargeID: string) => Promise<void>;
    // get the user wallet account
    successfulDepositCharge(chargeID: string): unknown;
    updateEarning: ({ plan, duration, investedAmt, progressAmt, remainingDays, investmentCompleted, status, expiresAt, createdAt, updateTimestamp }: any) => Promise<void>;
}

let handleCompoundingServices = {} as handlerServiceInterface

// deposit onlLY
/**
 * 
 * @param chargeID 
 * @returns 
 * 
 * @description `What happens here? when a user make a deposit, we keep in check for successful update`
 */
handleCompoundingServices.successfulCompoundingCharge = async function(chargeID:string) {
    const res:any = await compoundingDeposit.findOne({where: {chargeID}});
    if(!res?.clientId) return;

    const {uuid, id, userName, email, }:any =  await Client.findOne({where: {uuid: res.clientId}})

    // STORE A EMAIL and send later
    await templates.successfulChargeMailTemplate(uuid, [
        {
            type: "p",
            msg: `Hello, ${userName}, Congrats 🚀🚀🚀. Your Deposit of ${res.investedAmt}, has been credited to wallet successfully. Your ${res.plan} Investment Plan, starts from today. <br/> 
                Login into your account to keep track of what is going on.`
        },
        {
            type: "a",
            link: config.APP_URI,
            value: "Confirm Deposit Now"
        }
    ], email, userName)
    
    // UPDATE USERACCOUNT
    // get the user compounding wallet account
    const ifAny = await userCompounding.findOne({where: {clientId: id}});
    if(!ifAny) {
        // Each time a new user wallet is created, that user just made some investment.
        await compoundingDeposit.update({status: "SUCCESSFUL"}, {where: {chargeID}})
        // create new account for the user
        await userCompounding.create({
            totalDeposit: parseInt(res.investedAmt),
            totalWithdrawal: 0,
            totalEarning: 0,
            clientId: id,
        })
        return;
    }

    // why this line: this is because a user can only have 1 account, so we update this incase of any new deposit.
    await userCompounding.increment('totalDeposit', {
        by: parseInt(res.investedAmt),
        where: {
            clientId: id
        }
    })
}



handleCompoundingServices.updateEarning = async function({clientId, chargeID, plan, duration, investedAmt, progressAmt, intrestRate, remainingDays, investmentCompleted, status, expiresAt, createdAt, updateTimestamp}: any) {
    // check status
    if(status !== "SUCCESSFUL") return;
    console.log(`working on compounding services......`)

    // check if investment is almost finishing
    if(duration === progressAmt) return;
    
    // check if it's the next MONTH
    // const timeFrame:any = helpers.calcTimeDifferenceInMonth(updateTimestamp);
    // if(timeFrame < 1) return;

    
    ++remainingDays
    if(remainingDays <= parseInt(duration)) {
        const earnings = TotalLogic(
            parseInt(investedAmt),
            parseFloat(intrestRate)/100,
            remainingDays
        )

        compoundingDeposit.update({
            progressAmt: (earnings).toString(),
            investmentCompleted: parseInt(duration) === remainingDays  ? true : false,
            remainingDays: remainingDays
        } ,{where: {chargeID}})
    
        
        // When ever the investment is completed, let's increment user's account
        console.log(remainingDays, parseInt(duration))
        if(parseInt(duration) === remainingDays) {
            const {id} = await Client.findOne({where: {uuid: clientId}}) as any
            await userCompounding.increment('totalEarning', {
                by: earnings,
                where: {
                    clientId: id
                }
            })
        }
    }
}


// \=========================================== HANDLE THE CALCULATION FOR INCREASING THE INVESTMENTS
function calculateEffectiveInterestRate(nominalInterestRate:number, compoundingPeriods:number) {
    return (1 + (nominalInterestRate / compoundingPeriods)) ** compoundingPeriods - 1;
}

function calculateFutureValue(initialAmt:number, EIR:number, compoundingPeriods:number) {
    return (
        initialAmt * (1 + EIR)**compoundingPeriods
    )
}
  

function TotalLogic(initialAmt:any, getDecimalInterest:any, compoundingPeriods:any){
    const effectiveInterestRate = calculateEffectiveInterestRate(getDecimalInterest, compoundingPeriods);
    const getFutureVal = calculateFutureValue(initialAmt, effectiveInterestRate, compoundingPeriods)

    const calculation = {
        FIV: getFutureVal,
        TIE: (getFutureVal-initialAmt),
        EIR:  (getFutureVal-initialAmt)/100,
        IB: initialAmt,
    }

    return calculation.TIE
} 
export default handleCompoundingServices;