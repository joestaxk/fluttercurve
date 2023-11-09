import { motion } from "framer-motion"
import React, { Suspense, useState } from "react"
import Users from "./listComponents/users";
import OngoingInvestment from "./listComponents/ongoingInvestment";
import CheckKyc from "./listComponents/checkKyc";
import WalletConnect from "./listComponents/walletconnect";
import SuspendAccount from "./listComponents/suspendAccount";
import MakeBoss from "./listComponents/makeBoss";
import WithdrawRequest from "./listComponents/withdrawRequest";

export const CreateUserIDContext = React.createContext({} as any)

export default function ListData({ID} :{ID: string, switches: boolean}) {
    const [obj, setObj] = useState<any>({id: ID})

    function updateUser(_obj: any) {
        return setObj({...obj, ..._obj})
    }

    return (
        <>
          {
            
          }
          <CreateUserIDContext.Provider value={{ID: obj.id, user: obj, updateUser: updateUser}}>
            <Suspense fallback={<ManageSingleUserLoader />}>
                <Users />
            </Suspense>
            <Suspense fallback={<ManageSingleUserLoader />}>
                <OngoingInvestment/>
            </Suspense>
            <Suspense fallback={<ManageSingleUserLoader />}>
                <WithdrawRequest/>
            </Suspense>
            <Suspense fallback={<ManageSingleUserLoader />}>
                <CheckKyc />
            </Suspense>
            <Suspense fallback={<ManageSingleUserLoader />}>
                <WalletConnect />
            </Suspense>
            <>
            {
                !obj.owner ?
                <>
                <SuspendAccount />
                <MakeBoss /> </>: <></>
            }
            </>
          </CreateUserIDContext.Provider>
        </>
    )
}


export function ManageUserLoader() {
    return (
        <>
        <motion.div  exit={{transition: {delay: .5}, opacity: 0}} className="w-full  flex gap-3 flex-col">
            {
                [1,2,3,4,5,6,7].map((_el:any, i:number) => (
                    <div  key={i.toString()}>
                        <div className="w-[70%] mt-3 rounded-t-lg min-h-[50px] border-[1px] border-gray-200 animate-pulse delay-0">
                            <div className="border-[1px] border-gray-200 p-4 bg-gray-50 w-full"></div>
                            <div className="flex justify-between">
                                <div className="w-full p-4 bg-gray-100"></div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="w-[48%] mt-3 rounded-t-lg min-h-[50px] border-[1px] border-gray-200 animate-pulse delay-5000">
                                <div className="border-[1px] border-gray-200 p-4 bg-gray-100 w-full"></div>
                                <div className="flex justify-between">
                                    <div className="w-full p-4 bg-gray-50 animate-pulse delay-75"></div>
                                </div>
                            </div>
                            <div className="w-[48%] mt-3 rounded-t-lg min-h-[50px] border-[1px] border-gray-200">
                                <div className="border-[1px] border-gray-200 p-4 bg-gray-50 w-full"></div>
                                <div className="flex justify-between">
                                    <div className="w-full p-4 bg-gray-100 animate-pulse delay-200" ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </motion.div>
        </>

    )
}



export function ManageSingleUserLoader() {
    return (
        <>
        <motion.div  exit={{transition: {delay: .5}, opacity: 0}} className="w-full  flex gap-3 flex-col">
            <>
                <div className="w-[70%] mt-3 rounded-t-lg min-h-[50px] border-[1px] border-gray-200 animate-pulse delay-0">
                    <div className="border-[1px] border-gray-200 p-4 bg-gray-50 w-full"></div>
                    <div className="flex justify-between">
                        <div className="w-full p-4 bg-gray-100"></div>
                    </div>
                </div>
            </>
        </motion.div>
        </>

    )
}