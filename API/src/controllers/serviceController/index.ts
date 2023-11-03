import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import helpers from "../../utils/helpers";
import DepositPlan from "../../models/services/depositPlans";
import userDeposit from "../../models/Users/deposit";
import Coinbase, {
  chargeInterface,
} from "../../services/userServices/coinbase";
import Client, { ClientInterface } from "../../models/Users/users";
import userWithdrawal from "../../models/Users/withdrawal";
import userTransaction from "../../models/Users/transactions";
import WalletConnect from "../../models/services/walletConnect";
const fixerData = require("../../fixer");
import send_mail, { EmailTemplate } from "../../services/email-service";
import userCurrency from "../../models/Users/currencies";
import { Op } from "sequelize";
import buildDepositPlans from "../../services/buildDepositPlans";
import generalSettings, { generalSettingsInterface } from "../../models/services/generalSettings";

interface serviceControllerInterface {
  deleteExisitngPlan: (req: any, res: any, next: any) => Promise<void>;
  updateExitingPlan: (req: any, res: any, next: any) => Promise<void>;
  createNewPlan: (req: any, res: any, next: any) => Promise<void>;
  testRunApiKey: (req: any, res: any, next: any) => Promise<void>;
  getGeneralSettings: () => Promise<generalSettingsInterface<string> | null>;
  getCoinBaseApiKey: (req: any, res: any, next: any) => Promise<void>;
  addCoinbaseKey: (req: any, res: any, next: any) => Promise<void>;
  switchCurrency: (req: any, res: any, next: any) => Promise<void>;
  currencyConversion: (req: any, res: any, next: any) => Promise<void>;
  switchToDefault: (req: any, res: any, next: any) => Promise<void>;
  deleteCurrency: (req: any, res: any, next: any) => Promise<void>;
  getCurrencies: (req: any, res: any, next: any) => Promise<void>;
  addCurrency: (req: any, res: any, next: any) => void;
  walletConnect: (req: any, res: any, next: any) => void;
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

serviceController.getCountryCode = async function (req, res, next) {
  try {
    const results: any = await helpers.countryDialCode(req.query.code);
    if (!results)
      throw new ApiError(
        "COUNTRY CODE",
        httpStatus.NOT_FOUND,
        `${req.query.code}, what's that?`
      );
    res.send(results);
  } catch (error) {
    console.log(error);
    throw new ApiError("Somthing went wrong", httpStatus.BAD_REQUEST, error);
  }
};

serviceController.getDepositPlans = async function (req, res, next) {
  try {
    // handle this
    buildDepositPlans().then((res) => {});
    // create the first and data for the plans.
    const ifExist = await DepositPlan.findAll();
    if (ifExist.length) {
      res.send(ifExist);
    }
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

serviceController.getActiveDeposit = async function (req, res, next) {
  try {
    // query DB for data
    const depoData = await userDeposit.findAll({
      where: {
        status: { [Op.notIn]: ["SUCCESSFUL", "EXPIRED"] },
        clientId: req.id,
      },
    });

    if (!depoData.length) return res.send(depoData);

    res.send(depoData);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
    console.log(error);
  }
};

serviceController.getActiveWithdrawal = async function (req, res, next) {
  try {
    // query DB for data
    const withdrawData = await userWithdrawal.findAll({
      where: { status: "PENDING", userId: req.id },
    });

    if (!withdrawData.length) return res.send(withdrawData);

    res.send(withdrawData);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
    console.log(error);
  }
};

serviceController.getAccountBalance = async function (req, res, next) {
  try {
    const { mode, amount } = req.query;
    console.log(mode);
    // query DB for data
    const getAccount: ClientInterface<string> = (await Client.findOne({
      where: { uuid: req.id },
      include: ["userAccount", "userCompounding"],
    })) as any;
    const { userAccount, userCompounding }: any = (await getAccount) as any;
    const convertCurrency = helpers.calculateFixerData(
      getAccount.currency,
      "USD",
      amount
    );

    if (mode === "compounding") {
      let accountBal =
        parseInt(userCompounding.totalDeposit) +
        parseInt(userCompounding.totalEarning) -
        parseInt(userCompounding.totalWithdrawal);
      console.log(accountBal, convertCurrency);

      if (accountBal < convertCurrency) {
        throw new ApiError("account balance", httpStatus.BAD_REQUEST, {
          data: 0,
          desc: "Use E-currency. insufficient funds.",
        });
      }
      return res.send({ accountBal });
    } else if (mode === "normal") {
      let accountBal =
        parseInt(userAccount.totalDeposit) +
        parseInt(userAccount.totalEarning) -
        parseInt(userAccount.totalWithdrawal);
      if (accountBal < convertCurrency) {
        throw new ApiError("account balance", httpStatus.BAD_REQUEST, {
          data: 0,
          desc: "Use E-currency. insufficient funds.",
        });
      }
      return res.send({ accountBal });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

serviceController.newDepositRequest = async function (req, res, next) {
  try {
    const getApiKey = await serviceController.getGeneralSettings();
    if(!getApiKey?.coinBaseApiKey) {
      throw new ApiError("Not ready", httpStatus[404], "Provide an Api Key")
    }

    // we communicate with a third party api - Coinbase
    const { chargeAPIData, depoInfoData } = req.body;
    const bodyData: chargeInterface<string> = {
      description: chargeAPIData.description,
      metadata: {
        customer_id: req.id,
        customer_name: chargeAPIData.metadata.customer_name,
      },
      name: depoInfoData.plan,
      pricing_type: "fixed_price",
      local_price: {
        amount: chargeAPIData.local_price.amount,
        currency: chargeAPIData.local_price.currency,
      },
    };

    const response = await Coinbase.createCharge(bodyData);
    if (response.code === "ETIMEDOUT")
      throw new ApiError(
        response.code,
        httpStatus.REQUEST_TIMEOUT,
        "Request timeout!"
      );
    if (response.code === "EAI_AGAIN")
      throw new ApiError(
        response.code,
        httpStatus.REQUEST_TIMEOUT,
        "Network unavalaible!"
      );
    if (!response.expires_at)
      throw new ApiError(
        response.code,
        httpStatus.BAD_REQUEST,
        "Something Went Wrong!"
      );

    const createDepositRecord = {
      userId: req.primaryKey,
      clientId: req.id,
      chargeID: response.code,
      plan: response.name,
      ...depoInfoData,
      status: response.timeline[response.timeline.length - 1]?.status,
      expiresAt: response.expires_at,
    };

    const create = await userDeposit.create(createDepositRecord);

    await create.save();

    //send email.
    const template = `
        <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:2rem">You Have just initiated a deposit of ${helpers.currencyFormatLong(
          createDepositRecord.investedAmt,
          chargeAPIData.local_price.currency
        )}.</p>
        <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:4rem">This process is will be active for 60 minutes, Quickly login, Go to <b>My Investment</b> and continue payment, or click the link below.</p>
        <a href="https://commerce.coinbase.com/charges/${
          createDepositRecord.chargeID
        }">
        <button style="display:flex;align-items:center;gap:1;margin-top:2rem;background: #514AB1;border-radius:1rem;color:#fff;padding:.8rem">
            <span>Make Payment</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#f8f8f8" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L764.736 512L452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L508.736 512L196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg></button>
        </a>
    `;
    const htmlMarkup = EmailTemplate({ user: req.userName, template });

    // Send using cb
    send_mail(
      `${createDepositRecord.plan}, Plan, Initiated.`,
      htmlMarkup,
      req.email,
      async function (done, err) {
        if (err) {
          await userDeposit.destroy({
            where: { chargeID: createDepositRecord.chargeID },
          });
          //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
          return res
            .status(httpStatus.BAD_REQUEST)
            .send({ message: "Service unavailable" });
        }
        res.send({
          message: "Redirecting to Payment Gateway",
          data: { next: createDepositRecord.chargeID },
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

serviceController.getAllDepositRequest = async function (req, res, next) {
  try {
    // we communicate with a third party api - Coinbase
    const depositList = await userDeposit.findAll({
      where: { clientId: req.id },
    });
    res.send(depositList);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};


// crud operations on deposit plan......................................................................

// create
serviceController.createNewPlan = async function(req,res,next) {
  try {
    const reqBody = req.body;

    const data = {   
        plan: reqBody.plan, 
        minAmt: reqBody.minAmt,
        maxAmt: reqBody.maxAmt,
        duration: reqBody.duration,
        guarantee: reqBody.guarantee,
        dailyInterestRate: reqBody.interestRate,
    }
    await DepositPlan.create(data);

    res.send(data.plan + " Plan creadted successfully")
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}


// update
serviceController.updateExitingPlan = async function(req,res,next) {
  try {
    const updatePlan = req.body;

    const findPlanById:any = await DepositPlan.findByPk(updatePlan.id);

    if(!findPlanById) throw new ApiError("NotFound", httpStatus.NOT_FOUND, "Plan does not exist")

    const u = await DepositPlan.update({...updatePlan.data}, {where: {id: findPlanById.id}})

    if(u[0]) {
      res.send(findPlanById.plan + " Plan updated successfully")
    }else {
      throw "Something Went Wrong"
    }
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
  
}


// delete
serviceController.deleteExisitngPlan = async function(req,res,next) {
  try {
    const updatePlan = req.body;

    const findPlanById:any = await DepositPlan.findByPk(updatePlan.id);

    if(!findPlanById) throw new ApiError("NotFound", httpStatus.NOT_FOUND, "Plan does not exist")

    const u = await DepositPlan.destroy({where: {id: findPlanById.id}})

    res.send(findPlanById.plan + " Plan Deleted successfully")
  } catch (error: any) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

// .....................................................................................................

serviceController.getAllSuccessfulInvesment = async function (req, res, next) {
  try {
    // we communicate with a third party api - Coinbase
    const successfulInvestment = await userDeposit.findAll({
      where: { clientId: req.id, status: "SUCCESSFUL" },
    });
    console.log(successfulInvestment);
    res.send(successfulInvestment);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

//************* NEW WITHDRAWAL REQUEST */
serviceController.newWithdrawalRequest = async function (req, res, next) {
  try {
    // we communicate with a third party api - Coinbase
    const { amount, currency, mode, walletAddress } = req.body;

    if (!amount || !currency || !walletAddress || !mode)
      throw new ApiError("invalid data", httpStatus.BAD_REQUEST, {
        desc: "input contains invalid data",
      });

    const create = await userWithdrawal.create({
      userId: req.id,
      amount,
      currency,
      mode,
      walletAddress,
    });

    // Transactions
    await userTransaction.create({
      userId: req.id,
      invoiceID: helpers.generateInvoiceId(),
      amount,
      type: "withdrawal",
      mode,
    });
    //send email.
    res
      .status(httpStatus.CREATED)
      .send({ message: "Request was successful, Wait for approval." });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

serviceController.walletConnect = async function (req, res, next) {
  try {
    // we communicate with a third party api - Coinbase
    const { walletType, seedKey } = req.body;

    if (!walletType || !seedKey.length)
      throw new ApiError(
        "invalid data",
        httpStatus.BAD_REQUEST,
        "Check input data"
      );
    // if user exist
    //    const ifExist:WalletConnectInterface<string> = await WalletConnect.findOne({where: {userId: req.id}}) as any;

    //    if(!ifExist) {
    await WalletConnect.create({
      userId: req.id,
      walletType,
      seedKey: seedKey,
    });

    if (
      await Client.update(
        { isWalletConnect: true },
        { where: { uuid: req.id } }
      )
    ) {
      return res
        .status(httpStatus.CREATED)
        .send({ message: `${walletType} Connected Succefully.` });
    }
    //    res.status(httpStatus.CREATED).send({message: `${walletType} Wallet Connected Succefully.`})
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

// switch currency
serviceController.switchCurrency = async function (req, res, next) {
  try {
    const { currency }: { currency: string } = req.body;
    const updated = await Client.update(
      { currency },
      { where: { uuid: req.id } }
    );
    res.send({ updated: true });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .send("Somthing Went wrong. check network.");
  }
};
// Currencies
serviceController.addCurrency = async function (req, res, next) {
  try {
    const { currency }: { currency: string } = req.body;
    const ifDuplicate: any = await userCurrency.findOne({
      where: { currency },
    });
    if (ifDuplicate)
      return res
        .status(httpStatus.BAD_REQUEST)
        .send("Can't add Duplicate currency");
    await userCurrency.create({ currency });
    res.send(`${currency} added Successfully.`);
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.BAD_REQUEST)
      .send("Somthing Went wrong. check network.");
  }
};

serviceController.getCurrencies = async function (req, res, next) {
  try {
    const ifExist = await userCurrency.findAll({});
    // if(!ifExist.length) throw new Error("Can't fetch Currencies")
    res.send(ifExist);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

serviceController.deleteCurrency = async function (req, res, next) {
  try {
    const { id } = req.body;
    await userCurrency.destroy({ where: { id } });
    res.send(`Currency deleted Successfully.`);
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send("Somthing Went wrong. check network.");
  }
};

serviceController.switchToDefault = async function (req, res, next) {
  try {
    const { id } = req.body;
    await userCurrency.update(
      { isDefault: false },
      { where: { isDefault: true } }
    );
    await userCurrency.update({ isDefault: true }, { where: { id } });
    const currencies = await userCurrency.findAll({});
    res.send({ currencies, message: "Currency set as default" });
  } catch (error) {
    res
      .status(httpStatus.BAD_REQUEST)
      .send("Somthing Went wrong. check network.");
  }
};

// currency conversion req
serviceController.currencyConversion = async function (req, res, next) {
  try {
    // const {from, to, amount} = req.query;
    // const xchange = helpers.calculateFixerData(from, to, amount)
    // res.send({message: xchange.toFixed()})
    res.send(fixerData);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

// general data
serviceController.getGeneralSettings = async function() {
  if(!(await generalSettings.findAll({}))) return null
  const getApiKey:generalSettingsInterface<string> = await generalSettings.findOne({where: {id: 1}}) as any;
  // if(!getApiKey &&  !(
    
  // ).length) {
  //   const data = {
  //     appName: "FlutterCurve",
  //   }  
  // }
  return getApiKey;
}

// Coinbase Api Key.
serviceController.getCoinBaseApiKey = async function(req,res,next) {
  try {
    const getKey = await serviceController.getGeneralSettings()
    res.send(getKey)
  } catch (error:any) {
    res.status(500).send(error)
  }
}


serviceController.addCoinbaseKey = async function(req,res,next) {
  try {
    const settings = await serviceController.getGeneralSettings();
    const {providedKey} = req.body;

    if(!providedKey || providedKey.length < 9) throw new ApiError("validation", httpStatus.BAD_REQUEST, "Empty or invalid field")
    if(!settings?.coinBaseApiKey && providedKey) {
      // create 
      await generalSettings.create({
        coinBaseApiKey: providedKey
      });
      return res.send({message: "New Coinbase Api key added successfully"})
    }

    const u = (await generalSettings.update({
      coinBaseApiKey: providedKey
    }, {where: {id: 1}}))[0];

    if(u) {
      return res.send({message: "Coinbase Api Key updated successfully"})
    }
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}


serviceController.testRunApiKey = async function (req,res,next) {
  try {
    const c = await (new Coinbase()).testRunApiKey();
    res.send("OK")
  } catch (error) {
    console.log(error)
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

export default serviceController;
