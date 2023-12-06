import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext, ManageSingleUserLoader } from "../listData";
import adminAuth from "../../../lib/adminAuth";
import helpers from "../../../helpers";
import useAlert from "../../../hooks/alert";
import ButtonSpinner from "../../utils/buttonSpinner";
import { PencilIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function OngoingInvestment() {
  const [user, setUser] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const { showAlert, AlertComponent } = useAlert();
  const [suspendLoading, setSuspendLoad] = useState(false);
  const [endLoading, setEndLoad] = useState(false);
  const [approvalLoading, setApprovalLoad] = useState(false);
  const context = useContext(CreateUserIDContext);

  const [toggleUpdateState, setToggleUpdateState] = useState<any>({});
  const [ongoingUpdateLoader, setOngoingUpdateLoader] = useState(false);

  useEffect(() => {
    adminAuth
      .getAllUserDeposit(context.ID)
      .then((res: any) => {
        setUser([...res?.data]);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [context.ID, ongoingUpdateLoader, suspendLoading, endLoading, approvalLoading]);

  useEffect(() => {
    if (!user.length) return;
    setData(user);
  }, [user]);

  function endInvestment(chargeID:string) {
    adminAuth
      .endInvestment(chargeID)
      .then((res: any) => {
        setEndLoad(false);
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        setEndLoad(false);
        showAlert("error", err.response.data.description);
      });
  }

  function suspendData({
    chargeID,
    investmentCompleted,
  }: {
    chargeID: string;
    investmentCompleted: string;
  }) {
    setSuspendLoad(true);
    adminAuth
      .suspendUserDeposit(chargeID, investmentCompleted)
      .then((res: any) => {
        setSuspendLoad(false);
        showAlert("success", res.data.message);
      })
      .catch((err: any) => {
        setSuspendLoad(false);
        showAlert("error", err.response.data.description);
      });
  }
  function manualApproval({
    chargeID,
    type,
  }: {
    chargeID: string;
    type: string;
  }) {
    setApprovalLoad(true);
    adminAuth
      .manualApproval(chargeID, type)
      .then((res: any) => {
        setApprovalLoad(false);
        showAlert("success", res.data.message);
      })
      .catch((err: any) => {
        setApprovalLoad(false);
        showAlert("error", err.response.data.description);
        console.log(err);
      });
  }

  function updateOngoingInvestment(ev: any) {
    ev.preventDefault();
    const forms = ev.target;
    const data = {
        id: forms.submitForm.dataset.chargeid,
        depositedAmt: forms.depositedAmt.value,
        earnings: forms.earnings.value,
        remainingDays: forms.remainingDays.value,
    };

    setOngoingUpdateLoader(true);
    adminAuth
      .updateOngoingInvestment(data)
      .then((res: any) => {
        setOngoingUpdateLoader(false);
        setToggleUpdateState((prev:any) => {return {...prev, [data.id] : false}})
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        setOngoingUpdateLoader(false);
        showAlert("success", err.response.data.description);
      });
  }
  return (
    <div className="">
      {typeof user === "undefined" ? (
        <ManageSingleUserLoader />
      ) : (
        <>
          <div className="mt-5">
            <h2 className="text-xl font-medium text-[#212121cc]">
              Investments
            </h2>
            {!toggleUpdateState && (
              <p className="text-red-500 text-sm my-2">
                Notice the change in currency, make sure you know what you're
                doing before making the changes
              </p>
            )}
          </div>
          <div className="w-full overflow-y-auto rounded-2xl border-[1px] border-gray-100 mt-1">
            <form onSubmit={updateOngoingInvestment} method="post">
              <table className="w-full border-[#e6e4e4] border-[1px]">
                <thead className="bg-[#f3f3f3]">
                  <tr className="text-left">
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 font-medium">Earnings</th>
                    <th className="p-3 font-medium">Progress</th>
                    <th className="p-3 font-medium">Suspend</th>
                    <th className="p-3 font-medium">End plan</th>
                    <th
                      className="p-3 font-medium"
                      title="Use this when the user complains that the payment is taking time."
                    >
                      Approve
                    </th>
                    <th
                      className="p-3 font-medium"
                      title="Use this when the user complains that the payment is taking time."
                    >
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="border-[#e6e4e4] border-[1px]">
                  {!data.length ? (
                    <tr className="w-full">
                      <td className="p-3 font-medium text-slate-600">
                        No Investment
                      </td>
                    </tr>
                  ) : (
                    data.map(
                      ({
                        plan,
                        type,
                        status,
                        chargeID,
                        investedAmt,
                        progressAmt,
                        duration,
                        remainingDays,
                        investmentCompleted,
                      }: any) => {
                        if(status === "RESOLVED") return;
                        return (
                        <tr key={chargeID} className="text-left">
                          <td className="p-3 font-medium flex gap-1 items-center">
                            <div className="relative">
                              <div
                                className={`animate-ping w-[15px] h-[15px] rounded-3xl ${
                                  status === "SUCCESSFUL"
                                    ? `bg-emerald-300`
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              <div
                                className={`absolute top-1 left-[3px] w-[7.5px] h-[7.5px] rounded-3xl ${
                                  status === "SUCCESSFUL"
                                    ? `bg-emerald-800`
                                    : "bg-gray-400"
                                }`}
                              ></div>
                            </div>
                            <div
                              className={
                                status === "SUCCESSFUL"
                                  ? `text-emerald-600`
                                  : `text-gray-600`
                              }
                            >
                              {!investmentCompleted && status}
                              {investmentCompleted && "Completed"}
                            </div>
                          </td>
                          <td className="p-3 font-medium text-slate-600">
                            {plan} Plan
                          </td>
                          <td className="p-3 font-medium text-slate-600">
                            <div className="">
                              {helpers.currencyFormatLong(
                                helpers.calculateFixerData(
                                  "USD",
                                  context?.user.currency,
                                  investedAmt
                                ),
                                context?.user.currency
                              )}{" "}
                            </div>

                            {toggleUpdateState[chargeID] && (
                              <input
                                type="number"
                                name="depositedAmt"
                                className="p-2 disabled:bg-gray-100 rounded-xl w-20"
                                defaultValue={investedAmt}
                              />
                            )}
                          </td>
                          <td className="p-3 font-medium text-emerald-500">
                            <div className="">
                              {helpers.currencyFormatLong(
                                helpers.calculateFixerData(
                                  "USD",
                                  context?.user.currency,
                                  progressAmt
                                ),
                                context?.user.currency
                              )}
                            </div>

                            {toggleUpdateState[chargeID] && (
                              <input
                                type="number"
                                name="earnings"
                                className="p-2 disabled:bg-gray-100 rounded-xl w-24"
                                defaultValue={progressAmt}
                              />
                            )}
                          </td>
                          <td className="p-3 font-medium text-slate-600">
                            <div className="">
                              {remainingDays}/{duration} {type == "normal" ? "days" : "months"}
                            </div>
                            {toggleUpdateState[chargeID] && (
                              <input
                                type="number"
                                name="remainingDays"
                                className="p-2 disabled:bg-gray-100 rounded-xl w-16"
                                max={duration}
                                min={1}
                                defaultValue={remainingDays}
                              />
                            )}
                          </td>
                          <td className="p-3 font-medium">
                            <button
                              type="button"
                              onClick={suspendData.bind(null, {
                                chargeID,
                                investmentCompleted,
                              })}
                              className="bg-gray-700 p-2 rounded-lg flex gap-1 items-center text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={investmentCompleted}
                            >
                              {suspendLoading && <ButtonSpinner />}
                              <span>Suspend</span>
                            </button>
                          </td>

                          <td className="p-3 font-medium">
                            <button
                              type="button"
                              onClick={endInvestment.bind(null, chargeID)}
                              className="bg-red-700 p-2 rounded-lg flex gap-1 items-center text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={investmentCompleted}
                            >
                              {endLoading && <ButtonSpinner />}
                              <span>End Plan</span>
                            </button>
                          </td>

                          <td className="p-3 font-medium">
                            <button
                              type="button"
                              onClick={manualApproval.bind(null, {
                                chargeID,
                                type,
                              })}
                              className="bg-green-700 p-2 rounded-lg flex gap-1 items-center text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={status === "SUCCESSFUL"}
                            >
                              {approvalLoading && <ButtonSpinner />}
                              <span>Approve</span>
                            </button>
                          </td>

                          <td>
                          {toggleUpdateState[chargeID] && <div className="flex relative group">
                                {/* SAVE DATA */}
                                <button
                                  type="submit"
                                  name="submitForm"
                                  data-chargeId= {chargeID}
                                  className="w-10 z-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all"
                                >
                                  <PencilSquareIcon className="h-6 w-6" />
                                </button>

                                {/* CANCEL DATA */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setToggleUpdateState((prev:any) => {return {...prev, [chargeID] : false}})
                                  }
                                  className="w-10 h-10 group-hover:left-7 inset-0 duration-300 rounded-full absolute bg-red-300 flex items-center justify-center hover:bg-red-100 transition-all"
                                >
                                  <XMarkIcon className="h-6 w-6 group-hover:text-gray-950 text-gray-50" />
                                </button>
                            </div>
                            }

                            <div className="">
                              {!toggleUpdateState[chargeID] && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setToggleUpdateState((prev:any) => {return {...prev, [chargeID] : !toggleUpdateState[chargeID]}})
                                  }
                                  title=""
                                  className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all"
                                >
                                  <PencilIcon className="h-6 w-6" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    )
                  )}
                </tbody>
                {/* 
              <tbody>
                <tr>
                <input type="text" className="p-2 disabled:bg-gray-100 rounded-xl" disabled={true}/>
                </tr>
                <tr>
                <input type="text" className="p-2 disabled:bg-gray-100 rounded-xl" disabled={true}/>

                </tr>
                <tr>
                    <input type="text" className="p-2 disabled:bg-gray-100 rounded-xl" disabled={true}/>
                </tr>
              </tbody> */}
              </table>
            </form>
          </div>
        </>
      )}
      {AlertComponent}
    </div>
  );
}
