import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Buttonloader from "../utils/btnChartLoader";
import { Select } from "../auth/register";
import { userDataStateType } from "@/rState/initialStates";
import Webcam from "react-webcam";


export default function Kyc({state}: {state: userDataStateType}) {
    const [openVideoingModal, setVideoingModal] = useState(false)
    const [getMedia, setMedia] = useState(false)
    const [data, setData] = React.useState({} as any);
    const [photos, setPhotos] = useState({
        passport: "/avatar-1.png",
        frontID: "",
        backID: ""
    })

    function handleKYCForm(ev:any) {
        ev.preventDefault();
        const tar = ev.target;

        let formData = new FormData();
        if(!data) return;

        formData.append("fullname", tar.fullname.value);
        formData.append("dob", tar.dob.value);
        formData.append("nationality", tar.country.value);
        formData.append("idType", tar.idType.value)
        formData.append("passport", tar.passport.files[0]);
        formData.append("frontID", tar.frontID.files[0]);
        formData.append("backID", tar.backID.files[0]);
        formData.append("identityProof", data);
        

        formData.forEach(el => {
            console.log(el) 
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
        console.log(url);
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
          .catch((err) => {
            /* handle the error */
            setMedia(false)
          });
      }, [openVideoingModal]);
    
      useEffect(() => {
        console.log(data)
      }, [data])
      
    return (
        <>
            <motion.div
                initial={{ opacity: 0}}
                animate={{ opacity:1, y: -90}}
                transition={{ delay: .5, stiffness: ""}}
            className="flex justify-around flex-wrap w-full translate-y-[-50%] p-5">
                <div className="bg-white w-[83%] shadow rounded-lg h-[120px] p-4 flex items-center justify-between relative">
                    <div className="z-10 flex justify-between w-full">
                        <div className="min-w-[100px] relative h-[100px] flex-col flex justify-center items-center rounded-full bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 36 36"><path fill="#526288" d="M32.33 6a2 2 0 0 0-.41 0h-28a2 2 0 0 0-.53.08l14.45 14.39Z" className="clr-i-solid clr-i-solid-path-1"/><path fill="#526288" d="m33.81 7.39l-14.56 14.5a2 2 0 0 1-2.82 0L2 7.5a2 2 0 0 0-.07.5v20a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V8a2 2 0 0 0-.12-.61ZM5.3 28H3.91v-1.43l7.27-7.21l1.41 1.41Zm26.61 0h-1.4l-7.29-7.23l1.41-1.41l7.27 7.21Z" className="clr-i-solid clr-i-solid-path-2"/><path fill="none" d="M0 0h36v36H0z"/></svg>
                            <span className="text-[#526288]">EMAIL VERIFICATION</span>
                        </div>
                        <div className="min-w-[100px] h-[100px] flex-col shadow-2xl shadow-[#4873ebc8] flex justify-center items-center rounded-full bg-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16"><path fill="#4874ebed" d="M13.5 0h-12C.675 0 0 .675 0 1.5v13c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-13c0-.825-.675-1.5-1.5-1.5zM13 14H2V2h11v12zM4 9h7v1H4zm0 2h7v1H4zm1-6.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 5 4.5zM7.5 6h-2C4.675 6 4 6.45 4 7v1h5V7c0-.55-.675-1-1.5-1z"/></svg>
                        <span className="text-[#4873ebc3]">KYC</span>
                        </div>
                        <div className="min-w-[100px] h-[100px] flex-col flex justify-center text-md items-center rounded-full bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 20 20"><path fill="#526288" d="M0 4c0-1.1.9-2 2-2h15a1 1 0 0 1 1 1v1H2v1h17a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm16.5 9a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3z"/></svg>
                            <span className="text-[#526288]">CONNECT WALLET</span>
                        </div>
                    </div>

                    <div 
                    style={{borderImage: "linear-gradient(20deg,#4874ebed,transparent,transparent) 1 / 1 / 0 stretch"}}
                    className="absolute left-0 z-0 w-full bg-[#ccc]  border-[1.4px]"
                    >
                    </div>
                </div>
            </motion.div>

            <div className="w-full pl-5 pb-6">
                <div className="w-[80%]">
                    {/* <h1 className="text-4xl mb-3 text-[#333]">KYC Verification Process.</h1>
                    <p className="text-[#212123cc]">
                        Please note all information required is only to verify your identity and
                         isn't released to any third party, as soon as your account is verified,
                         the provided data will be dissolved from our data centre
                    </p> */}

                    <form action=""  onSubmit={handleKYCForm}>  
                        <div className="mt-4">
                            <h1 className="text-3xl text-[#526288] font-semibold">Personal Information.</h1>
                            <p className="text-[#212123cc] mb-5">
                                An official card with your name, date of birth, photograph, or other information on it that proves who you are: A valid driver&apos;s license, state ID card, passport or other photo ID is required as proof of identity.
                            </p>

                            <div className="">
                                <label htmlFor="" className="text-[#526288] text-xl">Upload Passport.</label>
                                <div className="w-[400px] rounded-lg mb-3 overflow-hidden mt-2">
                                    <Image 
                                    src={photos.passport}
                                    className="rounded-md"
                                    height={100}
                                    width={100}
                                    alt=""
                                    
                                    />
                                    <input type="file"  accept="image/*"  onChange={(ev:any) => handleFileChanges(ev, "passport")}  name="passport" className="mt-2 bg-transparent outline-none w-full"  required/>
                                </div>
                                <label htmlFor="" className="text-[#526288] text-xl">Full name</label>
                                <div className="border-[1px] border-[#ccc] w-[400px] mt-2 rounded-lg mb-3 overflow-hidden">
                                    <input name="fullname" title="Your firstname is required" type="text" defaultValue={state.fullName} placeholder="Enter Fullname." className="p-3 bg-transparent outline-none w-full" required/>
                                </div>

                                <label htmlFor="" className="text-[#526288] text-xl">Date of Birth.</label>
                                <div className="border-[1px] border-[#ccc] w-[400px] mt-2 rounded-lg mb-3 overflow-hidden">
                                    <input type="date"  title="Date of Birth is required"  name="dob" className="p-3 bg-transparent outline-none w-full" required/>
                                </div>

                                <label htmlFor="" className="text-[#526288] text-xl">Nationality.</label>
                                <div className="border-[1px] border-[#ccc] w-[400px] mt-2 rounded-lg mb-3 overflow-hidden">
                                    <Select className="" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h1 className="text-3xl text-[#526288] font-semibold">Upload Identifications.</h1>
                            <p className="text-[#212123cc] mb-5">
                                An official card with your name, date of birth, photograph, or other information on it that proves who you are: A valid driver&apos;s license, state ID card, passport or other photo ID is required as proof of identity.
                            </p>

                            <div className="">
                                <div className="border-[1px] border-[#ccc] w-[400px] rounded-lg mb-3">
                                    <select  title="Identification card required" name="idType" className="w-full p-3 bg-transparent" required>
                                        <option value="">Choose Identification card</option>
                                        <option value="National ID">National ID card</option>
                                        <option value="Driver's License">Driver&apos;s License</option>
                                        <option value="International Passport">International Passport</option>
                                    </select>
                                </div>
                                {/* {data && <video src={data as string}></video>} */}
                                <div className="flex gap-3">
                                    <div className="w-[400px] border-[1px] bg-[#212212] border-[#cccc] min-h-[400px] rounded-lg">
                                        <div className="w-full h-[350px]">
                                            <Image src={photos.frontID} width={100} height={100} alt="" className="border-none w-full object-cover h-full bg-transparent rounded-lg" />
                                        </div>
                                        
                                        <div className="w-full mt-3 p-1 font-bold">
                                            <div className="text-[#fff] mb-2">Upload Front</div>
                                            <input type="file" onChange={(ev:any) => handleFileChanges(ev, "frontID")} name="frontID" className="rounded w-full outline-none text-[#212121cc]" required/>
                                        </div>
                                    </div> 

                                    {/* BACK */}
                                    <div className="w-[400px] border-[1px] bg-[#212212] border-[#cccc] min-h-[400px] rounded-lg">
                                        <div className="w-full h-[350px]">
                                            <Image src={photos.backID} width={100} height={100} alt=""  className="border-none w-full object-cover h-full bg-transparent rounded-lg" />
                                        </div>
                                        
                                        <div className="w-full mt-3 p-1 font-bold">
                                            <div className="text-[#fff] mb-2">Upload Back</div>
                                            <input type="file" onChange={(ev:any) => handleFileChanges(ev, "backID")} name="backID" className="rounded w-full outline-none text-[#212121cc]" required/>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h1 className="text-3xl text-[#526288] font-semibold">Proof of identity.</h1>  
                            <p className="text-[#212123cc] mb-5">
                                Make sure the Identity image is not cropped. Make sure the Identity image is not damaged. Make sure the Identity Card photo is legible (not blurry) Make sure the Identity Card photo matches the physical Identity Card (not edited)
                            </p>

                            <button type="button" onClick={() => setVideoingModal(!openVideoingModal)} className="w-[200px] bg-[#547bd7] transition-all duration-200 p-3 rounded-lg text-white font-semibold">Verify Identity</button>
                            <button type="submit" className="w-[200px] ml-3 bg-[#4fe468] transition-all duration-200 p-3 rounded-lg text-white font-semibold">Upload Data</button>
                            {openVideoingModal && <LiveVideoRecording setMedia={setMedia} setVideoingModal={setVideoingModal} setData={setData} getMedia={getMedia}/>}
                        </div>
                        </form>
                </div>
            </div>
        </>
    )
}



function LiveVideoRecording({getMedia,setMedia, setVideoingModal, setData}: any) {
    const webcamRef:any = React.useRef(null);
    const mediaRecorderRef:any = React.useRef(null);
    const stopBTN:any = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    let [timecount, setTimecount] = React.useState(5)
    let [displayMsg, setDisplayMsg] = React.useState("")

    const handleStartCaptureClick = React.useCallback(() => {
        setCapturing(true);
    }, []);

  useEffect(() => {
    if(!capturing) return;
    // stage the data for 1ms
    setTimeout(() => {
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
        });
    
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );    
        mediaRecorderRef.current.start()
    }, 1000)
  }, [capturing])

  const handleDataAvailable = React.useCallback(
    ({ data }: {data: any}) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      setMedia(false)

      if (recordedChunks.length) {
        setRecordedChunks([]);
     }
     setTimeout(() => {
        setVideoingModal(false)
     }, 1000)
  }, [mediaRecorderRef, webcamRef, setCapturing]);

