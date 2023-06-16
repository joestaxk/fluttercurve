import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Select } from "../auth/register";
import { userDataStateType } from "../../rState/initialStates";
import { useCookies } from "react-cookie";
import auth from "../../lib/auth";
import LiveVideoRecording from "./LiveVideoRecording";
import useAlert from "../../hooks/alert";
import ButtonSpinner from "../utils/buttonSpinner";
import instance from "../../lib/requestService";
import helpers from "../../helpers";


export default function Kyc({state}: {state: userDataStateType}) {
  const [openVideoingModal, setVideoingModal] = useState(false)
  const [cookies] = useCookies();

    const [getMedia, setMedia] = useState(false)
    const [loader, setLoader] = useState(false)
    const [Kyc, setKyc] = useState(null)

    const [data, setData] = React.useState({} as any);
    const [videoData, setVideoData] = React.useState({} as any);
    const [photos, setPhotos] = useState({
        passport: "/avatar-1.png",
        frontID: "",
        backID: ""
    })
    let [stage, setStage] = useState(1)
    const {AlertComponent, showAlert} = useAlert()

    const stages = ["Personal Infos", "Identifications", "Facial Identity"]

    function handleKYCForm(ev:any) {
        ev.preventDefault();
        const tar = ev.target;

        let formData = new FormData();
        if(!data) return;
        
        if(stage === 1) {
            formData.append("passport", tar.passport.files[0]);
            formData.append("fullName", tar.fullname.value);
            formData.append("dob", tar.dob.value);
            formData.append("nationality", tar.country.value);
            formData.append("stage", stage.toString())
        }else if(stage === 2) {
            formData = new FormData()  // create new instance each time 
            formData.append("idType", tar.idType.value)
            formData.append("frontID", tar.frontID.files[0]);
            formData.append("backID", tar.backID.files[0]);
            formData.append("stage", stage.toString())
        }else if(stage === 3) {
            formData = new FormData()
            formData.append("livevideo", videoData);
            formData.append("stage", stage.toString())

        }

         

        setLoader(true)
        auth.uploadKyc(cookies['xat'], formData).then(({data}:any) => {
            setLoader(false)
            console.log(stage)
            if(stage < 4) {
                setStage(++stage)
            }else {
                setStage(1)
            }
            showAlert("success", data.message)
            if(stage > 3) {
                location.reload()
            }
        }).catch((error:any) => {
            setLoader(false)
            console.log(error.response.data.error)
            showAlert("error", error.response.data.error)
        })
    }

    function handleFileChanges(ev:any, key:string) {
        const rawData = ev.target.files[0];
        const url:any = URL.createObjectURL(rawData);
        switch (key) {
            case "passport":
                setPhotos((prev) => {return {...prev, passport: url}})
                break;

            case "backID":
                setPhotos((prev) => {return {...prev, backID: url}})
                break;

            case "frontID":
                setPhotos((prev) => {return {...prev, frontID: url}})
                break;
        
            default:
                break;
        }
    }

    useEffect(() => {
        if(!openVideoingModal) return;
        navigator.mediaDevices
          .getUserMedia({video: true, audio: false})
          .then((stream) => {
            /* use the stream */
            setMedia(true)
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
              }
          })
          .catch(() => {
            /* handle the error */
            setMedia(false)
          });

          return (() => {
          })
      }, [openVideoingModal]);
    
      useEffect(() => {
          if (data && data.size) {
          // Save the data with data.size
          // Replace the logic below with your desired implementation
          setVideoData(data);
        }
      }, [data]);

      useEffect(() => {
        instance.get('/client/getUserKyc', {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}}).then((res) => {
            setKyc(res.data)
        }).catch(err => {
            console.log(err);
        })
      }, [])
      
    return (
        <>
            <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity:1, y: -90}}
                transition={{ delay: .5, stiffness: ""}}
            className="flex justify-around flex-wrap w-full translate-y-[-50%] p-5">
                <div className="bg-white w-[83%] min-w-[350px] shadow rounded-lg h-[120px] p-4 flex items-center justify-between relative">
                    <div className="z-10 flex justify-between w-full">
                        <div title="connect wallet"  className="md:min-w-[150px] md:h-[100px] w-[60px] relative flex-col flex justify-center items-center  bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 36 36"><path fill="#526288" d="M32.33 6a2 2 0 0 0-.41 0h-28a2 2 0 0 0-.53.08l14.45 14.39Z" className="clr-i-solid clr-i-solid-path-1"/><path fill="#526288" d="m33.81 7.39l-14.56 14.5a2 2 0 0 1-2.82 0L2 7.5a2 2 0 0 0-.07.5v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-.12-.61ZM5.3 28H3.91v-1.43l7.27-7.21l1.41 1.41Zm26.61 0h-1.4l-7.29-7.23l1.41-1.41l7.27 7.21Z" className="clr-i-solid clr-i-solid-path-2"/><path fill="none" d="M0 0h36v36H0z"/></svg>
                            <span className="text-[#526288]  text-[.6rem] md:block hidden whitespace-nowrap">EMAIL VERIFICATION</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute top-[10%] right-[60%]" width="20" height="20" viewBox="0 0 2048 2048"><path fill="#4caf50" d="M1024 0q141 0 272 36t244 104t207 160t161 207t103 245t37 272q0 141-36 272t-104 244t-160 207t-207 161t-245 103t-272 37q-141 0-272-36t-244-104t-207-160t-161-207t-103-245t-37-272q0-141 36-272t104-244t160-207t207-161T752 37t272-37zm603 685l-136-136l-659 659l-275-275l-136 136l411 411l795-795z"/></svg>
                        </div>
                        <div className="min-w-[100px] h-[100px] flex-col shadow-2xl shadow-[#4873ebc8] flex justify-center items-center rounded-full bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16"><path fill={Kyc !== "APPROVED" ? "#4874ebed" : "#4caf50"} d="M13.5 0h-12C.675 0 0 .675 0 1.5v13c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-13c0-.825-.675-1.5-1.5-1.5zM13 14H2V2h11v12zM4 9h7v1H4zm0 2h7v1H4zm1-6.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 5 4.5zM7.5 6h-2C4.675 6 4 6.45 4 7v1h5V7c0-.55-.675-1-1.5-1z"/></svg>
                            <span className={`${Kyc !== "APPROVED" ? "text-[#4873ebc3]" : "text-[#1a7707c3] font-bold"}`}>KYC</span>
                        </div>
                        <div title="connect wallet" className="md:min-w-[100px] md:h-[100px] w-[60px]  flex-col flex justify-center text-md items-center bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 20 20"><path fill="#526288" d="M0 4c0-1.1.9-2 2-2h15a1 1 0 0 1 1 1v1H2v1h17a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm16.5 9a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3z"/></svg>
                            <span className="text-[#526288] text-[.6rem] md:block hidden">CONNECT WALLET</span>
                        </div>
                    </div>

                    <div 
                    style={{borderImage: `linear-gradient(20deg,#4874ebed,${Kyc === "APPROVED" ? "#4874ebed, #4874ed": "transparent transparent"}) 1 / 1 / 0 stretch`}}
                    className="absolute left-0 z-0 w-full bg-[#ccc]  border-[1.4px]"
                    >
                    </div>
                </div>
            </motion.div>

            <div className="w-full p-3 pb-6">
            {Kyc ? 
                    <div className="w-full flex justify-center">
                            <div className='md:w-[400px] border-[#ccc] border-[1px] w-full min-h-auto rounded-xl md:p-8 p-4 bg-white'>
                                <div className="flex justify-center">
                                    <div className="flex justify-center flex-col items-center">
                                    {(Kyc === "PENDING" || Kyc === "APPROVED") ? <h1 className='text-[#514AB1] text-3xl font-bold mb-1'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path fill="green" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0c1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263c-12.512-12.496-32.768-12.496-45.28 0z"/></svg>
                                    </h1> : 
                                    <h1>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 32 32"><path fill="red" d="M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2zm0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12z"/><path fill="red" d="M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z"/></svg>
                                    </h1>
                                    }

                                    <h2 className="font-semibold text-[#1f3446d9]">{Kyc === "PENDING" ? "Kyc has been submitted, waiting for approval" : Kyc === "DECLINED" ? "We're sorry, we can verify your request, try again." : "Kyc has been approved successfully."}</h2>
                                    <small>{Kyc}</small>
                                    {Kyc === "DECLINED" && <button className="bg-[#526288] p-2 text-white rounded-lg mt-3" onClick={() => setKyc(null)}>Try again</button>}
                                    </div>
                                </div>
                            </div> 
                    </div>
                    :<div className="md:w-[80%] w-full">
                    {/* <h1 className="text-4xl mb-3 text-[#333]">KYC Verification Process.</h1>
                    <p className="text-[#212123cc]">
                        Please note all information required is only to verify your identity and
                         isn't released to any third party, as soon as your account is verified,
                         the provided data will be dissolved from our data centre
                    </p> */}
                    
                    <form action="" onSubmit={handleKYCForm}>  
                      {
                        stage >= 1 &&
                        <motion.div 
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1, transition: {delay: .2}}}
                        exit={{transition: {delay: .5}, opacity: 0}}
                        className="mt-4">
                            <h1 className="text-3xl text-[#526288] font-semibold">Personal Information.</h1>
                            <p className="text-[#212123cc] mb-5">
                                An official card with your name, date of birth, photograph, or other information on it that proves who you are: A valid driver&apos;s license, state ID card, passport or other photo ID is required as proof of identity.
                            </p>

                            <div className="w-full">
                                <label htmlFor="" className="text-[#526288] text-xl">Upload Passport.</label>
                                <div className="md:w-[400px] w-full rounded-lg mb-3 overflow-hidden mt-2">
                                    <img 
                                    src={photos.passport}
                                    className="rounded-md"
                                    height={100}
                                    width={100}
                                    alt=""
                                    
                                    />
                                    <input type="file"  accept="image/*"  onChange={(ev:any) => handleFileChanges(ev, "passport")}  name="passport" className="mt-2 bg-transparent outline-none w-full"  required/>
                                </div>
                                <label htmlFor="" className="text-[#526288] text-xl">Full name</label>
                                <div className="border-[1px] border-[#ccc] md:w-[400px] w-full mt-2 rounded-lg mb-3 overflow-hidden">
                                    <input name="fullname" title="Your firstname is required" type="text" defaultValue={state.fullName} placeholder="Enter Fullname." className="p-3 bg-transparent outline-none w-full" required/>
                                </div>

                                <label htmlFor="" className="text-[#526288] text-xl">Date of Birth.</label>
                                <div className="border-[1px] border-[#ccc] md:w-[400px] w-full mt-2 rounded-lg mb-3 overflow-hidden">
                                    <input type="date"  title="Date of Birth is required"  name="dob" className="p-3 bg-transparent outline-none w-full" required/>
                                </div>

                                <label htmlFor="" className="text-[#526288] text-xl">Nationality.</label>
                                <div className="border-[1px] border-[#ccc] md:w-[400px] w-full mt-2 rounded-lg mb-3 overflow-hidden">
                                    <Select className="" />
                                </div>
                            </div>
                        </motion.div> }
                        {stage >= 2 &&
                        <motion.div
                        initial = {{opacity: 0}}
                        animate = {{opacity: 1, transition: {delay: .2}}}
                        exit={{transition: {delay: .5}, opacity: 0}}
                        className="mt-1">
                            <h1 className="text-3xl text-[#526288] font-semibold">Upload Identifications.</h1>
                            <p className="text-[#212123cc] mb-5">
                                An official card with your name, date of birth, photograph, or other information on it that proves who you are: A valid driver&apos;s license, state ID card, passport or other photo ID is required as proof of identity.
                            </p>

                            <div className="">
                                <div className="border-[1px] border-[#ccc] md:w-[400px] w-full rounded-lg mb-3">
                                    <select  title="Identification card required" name="idType" className="w-full p-3 bg-transparent" required>
                                        <option value="">Choose Identification card</option>
                                        <option value="National ID">National ID card</option>
                                        <option value="Driver's License">Driver&apos;s License</option>
                                        <option value="International Passport">International Passport</option>
                                    </select>
                                </div>
                                {/* {data && <video src={data as string}></video>} */}
                                <div className="flex md:flex-row flex-col gap-3">
                                    <div className="md:w-[400px] w-full border-[1px] bg-[#212212] border-[#cccc] min-h-[400px] rounded-lg">
                                        <div className="w-full h-[350px]">
                                            <img src={photos.frontID} width={100} height={100} alt="" className="border-none w-full object-cover h-full bg-transparent rounded-lg" />
                                        </div>
                                        
                                        <div className="w-full mt-3 p-1 font-bold">
                                            <div className="text-[#fff] mb-2">Upload Front</div>
                                            <input type="file" onChange={(ev:any) => handleFileChanges(ev, "frontID")} name="frontID" className="rounded w-full outline-none text-[#212121cc]" required/>
                                        </div>
                                    </div> 

                                    {/* BACK */}
                                    <div className="md:w-[400px] w-full border-[1px] bg-[#212212] border-[#cccc] min-h-[400px] rounded-lg">
                                        <div className="w-full h-[350px]">
                                            <img src={photos.backID} width={100} height={100} alt=""  className="border-none w-full object-cover h-full bg-transparent rounded-lg" />
                                        </div>
                                        
                                        <div className="w-full mt-3 p-1 font-bold">
                                            <div className="text-[#fff] mb-2">Upload Back</div>
                                            <input type="file" onChange={(ev:any) => handleFileChanges(ev, "backID")} name="backID" className="rounded w-full outline-none text-[#212121cc]" required/>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </motion.div> }
                       {stage  >= 3 && 
                       <motion.div
                            initial = {{opacity: 0}}
                            animate = {{opacity: 1, transition: {delay: .2}}}
                            exit={{transition: {delay: .5}, opacity: 0}}
                            className="mt-1">
                            <h1 className="text-3xl text-[#526288] font-semibold">Proof of identity.</h1>  
                            <p className="text-[#212123cc] mb-5">
                                Make sure the Identity image is not cropped. Make sure the Identity image is not damaged. Make sure the Identity Card photo is legible (not blurry) Make sure the Identity Card photo matches the physical Identity Card (not edited)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <button type="button" onClick={() => setVideoingModal(!openVideoingModal)} className="w-[200px] bg-[#547bd7] transition-all duration-200 p-3 rounded-lg text-white font-semibold">Verify Identity</button>
                            </div>
                            
                            {openVideoingModal && <LiveVideoRecording setMedia={setMedia} setVideoingModal={setVideoingModal} setData={setData} getMedia={getMedia}/>}
                        </motion.div> }

                        <button type="submit" className="min-w-[200px] mt-5 bg-[#4fe468] disabled:opacity-80 transition-all duration-200 p-3 rounded-lg text-white font-semibold flex gap-1 items-center justify-center" disabled={loader}>
                            {loader ?<span className="flex gap-1 items-center"> <ButtonSpinner  color="#212121cc"/> uploading....</span> : 
                            <span>Upload {stages[stage-1]}</span>}
                        </button>
                    </form>
                </div>}
            </div>
            {AlertComponent}
        </>
    )
}