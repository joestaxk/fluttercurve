import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext, ManageSingleUserLoader } from "../listData";
import adminAuth from "../../../lib/adminAuth";
import helpers from "../../../helpers";
import useAlert from "../../../hooks/alert";
import ButtonSpinner from "../../utils/buttonSpinner";

export default function OngoingInvestment() {
    const [user, setUser] = useState<any>([]);
    const [data, setData] = useState<any>([]);
    const {showAlert, AlertComponent} = useAlert()
    const [suspendLoading, setSuspendLoad] = useState(false)
    const [approvalLoading, setApprovalLoad] = useState(false)
    const context = useContext(CreateUserIDContext);

    useEffect(() => {
        adminAuth.getAllUserDeposit(context.ID)
            .then((res: any) => {
                setUser([...res?.data]);
            })
            .catch((error: any) => {
                console.log(error);
            });
    }, [context.ID]);

    useEffect(() => {
        if(!user.length) return;
        setData(user);
    }, [user]);

    function suspendData({chargeID, investmentCompleted}: {chargeID: string, investmentCompleted: string}) {
        setSuspendLoad(true)
        adminAuth.suspendUserDeposit(chargeID, investmentCompleted).then((res:any) => {
            setSuspendLoad(false)
            showAlert("success", res.data.message)
        }).catch((err: any) => {
            setSuspendLoad(false)
            showAlert("error", err.response.data.description)
            console.log(err)
        })
    }
    function manualApproval({chargeID, type}: {chargeID: string, type: string}, ev:any) {
        setApprovalLoad(true);
        adminAuth.manualApproval(chargeID, type).then((res:any) => {
            setApprovalLoad(false)
            showAlert("success", res.data.message)
        }).catch((err: any) => {
            setApprovalLoad(false);
            showAlert("error", err.response.data.description)
            console.log(err)
        })
    }
    return (
        <div className="">
            {typeof user === 'undefined' ? (
                <ManageSingleUserLoader />
            ) : (
                <>
                    <div className="mt-5">
                        <h2 className="text-xl font-medium text-[#212121cc]">Investments</h2>
                    </div>
                    <div className="w-full overflow-y-auto rounded-2xl border-[1px] border-gray-100 mt-1">
                        <table className="w-full border-[#e6e4e4] border-[1px]">
                            <thead className="bg-[#f3f3f3]">
                                <tr className="text-left">
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium">Name</th>
                                    <th className="p-3 font-medium">Amount</th>
                                    <th className="p-3 font-medium">Earnings</th>
                                    <th className="p-3 font-medium">Progress</th>
                                    <th className="p-3 font-medium">Suspend</th>
                                    <th className="p-3 font-medium" title="Use this when the user complains that the payment is taking time.">Approve</th>
                                </tr>
                            </thead>
                            <tbody className="border-[#e6e4e4] border-[1px]">
                                {!data.length ? (
                                    <tr className="w-full">
                                        <td className="p-3 font-medium text-slate-600">No Investment</td>
                                    </tr>
                                ) : (
                                    data.map(({ plan, type, status, chargeID, investedAmt, progressAmt, duration, remainingDays, investmentCompleted}: any) => (
                                        <tr key={chargeID} className="text-left">
                                            <td className="p-3 font-medium flex gap-1 items-center">
                                                <div className="relative">
                                                    <div className={`animate-ping w-[15px] h-[15px] rounded-3xl ${status === "SUCCESSFUL" ? `bg-emerald-300` : "bg-gray-300"}`}></div>
                                                    <div className={`absolute top-1 left-[3px] w-[7.5px] h-[7.5px] rounded-3xl ${status === "SUCCESSFUL" ? `bg-emerald-800` : "bg-gray-400"}`}></div>
                                                </div>
                                                <div className={status === "SUCCESSFUL" ? `text-emerald-600` : `text-gray-600` }>{status}</div>
                                            </td>
                                            <td className="p-3 font-medium text-slate-600">{plan} Plan</td>
                                            <td className="p-3 font-medium text-slate-600">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", context?.user.currency, investedAmt), context?.user.currency)} </td>
                                            <td className="p-3 font-medium text-emerald-500">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", context?.user.currency, progressAmt), context?.user.currency)}</td>
                                            <td className="p-3 font-medium text-slate-600">{remainingDays}/{duration} days</td>
                                            <td className="p-3 font-medium">
                                            <button 
                                                onClick={suspendData.bind(null, {chargeID, investmentCompleted})}
                                                className="bg-gray-700 p-2 rounded-lg flex gap-1 items-center text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed" disabled={investmentCompleted}>
                                                    {suspendLoading && <ButtonSpinner />}
                                                    <span>Suspend</span>
                                                </button>
                                            </td>

                                            <td className="p-3 font-medium" 
                                            >
                                                <button 
                                                onClick={manualApproval.bind(null, {chargeID, type})}
                                                className="bg-green-700 p-2 rounded-lg flex gap-1 items-center text-gray-100 disabled:opacity-60 disabled:cursor-not-allowed" disabled={status === "SUCCESSFUL"}>
                                                    {approvalLoading && <ButtonSpinner />}
                                                    <span>Approve</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            {AlertComponent}
        </div>
    );
}
