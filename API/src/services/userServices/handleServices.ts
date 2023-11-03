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
  updateEarning: ({
    plan,
    duration,
    investedAmt,
    progressAmt,
    remainingDays,
    investmentCompleted,
    status,
    expiresAt,
    createdAt,
    updateTimestamp,
  }: any) => Promise<void>;
}

let handleServices = {} as handlerServiceInterface;

// deposit onlLY
/**
 *
 * @param chargeID
 * @returns
 *
 * @description `What happens here? when a user make a deposit, we keep in check for successful update`
 */
handleServices.successfulDepositCharge = async function (chargeID: string) {
  const res: any = await userDeposit.findOne({ where: { chargeID } });
  if (!res?.clientId) return;

  // we got the user so as to send client mail
  const { uuid, id, userName, fullName, email, ipAddress, currency }: any =
    await Client.findOne({ where: { uuid: res.clientId } });

  // UPDATE USERACCOUNT
  // get the user wallet account
  const ifAny = await userAccount.findOne({ where: { clientId: id } });
  // Each time a new user wallet is created, that user just made some investment.

  // Before we set a new deposit as "SUCCESSFUL", lets make sure the plan is just updating an existig plan
  // with same plan name
  const checkForAnyExistingPlan: any = await userDeposit.findOne({
    where: {
      clientID: uuid,
      plan: res?.plan,
      status: "SUCCESSFUL",
    },
  });
  // whatever goes in here is existing plans
  if (checkForAnyExistingPlan) {
    // get the new invested amount and then add it to the old one.
    const newInvestedAmt = (
      parseFloat(res.investedAmt) +
      parseFloat(checkForAnyExistingPlan.investedAmt)
    ).toString();

    const newProgressAmt = (
      parseFloat(res.progressAmt) +
      parseFloat(checkForAnyExistingPlan.progressAmt)
    ).toString();

    // update the existing one
    const u = (
      await userDeposit.update(
        {
          investedAmt: newInvestedAmt,
          progressAmt: newProgressAmt,
          clientID: res.chargeID,
        },
        { where: { chargeID: checkForAnyExistingPlan.chargeID } }
      )
    )[0];

    if (u) {
      // destroy the new investment record
      userDeposit.destroy({
        where: {
          chargeID: res.chargeID,
        },
      });
    }
  }else {
    // Each time a new user wallet is created, that user just made some investment.
    await userDeposit.update({ status: "SUCCESSFUL" }, { where: { chargeID } });
  }

  // new deposit alert
  await adminNotification.create({
    clientId: uuid,
    type: "DEPOSIT",
    fullName,
    depositType: res.plan,
    userIp: ipAddress,
  });

  if (!ifAny) {
    // create new account for the user
    await userAccount.create({
      totalDeposit: parseInt(res.investedAmt),
      totalWithdrawal: 0,
      totalEarning: 0,
      clientId: id,
    });
    return true;
  }

  // why this line: this is because a user can only have 1 account, so we update this incase of any new deposit.
  await userAccount.increment("totalDeposit", {
    by: parseInt(res.investedAmt),
    where: {
      clientId: id,
    },
  });

  // STORE A EMAIL and send later
  await templates.successfulChargeMailTemplate(
    uuid,
    [
      {
        type: "p",
        msg: `Congratulations. Your Deposit of ${helpers.currencyFormatLong(
          res?.investedAmt,
          currency
        )}, has been credited to wallet successfully. Your ${
          res.plan
        } Investment Plan, starts from today.
                Login into your account to keep track of what's going on.`,
      },
      {
        type: "a",
        link: config.APP_URI,
        value: "Confirm Deposit Now",
      },
    ],
    email,
    userName
  );

  return true;
};

handleServices.updateEarning = async function ({
  clientId,
  chargeID,
  duration,
  investedAmt,
  progressAmt,
  intrestRate,
  remainingDays,
  status,
  investmentCompleted,
  updateTimestamp,
  expiresAt,
}: any) {
  if (status !== "SUCCESSFUL") return;

  console.log(`Working on depositing services......`);

  if (investmentCompleted) return;

  const timeFrame: any = helpers.calcTimeDifferenceInHours(updateTimestamp);

  // check if current date and previous day are equal
  if (timeFrame > 23) {
    ++remainingDays;

    userDeposit.update(
      {
        remainingDays: remainingDays,
      },
      { where: { chargeID } }
    );
  }

  // Check if it's been at least 7 days (168 hours) since the last update
  const expiredTimeFrame: any = helpers.calcTimeDifferenceInHours(expiresAt);
  const sevenDays = 168;
  if (expiredTimeFrame < sevenDays) {
    return console.log("Not enough time has passed (less than 7 days).");
  }

  // //   what if we suspend the payment for 2 weeks
  // const calculateWksSuspended = (timeFrame/sevenDays)
  const earnings = calculateEarnings(
    parseInt(investedAmt) + parseInt(progressAmt),
    parseFloat(intrestRate),
    duration
  );
  await userDeposit.increment("progressAmt", {
    by: earnings,
    where: { chargeID },
  });

  userDeposit.update(
    {
      remainingDays: 1,
      expiresAt: new Date().toLocaleString(),
    },
    { where: { chargeID } }
  );

  const getUserId = (await Client.findOne({
    where: { uuid: clientId },
  })) as any;
  if (getUserId)
    // console.log(getUserId)
    await userAccount.increment("totalEarning", {
      by: earnings,
      where: {
        clientId: getUserId.id,
      },
    });
};

function calculateEarnings(
  investedAmt: number,
  interestRate: number,
  targetDay: number
) {
  // Calculate the value of the investment at the end of the target day
  var valueAtTargetDay = investedAmt * interestRate;
  // Round the earnings to 2 decimal places
  const earningsForTargetDay = valueAtTargetDay.toFixed(2);

  return parseFloat(earningsForTargetDay);
}

export default handleServices;