//   const handleDownload = React.useCallback(() => {
//     console.log(recordedChunks)
//     if (recordedChunks.length) {
//         const blob = new Blob(recordedChunks, {
//             type: "video/webm"
//         });
//         console.log(blob, recordedChunks)
//         setRecordedChunks(blob as any)
//     //   const url = URL.createObjectURL(blob);
//         setRecordedChunks([]);
//     }
//   }, [recordedChunks]);

  const handleCountDown = React.useCallback(() => {
    if(timecount > 2) {
        // display message
        setDisplayMsg("Nod Your Head!")
    }else if(timecount <= 2 && timecount > 0) {
        setDisplayMsg("Shake Your Head")
    }else {
        setDisplayMsg("Completed.")
        handleStopCaptureClick()
        // handleDownload()
        // stopBTN.current.click()
        // // downloadBTN.current.click()
    }
  }, [capturing])

  useEffect(() => {
    const blob = new Blob(recordedChunks, {
        type: "video/webm"
    });
    // const url = URL.createObjectURL(blob);
    setData(blob)
  }, [recordedChunks])

  useEffect(() => {
    let intId:any;
    if(capturing) {
    intId = 
        setInterval(() => {
            handleCountDown()
            setTimecount(--timecount)
        }, (1000 * 2)) as any;

    }
    return () => clearInterval(intId)
  }, [capturing])

    return (
        <motion.div 
            initial={{display: "none", opacity: 0}}
            animate={{
            transition: {
            delay: .5,
            duration: .5,
            },
            display: "block",
            opacity: 1
        }}
        className="fixed top-0 left-0 w-full min-h-[100vh] bg-[#313131ba] backdrop:blur-md bg-blend-darken">
            <div className="w-full h-[100vh] flex justify-center items-center">
                <div className="w-[450px] z-40 border-[1px] flex flex-col items-center  min-h-[200px] pb-2 bg-[#e9e9e9] rounded-md overflow-hidden">
                    <div className="w-full relative h-[85%] bg-[#212212]  text-white ">
                        {
                            !capturing ? 
                               <div className="bg-[#212212] h-[400px] w-full flex flex-col justify-center items-center">
                                    <div className="h-[30px]">
                                        <Buttonloader />
                                    </div>
                                     <p className="mt-4">Allow Camera on device.</p>
                                </div> :
                            <Webcam audio={false} ref={webcamRef} />
                        }
                    </div>
                    <div className="w-full">
                        <p className="text-center font-bold py-2">{displayMsg || "Follow the instructions."}</p>
                        <div className="w-full flex justify-around">
                            {getMedia && <button type="button" onClick={handleStartCaptureClick} className={`mt-2 ${capturing ? "bg-[#4dc851] text-[#fff]" : "bg-[#ccc]"} p-3 rounded-lg text-[#212112] font-semibold`}>{capturing  ? "Capturing..." : "Start Capturing"}</button>}
                            <button type="button" ref={stopBTN} onClick={() => setVideoingModal(false)} className="mt-2 bg-[#ef3333] p-3 rounded-lg text-[#fefefe] font-semibold ">Cancel Capturing</button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}