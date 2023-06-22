import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext, ManageSingleUserLoader } from "../listData";
import { Switch } from '@headlessui/react';
import adminAuth from "../../../lib/adminAuth";
import helpers from "../../../helpers";
import useAlert from "../../../hooks/alert";

export default function OngoingInvestment() {
    const [user, setUser] = useState<any>([]);
    const [data, setData] = useState<any>([]);
    const [enable, setEnable] = useState<any>(false);
    const {showAlert, AlertComponent} = useAlert()

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
        setEnable(!investmentCompleted)
        adminAuth.suspendUserDeposit(chargeID, investmentCompleted).then((res:any) => {
            showAlert("success", res.data.message)
        }).catch((err: any) => {
            showAlert("error", err.response.data.description)
            setEnable(!investmentCompleted)
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
                                    data.map(({ plan, status, chargeID, investedAmt, progressAmt, duration, remainingDays, investmentCompleted}: any) => (
                                        <tr key={chargeID} className="text-left">
                                            <td className="p-3 font-medium flex gap-1 items-center">
                                                <div className="relative">
                                                    <div className={`animate-ping w-[15px] h-[15px] rounded-3xl ${status === "SUCCESSFUL" ? `bg-emerald-300` : "bg-gray-300"}`}></div>
                                                    <div className={`absolute top-1 left-[3px] w-[7.5px] h-[7.5px] rounded-3xl ${status === "SUCCESSFUL" ? `bg-emerald-800` : "bg-gray-400"}`}></div>
                                                </div>
                                                <div className={status === "SUCCESSFUL" ? `text-emerald-600` : `text-gray-600` }>{status}</div>
                                            </td>
                                            <td className="p-3 font-medium text-slate-600">{plan} Plan</td>
                                            <td className="p-3 font-medium text-slate-600">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", context?.user.currency,investedAmt), context?.user.currency)} </td>
                                            <td className="p-3 font-medium text-emerald-500">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", context?.user.currency,progressAmt), context?.user.currency)}</td>
                                            <td className="p-3 font-medium text-slate-600">{remainingDays}/{duration} days</td>
                                            <td className="p-3 font-medium">
                                                <Switch
                                                    checked={enable}
                                                    onClick={suspendData.bind(null, {chargeID, investmentCompleted})}
                                                    onChange={setEnable}
                                                    className={`${
                                                        enable ? 'bg-blue-600' : 'bg-gray-200'
                                                    } relative inline-flex h-6 w-11 items-center rounded-full opacity-60`}
                                                >
                                                    <span className="sr-only">Enable notifications</span>
                                                    <span
                                                        className={`${
                                                            enable ? 'translate-x-6' : 'translate-x-1'
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                    />
                                                </Switch>
                                            </td>

                                            <td className="p-3 font-medium">
                                                <Switch
                                                    checked={enable}
                                                    onClick={suspendData.bind(null, {chargeID, investmentCompleted})}
                                                    onChange={setEnable}
                                                    className={`${
                                                        enable ? 'bg-blue-600' : 'bg-gray-200'
                                                    } relative inline-flex h-6 w-11 items-center rounded-full opacity-60`}
                                                >
                                                    <span className="sr-only">Enable notifications</span>
                                                    <span
                                                        className={`${
                                                            enable ? 'translate-x-6' : 'translate-x-1'
                                                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                    />
                                                </Switch>
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
