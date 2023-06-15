import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext } from "../listData";
import adminAuth from "../../../lib/adminAuth";
import helpers from "../../../helpers";
import Buttonloader from "../../utils/btnChartLoader";
import useAlert from "../../../hooks/alert";




export default function CheckKyc() {
    const [kyc, setKyc] = useState<{isKyc: "APPROVED"|"DECLINED"|"PENDING"}>({} as any) as any;
    const [blobVid, setBlobVid] = useState<string | undefined>(undefined);
    const [loadVid, setVidLoader] = useState<boolean>(false);
    const {AlertComponent, showAlert} = useAlert()
    // const [loading, setLoading] = useState({
    //     approved: false,
    //     declined: false
    // })

    const context = useContext(CreateUserIDContext)
    useEffect(() => {
        async function loader(id:string) {
            try {
                const datas = await adminAuth.getKycDetails(id);
                setKyc(datas.data)
            } catch (error) {
                console.log(error)
            }
        }
        loader(context.ID)
        // console.log(context.ID)
    }, [context.ID])


    async function showVideo() {
        setVidLoader(true);
        try {
            const response = await helpers.reqAllKycData(kyc.clientID, kyc.livevideo);
            setBlobVid(response)
            setVidLoader(false)
        } catch (error) {
            setVidLoader(false)
            console.log(error);
        }
    }

    async function authorizeKyc(type: "APPROVED"|"DECLINED") {
        
        try {
            const data_ = await adminAuth.authorizeKyc(kyc.clientID, type)
            showAlert("success", data_.data)
        } catch (error:any) {
            // showAlert("error", error.response.data)
            console.log(error)
        }
    }
    return (
        <div className="">
            {

                <>
                    <div className="mt-5">
                        <h2 className="text-xl font-medium text-[#212121cc]">Kyc Data</h2>
                    </div>
                    {!kyc.id ? <div className="text-gray-600">Kyc is unavailable</div> : <div className="border-[1px] border-gray-200 rounded-xl mt-2">
                        <div className="bg-gray-100 p-3 font-medium flex items-center justify-between">
                            <span>User's Kyc <span className={`${kyc.isKyc === "APPROVED" ? "text-emerald-600" : kyc.isKyc === "DECLINED" ? "text-red-600" : "text-slate-600"}`}>({kyc.isKyc})</span></span>
                            <div className="flex gap-2 items-center">
                                <button className="p-2 rounded-xl text-white disabled:opacity-40 bg-green-600" onClick={authorizeKyc.bind(null, "APPROVED")} disabled={kyc.isKyc === "APPROVED"}>Accept</button>
                                <button className="p-2 rounded-xl text-white disabled:opacity-40 bg-red-600" onClick={authorizeKyc.bind(null, "DECLINED")} disabled={kyc.isKyc === "DECLINED"}>Decline</button>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 p-4 border-b-[1px] border-gray-200 mb-2">
                            <div className="flex item-center gap-3">
                                <div className="">
                                    <KycHOC id={kyc.clientID} filename={kyc.backID} className="border-[1px] border-gray-200 rounded-full w-[50px] h-[50px] object-cover" />
                                </div>
                                <div className="h-full">
                                    <h3>{kyc.fullName}</h3>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-5">
                            <div className="border-[1px] border-gray-200 flex ">
                                <div className="bg-gray-100 h-[60px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#212121cc" d="M24.005 15.5a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm-3.5 6a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0ZM37 32L26.912 42.71a4 4 0 0 1-5.824 0L11 32h.038l-.017-.02l-.021-.025A16.922 16.922 0 0 1 7 21c0-9.389 7.611-17 17-17s17 7.611 17 17a16.922 16.922 0 0 1-4 10.955l-.021.025l-.017.02H37Zm-1.943-1.619A14.433 14.433 0 0 0 38.5 21c0-8.008-6.492-14.5-14.5-14.5S9.5 12.992 9.5 21a14.43 14.43 0 0 0 3.443 9.381l.308.363l9.657 10.251a1.5 1.5 0 0 0 2.184 0l9.657-10.251l.308-.363Z"/></svg>
                                </div>
                                <div className="h-[60px] min-w-[80px] ml-2 p-1">
                                    <h4 className="font-medium">Nationality</h4>
                                    <p>{kyc.nationality}</p>
                                </div>
                            </div>

                            <div className="border-[1px] border-gray-200 flex min-w-auto">
                                <div className="bg-gray-100 h-[60px] flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 20 20"><path fill="#212121cc" d="M5.673 0a.7.7 0 0 1 .7.7v1.309h7.517v-1.3a.7.7 0 0 1 1.4 0v1.3H18a2 2 0 0 1 2 1.999v13.993A2 2 0 0 1 18 20H2a2 2 0 0 1-2-1.999V4.008a2 2 0 0 1 2-1.999h2.973V.699a.7.7 0 0 1 .7-.699ZM1.4 7.742v10.259a.6.6 0 0 0 .6.6h16a.6.6 0 0 0 .6-.6V7.756L1.4 7.742Zm5.267 6.877v1.666H5v-1.666h1.667Zm4.166 0v1.666H9.167v-1.666h1.666Zm4.167 0v1.666h-1.667v-1.666H15Zm-8.333-3.977v1.666H5v-1.666h1.667Zm4.166 0v1.666H9.167v-1.666h1.666Zm4.167 0v1.666h-1.667v-1.666H15ZM4.973 3.408H2a.6.6 0 0 0-.6.6v2.335l17.2.014V4.008a.6.6 0 0 0-.6-.6h-2.71v.929a.7.7 0 0 1-1.4 0v-.929H6.373v.92a.7.7 0 0 1-1.4 0v-.92Z"/></svg>
                                </div>
                                <div className="h-[60px] min-w-[80px] ml-2 p-1">
                                    <h4 className="font-medium">D.O.B</h4>
                                    <p>{(new Date(kyc.dob).toLocaleDateString())}</p>
                                </div>
                            </div>
                            <div className="border-[1px] border-gray-200 flex min-w-auto">
                                <div className="bg-gray-100 h-[60px] flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"><path fill="#212121cc" d="M20 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16Zm-4 14H8v2h8v-2ZM12 6a4 4 0 1 0 0 8a4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4Z"/></svg>
                                </div>
                                <div className="h-[60px] min-w-[80px] ml-2 p-1">
                                    <h4 className="font-medium">Card Type</h4>
                                    <p>{kyc.idType}</p>
                                </div>
                            </div>
                        </div>
                        </div>

                        {/* Video & Image area */}
                        <>
                           {
                              (kyc.isKyc !== "APPROVED" && kyc.isKyc !== "DECLINED") ?
                              <>
                                <h2 className="text-xl font-medium text-[#212121cc] pl-4">Uploads....</h2>
                                <div className="p-3 flex flex-wrap w-full gap-3">
                                        <div className="relative group border-[1px] border-gray-200 rounded-xl w-[400px] min-h-[500px] overflow-hidden">
                                            <KycHOC id={kyc.clientID} filename={kyc.frontID} className="w-full h-full object-cover" />
                                            <button className="absolute transition-all duration-300 bottom-0 w-full p-2 rounded-b-xl text-white bg-gray-500 opacity-0 group-hover:opacity-100">Front Upload</button>
                                        </div>
                                    <div className="relative group border-[1px] border-gray-200 rounded-xl w-[400px] min-h-[500px] overflow-hidden">
                                        <KycHOC id={kyc.clientID} filename={kyc.backID} className="w-full h-full object-cover" />
                                        <button className="absolute transition-all duration-300 bottom-0 w-full p-2 rounded-b-xl text-white bg-gray-500 opacity-0 group-hover:opacity-100">Back Upload</button>
                                    </div>
                                    <div className={`flex justify-center items-center ${!blobVid && "animate-pulse"} bg-gray-200 border-[1px] border-gray-200 rounded-xl w-[400px] min-h-[500px] overflow-hidden`}>
                                        {blobVid && <video src={blobVid} className="w-full h-full object-cover"></video>}
                                        {
                                            loadVid ?
                                            <Buttonloader /> :
                                            !blobVid && <button className="p-2 rounded-xl text-white bg-gray-600" onClick={showVideo}>View video</button>
                                        }
                                    </div>
                                </div>
                              </> : <></>
                           }
                        </>
                    </div>}
                </>
            }

            {AlertComponent}
        </div>
    )
}




function KycHOC({id, filename, className}: any){
    const [blobImg, setBlobImg] = useState<string | undefined>(undefined);
    useEffect(() => {
      const fetchBlobImg = async () => {
        try {
          const image = await helpers.reqAllKycData(id, filename);
          setBlobImg(image);
        console.log(image)
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchBlobImg();

    }, [filename]);

    return (
        <img src={blobImg||"/avatar-1.png"} className= {className} alt={filename} loading="lazy"/>
    )
}