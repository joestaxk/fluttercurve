import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import helpers from "../../utils/helpers";
import DepositPlan from "../../models/services/depositPlans";
import userDeposit from "../../models/Users/deposit";
import Coinbase, { chargeInterface } from "../../services/userServices/coinbase";

interface serviceControllerInterface {
    getAllSuccessfulInvesment: (req: any, res: any, next: any) => Promise<void>;
    getAllDepositRequest: (req: any, res: any, next: any) => Promise<void>;
    newDepositRequest: (req: any, res: any, nex: any) => Promise<void>;
    getActiveDeposit: (req: any, res: any, next: any) => Promise<any>;
    getDepositPlans: (req: any, res: any, next: any) => Promise<void>;
    getCountryCode: (req: any, res: any, next: any) => Promise<void>;
}

let serviceController = {} as serviceControllerInterface;


serviceController.getCountryCode = async function(req, res, next) {
    try {
        const results:any = await helpers.countryDialCode(req.query.code);
        if(!results) throw new ApiError('COUNTRY CODE', httpStatus.NOT_FOUND, `${req.query.code}, what's that?`);
        res.send(results)
    } catch (error) {
        console.log(error)
        throw new ApiError('Somthing went wrong', httpStatus.BAD_REQUEST, error)
    }
}

serviceController.getDepositPlans = async function(req,res,next) {
    try {
        // create the first and data for the plans.
        const ifExist = await DepositPlan.findAll();
        if(ifExist.length) {
          res.send(ifExist) 
        }
    } catch (error) {
        res.send(error)
    }
}

serviceController.getActiveDeposit = async function(req,res,next) {
    try {
        // query DB for data
        const depoData = await userDeposit.findAll({where: {status: "NEW", clientId: req.id}});

        if(!depoData.length) return res.send(depoData);

        res.send(depoData)
    } catch (error) {
        console.log(error)
    }
}


serviceController.newDepositRequest = async function(req,res,next) {
    try {
        // we communicate with a third party api - Coinbase
        const {chargeAPIData, depoInfoData} = req.body;
        const bodyData:chargeInterface<string> = {
            description: chargeAPIData.description,
            metadata: {
                customer_id: req.id,
                customer_name: chargeAPIData.metadata.customer_name,
            },
            name: depoInfoData.plan, 
            pricing_type: 'fixed_price',
            local_price: {
                amount: chargeAPIData.local_price.amount,
                currency: chargeAPIData.local_price.currency
            },
        }

       const response = await Coinbase.createCharge(bodyData);
       console.log(response.timeline[response.timeline.length -1])
       if(response.code === "ETIMEDOUT") throw new ApiError(response.code, httpStatus.REQUEST_TIMEOUT, "Request timeout!")
       if(response.code === "EAI_AGAIN") throw new ApiError(response.code, httpStatus.REQUEST_TIMEOUT, "Network unavalaible!")
       if(!response.expires_at) throw new ApiError(response.code, httpStatus.BAD_REQUEST, "Something Went Wrong!")

    //    console.log()
       const createDepositRecord = {
        clientId: req.id,
        chargeID: response.code,
        plan: response.name,
        ...depoInfoData,
        status: response.timeline[response.timeline.length -1]?.status,
        expiresAt: response.expires_at
       }

       const create = await userDeposit.create(createDepositRecord);

       await create.save();

    //    send email.

       res.send({message: "Redirecting...", data: {next: createDepositRecord.chargeID}})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}



serviceController.getAllDepositRequest = async function(req,res,next) {
    try {
        // we communicate with a third party api - Coinbase
        const depositList = await userDeposit.findAll({where: {clientId: req.id }});
        console.log(depositList)
        res.send(depositList)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

serviceController.getAllSuccessfulInvesment = async function(req,res,next) {
    try {
        // we communicate with a third party api - Coinbase
        const successfulInvestment = await userDeposit.findAll({where: {clientId: req.id, status: "SUCCESSFUL"}});
        console.log(successfulInvestment)
        res.send(successfulInvestment)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

export default serviceController;