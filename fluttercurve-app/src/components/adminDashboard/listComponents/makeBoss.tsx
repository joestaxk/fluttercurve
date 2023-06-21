
import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext } from "../listData";
import { Switch } from '@headlessui/react'
import adminAuth from "../../../lib/adminAuth";
import useAlert from "../../../hooks/alert";


export default function MakeBoss() {
    const [enabled, setEnabled] = useState(false)
    const {AlertComponent, showAlert} = useAlert()

    const context = useContext(CreateUserIDContext)

    useEffect(() => {
        if(typeof context.user === "undefined") return;
        setEnabled(context.user.isAdmin)
    }, [context.ID, context.user])

    function handleSuspense(){
        setEnabled(!context.user.isAdmin)
        adminAuth.makeBoss(context.ID, !context.user.isAdmin).then((res:any) => {
            showAlert('success', res.data)
        }).catch((err:any) => {
            setEnabled(context.user.isAdmin)
            showAlert('error', err.response.data)
        })
    }
    return (
        <div className="">
            <div className="border-[1px] border-red-200 rounded-xl mt-2">
                <div className="mt-5 pl-2">
                    <h2 className="text-xl font-medium text-[#212121cc]">Make Me An Admin</h2>
                    <p className=" text-slate-600">When you give this user high authority, you are giving them a lot of power. However, you have the ability to take away their authority, while they cannot do the same to you.</p>
                </div>
                <div className="bg-red-50 p-3 font-medium flex justify-between">
                    <span className="text-red-800">Enable As ADMIN</span>
                    <div className="flex items-center">
                    <Switch
                        onClick={handleSuspense}
                        checked={enabled}
                        onChange={setEnabled}
                        className={`${
                            enabled ? 'bg-red-600' : 'bg-red-300'
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                        <span className="sr-only">Enable As ADMIN</span>
                        <span
                            className={`${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                    </div>
                </div>
            </div>
            {AlertComponent}
        </div>
    )
}