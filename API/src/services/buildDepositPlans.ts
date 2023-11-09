import httpStatus from "http-status";
import DepositPlan from "../models/services/depositPlans";
import CompoundingPlans from "../models/services/compundingPlans";
import ApiError from "../utils/ApiError";

export default async function buildDepositPlans() {
  try {
    // create the first and data for the plans.
    const data = [
      {
        plan: "Eth Staking",
        minAmt: "100",
        maxAmt: "50000",
        duration: "7",
        gurantee: "100",
        dailyInterestRate: "25",
      },
      {
        plan: "Deluxe",
        minAmt: "50000",
        maxAmt: "90000",
        duration: "7",
        gurantee: "100",
        dailyInterestRate: "71",
      },
      {
        plan: "Nfp",
        minAmt: "100000",
        maxAmt: "200000",
        duration: "30",
        gurantee: "100",
        dailyInterestRate: "110",
      },
      {
        plan: "Premium",
        minAmt: "2000000",
        maxAmt: "10000000",
        duration: "365",
        gurantee: "100",
        dailyInterestRate: "136",
      },
      {
        plan: "Erc 20",
        minAmt: "302000",
        maxAmt: "1900000",
        duration: "365",
        gurantee: "100",
        dailyInterestRate: "192",
      },
      {
        plan: "Ieo",
        minAmt: "217000",
        maxAmt: "300000",
        duration: "210",
        gurantee: "100",
        dailyInterestRate: "238",
      },
    ];

    const ifExist = await DepositPlan.findAndCountAll();
    if (ifExist.count > 0){
      throw new ApiError("Duplicate input", httpStatus.NOT_ACCEPTABLE, 
      "You can't add new data, you can only update existing data(s).");
    }

    const createPlan = await DepositPlan.bulkCreate(data);
    if (!createPlan) {
        throw new ApiError("ERR", httpStatus.NOT_ACCEPTABLE, 
        "Something Went Wrong");
    }
  } catch (error) {
    throw error;
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
    ];

    const ifExist = await CompoundingPlans.findAndCountAll();
    if (ifExist.count > 0){
        throw new ApiError("Duplicate input", httpStatus.NOT_ACCEPTABLE, 
        "You can't add new data, you can only update existing data(s).");
    }

      const createPlan = await CompoundingPlans.bulkCreate(data);
      if (!createPlan) {
        throw new ApiError("ERR", httpStatus.NOT_ACCEPTABLE, 
        "Something Went Wrong");
      }
  } catch (error) {
    throw error;
  }
}
