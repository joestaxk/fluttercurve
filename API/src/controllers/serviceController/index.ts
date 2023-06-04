import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import helpers from "../../utils/helpers";
import DepositPlan from "../../models/services/depositPlans";
import userDeposit from "../../models/Users/deposit";
import Coinbase, { chargeInterface } from "../../services/userServices/coinbase";
import Client, { ClientInterface } from "../../models/Users/users";
import { userAccountInterface } from "../../models/Users/userAccount";
import userWithdrawal from "../../models/Users/withdrawal";
import userTransaction from "../../models/Users/transactions";

interface serviceControllerInterface {
    newWithdrawalRequest: (req: any, res: any, next: any) => Promise<void>;
    getActiveWithdrawal: (req: any, res: any, next: any) => Promise<any>;
    getAccountBalance: (req: any, res: any, next: any) => Promise<any>;
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
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

serviceController.getActiveDeposit = async function(req,res,next) {
    try {
        // query DB for data
        const depoData = await userDeposit.findAll({where: {status: "NEW", clientId: req.id}});

        if(!depoData.length) return res.send(depoData);

        res.send(depoData)
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
        console.log(error)
    }
}

serviceController.getActiveWithdrawal = async function(req,res,next) {
    try {
        // query DB for data
        const withdrawData = await userWithdrawal.findAll({where: {status: "PENDING", userId: req.id}});

        if(!withdrawData.length) return res.send(withdrawData);

        res.send(withdrawData)
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
        console.log(error)
    }
}




serviceController.getAccountBalance = async function(req,res,next) {
    try {
        // query DB for data
        const getAccount:ClientInterface<string> = await Client.findOne({where: {uuid: req.id}}) as any;
        const acct = getAccount.userAccount as userAccountInterface<string>;
        if(!acct) throw new ApiError("account balance", httpStatus.BAD_REQUEST, {data: 0, desc: "Use E-currency. insufficient funds."})

        const accountBal = parseInt(acct.totalDeposit) - parseInt(acct.totalWithdrawal);
        res.send(accountBal);
    } catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
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
        res.status(httpStatus.BAD_REQUEST).send(error)
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
        res.status(httpStatus.BAD_REQUEST).send(error)
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
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}


//************* NEW WITHDRAWAL REQUEST */
serviceController.newWithdrawalRequest = async function(req,res,next) {
    try {
        // we communicate with a third party api - Coinbase
       const  {
        amount,
        currency,
        walletAddress
       } = req.body;

       if(!amount || !currency || !walletAddress) throw new ApiError("invalid data", httpStatus.BAD_REQUEST, {desc: "input contains invalid data"})

       const create = await userWithdrawal.create({
        userId: req.id,
        amount,
        currency,
        walletAddress
       });

       // Transactions
       await userTransaction.create({
        userId: req.id,
        invoiceID: helpers.generateInvoiceId(),
        amount,
       })
        //send email.
       res.status(httpStatus.CREATED).send({message: "Request was successful, Wait for approval."})
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

export default serviceController;