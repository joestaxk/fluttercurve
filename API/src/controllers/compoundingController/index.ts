import httpStatus from "http-status";
import compoundingDeposit from "../../models/mode/compoundingDeposit";
import ApiError from "../../utils/ApiError";
import compoundingPlans, {
  compoundingPlanInterface,
} from "../../models/services/compundingPlans";
import Coinbase from "../../services/userServices/coinbase";
import send_mail, { EmailTemplate } from "../../services/email-service";
import helpers from "../../utils/helpers";
import { buildCompondingPlans } from "../../services/buildDepositPlans";
import userTransaction from "../../models/Users/transactions";
import adminNotification from "../../models/Users/adminNotifications";
import serviceController from "../serviceController";

interface compoundongControllerInterface {
  getAllCompoundingSuccessfulInvesment: (
    req: any,
    res: any,
    next: any
  ) => Promise<void>;
  getAllCompoundingDepositRequest: (
    req: any,
    res: any,
    next: any
  ) => Promise<void>;
  getACompoundingPlans: (req: any, res: any, next: any) => Promise<void>;
  getCompoundingPlans: (req: any, res: any, next: any) => Promise<void>;
  makeInvestment: (req: any, res: any, next: any) => Promise<void>;
}

var compoundingController = {} as compoundongControllerInterface;

compoundingController.makeInvestment = async function (req, res, next) {
  const { compoundingPeriod, amount, id, currency } = req.body;

  try {
    const getApiKey = await serviceController.getGeneralSettings();
    if (!getApiKey?.coinBaseApiKey) {
      adminNotification.create({
        type: "ALERT",
        message: "Please provide your Coinbase ApiKey. ASAP!!!"
      })
      throw new ApiError("Not ready", httpStatus[404], "Provide an Api Key");
    }

    
    if (!compoundingPeriod || !id || !amount || !currency)
      throw new ApiError(
        "Invalid Data",
        httpStatus.BAD_REQUEST,
        "Invalid Input Data"
      );
    // get the plan by id
    const comp_: compoundingPlanInterface<string> =
      (await compoundingPlans.findOne({ where: { uuid: id } })) as any;

    // get required information to populate the compoundingDeposit table;
    let data: any = {
      plan: comp_.plan,
      intrestRate: comp_.interestRate,
      investedAmt: amount,
      duration: compoundingPeriod,
      progressAmt: 0,
      remainingDays: 0,
    };

    // make payments
    const bodyData: any = {
      description: data.plan,
      metadata: {
        customer_id: req.id,
        customer_name: req.email,
      },
      name: data.plan,
      pricing_type: "fixed_price",
      local_price: {
        amount,
        currency,
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

    data = Object.assign(data, {
      clientId: req.id,
      userId: req.primaryKey,
      chargeID: response.code,
      status: response.timeline[response.timeline.length - 1]?.status,
      expiresAt: response.expires_at,
      lastUpdated: Date.now(),
    });

    const create:any = await compoundingDeposit.create(data);

    await create.save();

    //send email.
    const template = `
        <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:2rem">You Have just initiated ${
          data.plan
        } investment of ${helpers.currencyFormatLong(
      data.investedAmt,
      currency
    )}</p>
        <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:4rem">This process is will be active for 60 minutes, Quickly login, go to <b>My Compounding</b> and continue payment, or click the link below.</p>
        <a href="https://commerce.coinbase.com/charges/${data.chargeID}">
        <button style="display:flex;align-items:center;gap:1;margin-top:2rem;background:#514AB1;border-radius:1rem;color:#fff;padding:.8rem">
            <span>Make Payment</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#f8f8f8" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L764.736 512L452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L508.736 512L196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg></button>
        </a>
    `;
    const htmlMarkup = EmailTemplate({ user: req.userName, template });

    // Send using cb
    send_mail(
      `${data.plan}, Plan, Initiated.`,
      htmlMarkup,
      req.email,
      async function (done, err) {
        if (err) {
          await compoundingDeposit.destroy({
            where: { chargeID: data.chargeID },
          });
          //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
          return res
            .status(httpStatus.BAD_REQUEST)
            .send({ message: "Service unavailable" });
        }

        // console.log(
        //   {
        //     userId: req.id,
        //     depositId: create.id,
        //     invoiceID: helpers.generateInvoiceId(),
        //     amount,
        //     type: "deposit",
        //     mode: "compounding",
        //   }
        // )
        // await userTransaction.create({
        //   userId: req.id,
        //   depositId: create.id,
        //   invoiceID: helpers.generateInvoiceId(),
        //   amount,
        //   type: "deposit",
        //   mode: "compounding",
        // });

        res.send({
          message: "Redirecting to Payment Gateway, Open My Investment if redirection didn't work.",
          next: data.chargeID,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

compoundingController.getCompoundingPlans = async function (req, res, next) {
  try {
    // create the first and data for the plans.
    const ifExist = await compoundingPlans.findAll();
    if(!ifExist.length) {
      adminNotification.create({
        type: "ALERT",
        message: "Please Generate a pre-sample for compounding plans.",

      })
    }
    if (ifExist.length) {
      return res.send(ifExist);
    }
    res.send([]);
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

compoundingController.getACompoundingPlans = async function (req, res, next) {
  try {
    const uuid = req.query.calculateId;
    // create the first and data for the plans.
    const ifExist = await compoundingPlans.findOne({ where: { uuid } });
    if (ifExist) {
      res.send(ifExist);
    }
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

compoundingController.getAllCompoundingDepositRequest = async function (
  req,
  res,
  next
) {
  try {
    // we communicate with a third party api - Coinbase
    const depositList = await compoundingDeposit.findAll({
      where: { clientId: req.id },
    });
    res.send(depositList);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

compoundingController.getAllCompoundingSuccessfulInvesment = async function (
  req,
  res,
  next
) {
  try {
    // we communicate with a third party api - Coinbase
    const successfulInvestment = await compoundingDeposit.findAll({
      where: { clientId: req.id, status: "SUCCESSFUL" },
    });
    res.send(successfulInvestment);
  } catch (error) {
    console.log(error);
    res.status(httpStatus.BAD_REQUEST).send(error);
  }
};

export default compoundingController;
