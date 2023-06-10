import httpStatus from "http-status";
import DepositPlan from "../models/services/depositPlans";
import compoundingPlans from "../models/mode/compoundingPlans";

export default async function buildDepositPlans() {
    try {
        // create the first and data for the plans.
        const data = [
            {
                plan: "Deluxe",
                minAmt: "50000",
                maxAmt: "90000",
                duration: "7",
                gurantee: "100",
                dailyInterestRate: "0.71",
            },
            {
                plan: "Nfp",
                minAmt: "100000",
                maxAmt: "200000",
                duration: "30",
                gurantee: "100",
                dailyInterestRate: "1.10",
            },
            {   
                plan: "Premium",
                minAmt: "2000000",
                maxAmt: "10000000",
                duration: "365",
                gurantee: "100",
                dailyInterestRate: "1.36",
            },
            {   
                plan: "Erc 20",
                minAmt: "302000",
                maxAmt: "1900000",
                duration: "365",
                gurantee: "100",
                dailyInterestRate: "1.92",
            },
            {   
                plan: "Ieo",
                minAmt: "217000",
                maxAmt: "300000",
                duration: "210",
                gurantee: "100",
                dailyInterestRate: "2.38",
            }
        ]
        
        const ifExist = await DepositPlan.findAndCountAll();
        if(ifExist.count > 1) return console.error("Duplicate input", httpStatus.NOT_ACCEPTABLE, {message: "You can't add new data, you can only update existing data(s)."});


        for(let i = 0; i < data.length; ++i) {
            const createPlan = await DepositPlan.create(data[i]);
            if(!createPlan){
                return console.error("what's wrong", httpStatus.SERVICE_UNAVAILABLE)
            }
        }
    } catch (error) {
        throw error
    }
}


export async function buildCompondingPlans() {
    try {
        // create the first and data for the plans.
        const data = [
            {
                plan: "Optima Compounding (Promo)",
                minAmt: "10000",
                maxAmt: "499999",
                duration: "1",
                interestRate: "12",
            },
        ]
        
        const ifExist = await compoundingPlans.findAndCountAll();
        if(ifExist.count > 1) return console.error("Duplicate input", httpStatus.NOT_ACCEPTABLE, {message: "You can't add new data, you can only update existing data(s)."});

        for(let i = 0; i < data.length; ++i) {
            const createPlan = await compoundingPlans.create(data[i]);
            if(!createPlan){
                return console.error("what's wrong", httpStatus.SERVICE_UNAVAILABLE)
            }
        }
    } catch (error) {
        throw error
    }
}