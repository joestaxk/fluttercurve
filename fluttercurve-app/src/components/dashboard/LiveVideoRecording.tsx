import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Buttonloader from "../utils/btnChartLoader";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import useAlert from "../../hooks/alert";

function LiveVideoRecording({
  getMedia,
  setMedia,
  setVideoingModal,
  setData,
}: any) {
  const webcamRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [timecount, setTimecount] = useState(5);
  const [displayMsg, setDisplayMsg] = useState("");
  const { AlertComponent, showAlert } = useAlert()
  

  const stopBTN = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Load the face detection model
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/weights"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/weights"),
        faceapi.nets.faceExpressionNet.loadFromUri("/weights"),
      ]);

      startCapture();
    };

    // Function to start capturing video
    const startCapture = () => {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
          setCapturing(true);
        }
      });
    };

    loadModels();

    // Clean up function to stop capturing and release resources
    return () => {
      setCapturing(false);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (webcamRef.current?.srcObject) {
        const tracks = webcamRef.current.srcObject.getTracks();
        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }
    };
  }, []);



  const handleStartCaptureClick = () => {
    setCapturing(true);
  };

  useEffect(() => {
    if (!capturing) return;

    // Stage the data for 1ms
    setTimeout(() => {
      if (webcamRef.current && webcamRef.current.stream) {
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: "video/webm",
        });

        mediaRecorderRef.current.addEventListener(
          "dataavailable",
          handleDataAvailable
        );
        mediaRecorderRef.current.start();
      }
    }, 1000);
  }, [capturing]);

const handleDataAvailable = React.useCallback(
  ({ data }: { data: BlobPart }) => {
    const blob = new Blob([data]);
    if (blob.size > 0) {
      setRecordedChunks((prev) => prev.concat(blob));
    }
  },
  [setRecordedChunks]
);
    const handleStopCaptureClick = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    
        setCapturing(false);
        setMedia(false);
    
        if (recordedChunks.length) {
            setRecordedChunks([]);
        }
    
        // Stop all webcam streams
        // if (webcamRef.current?.srcObject) {
        // const tracks = webcamRef.current.srcObject.getTracks();
        // tracks.forEach((track: any) => track.stop());
        // }
    
        setTimeout(() => {
        setVideoingModal(false);
        }, 1000);
    };
    
 useEffect(() => {
    if (capturing) {
      const countdownInterval = setInterval(() => {
        setTimecount((prevTimecount) => prevTimecount - 1);
      }, 1000);
  
      return () => {
        clearInterval(countdownInterval);
      };
    }
  }, [capturing]);
  
  useEffect(() => {
    if(!capturing) return;
    if (timecount > 2) {
      setDisplayMsg("Nod Your Head!");
    } else if (timecount <= 2 && timecount > 0) {
      setDisplayMsg("Shake Your Head");
    } else {
      setDisplayMsg("Completed.");
      handleStopCaptureClick();
    }
  }, [timecount, handleStopCaptureClick])

  useEffect(() => {
    const blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    setData(blob);
  }, [recordedChunks, setData]);

  const detectFace = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.videoWidth > 0 &&
      webcamRef.current.videoHeight > 0
    ) {
      const videoEl = webcamRef.current;
      const displaySize = { width: videoEl.width, height: videoEl.height };
      const canvas = faceapi.createCanvasFromMedia(videoEl);
      const context = canvas.getContext("2d");
      faceapi.matchDimensions(canvas, displaySize);
      const detections = await faceapi
        .detectAllFaces(videoEl)
        .withFaceLandmarks()
        .withFaceExpressions();
  
      if (detections.length === 0) {
        // No face detected, cancel upload or take appropriate action
        showAlert("error", "We can't detect a face on the video capturing.")
        handleStopCaptureClick();
        return;
      }
  
      faceapi.draw.drawDetections(canvas, detections);
      faceapi.draw.drawFaceLandmarks(canvas, detections);
      faceapi.draw.drawFaceExpressions(canvas, detections);
      context!.clearRect(0, 0, canvas.width, canvas.height);
    }
  
    requestAnimationFrame(detectFace);
  };
  useEffect(() => {
    if (capturing) {
      detectFace();
    }
  }, [capturing]);

  return (
    <motion.div
      initial={{ display: "none", opacity: 0 }}
      animate={{
        transition: {
          delay: 0.5,
          duration: 0.5,
        },
        display: "block",
        opacity: 1,
      }}
      className="fixed top-0 left-0 w-full min-h-[100vh] bg-[#313131ba] backdrop:blur-md bg-blend-darken"
    >
      <div className="w-full h-[100vh] flex justify-center items-center">
        <div className="w-[450px] z-40 border-[1px] flex flex-col items-center min-h-[200px] pb-2 bg-[#e9e9e9] rounded-md overflow-hidden">
          <div className="w-full relative h-[85%] bg-[#212212] text-white">
            {!capturing ? (
              <div className="bg-[#212212] h-[400px] w-full flex flex-col justify-center items-center">
                <div className="h-[30px]">
                  <Buttonloader />
                </div>
                <p className="mt-4">Allow Camera on device.</p>
              </div>
            ) : (
              <Webcam audio={false} ref={webcamRef} />
            )}
          </div>
          <div className="w-full">
            <p className="text-center font-bold py-2">
              {displayMsg || "Follow the instructions."}
            </p>
            <div className="w-full flex justify-around">
              {getMedia && (
                <button
                  type="button"
                  onClick={handleStartCaptureClick}
                  className={`mt-2 ${
                    capturing ? "bg-[#4dc851] text-[#fff]" : "bg-[#ccc]"
                  } p-3 rounded-lg text-[#212112] font-semibold`}
                >
                  {capturing ? "Capturing..." : "Start Capturing"}
                </button>
              )}
              <button
                type="button"
                ref={stopBTN}
                onClick={handleStopCaptureClick}
                className="mt-2 bg-[#ef3333] p-3 rounded-lg text-[#fefefe] font-semibold"
              >
                Cancel Capturing
              </button>
            </div>
          </div>
        </div>
      </div>
      {AlertComponent}
    </motion.div>
  );
}



// import { motion } from "framer-motion";
// import React, { useEffect } from "react";
// import Buttonloader from "../utils/btnChartLoader";
// // import { Select } from "../auth/register";
// // import { userDataStateType } from "@/rState/initialStates";
// import Webcam from "react-webcam";



// function LiveVideoRecording({getMedia,setMedia, setVideoingModal, setData}: any) {
//   const webcamRef:any = React.useRef(null);
//   const mediaRecorderRef:any = React.useRef(null);
//   const stopBTN:any = React.useRef(null);
//   const [capturing, setCapturing] = React.useState(false);
//   const [recordedChunks, setRecordedChunks] = React.useState([]);
//   let [timecount, setTimecount] = React.useState(5)
//   let [displayMsg, setDisplayMsg] = React.useState("")

//   const handleStartCaptureClick = React.useCallback(() => {
//       setCapturing(true);
//   }, []);

// useEffect(() => {
//   if(!capturing) return;
//   // stage the data for 1ms
//   setTimeout(() => {
//       mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
//           mimeType: "video/webm"
//       });
  
//       mediaRecorderRef.current.addEventListener(
//           "dataavailable",
//           handleDataAvailable
//       );    
//       mediaRecorderRef.current.start()
//   }, 1000)
// }, [capturing])

// const handleDataAvailable = React.useCallback(
//   ({ data }: {data: any}) => {
//     if (data.size > 0) {
//       setRecordedChunks((prev) => prev.concat(data));
//     }
//   },
//   [setRecordedChunks]
// );

// const handleStopCaptureClick = React.useCallback(() => {
//     mediaRecorderRef.current.stop();
//     setCapturing(false);
//     setMedia(false)

//     if (recordedChunks.length) {
//       setRecordedChunks([]);
//    }
//    setTimeout(() => {
//       setVideoingModal(false)
//    }, 1000)
// }, [mediaRecorderRef, webcamRef, setCapturing]);

// //   const handleDownload = React.useCallback(() => {
// //     console.log(recordedChunks)
// //     if (recordedChunks.length) {
// //         const blob = new Blob(recordedChunks, {
// //             type: "video/webm"
// //         });
// //         console.log(blob, recordedChunks)
// //         setRecordedChunks(blob as any)
// //     //   const url = URL.createObjectURL(blob);
// //         setRecordedChunks([]);
// //     }
// //   }, [recordedChunks]);

// const handleCountDown = React.useCallback(() => {
//   if(timecount > 2) {
//       // display message
//       setDisplayMsg("Nod Your Head!")
//   }else if(timecount <= 2 && timecount > 0) {
//       setDisplayMsg("Shake Your Head")
//   }else {
//       setDisplayMsg("Completed.")
//       handleStopCaptureClick()
//       // handleDownload()
//       // stopBTN.current.click()
//       // // downloadBTN.current.click()
//   }
// }, [capturing])

// useEffect(() => {
//   const blob = new Blob(recordedChunks, {
//       type: "video/webm"
//   });
//   // const url = URL.createObjectURL(blob);
//   setData(blob)
// }, [recordedChunks])

// useEffect(() => {
//   let intId:any;
//   if(capturing) {
//   intId = 
//       setInterval(() => {
//           handleCountDown()
//           setTimecount(--timecount)
//       }, (1000 * 3)) as any;

//   }
//   return () => clearInterval(intId)
// }, [capturing])

//   return (
//       <motion.div 
//           initial={{display: "none", opacity: 0}}
//           animate={{
//           transition: {
//           delay: .5,
//           duration: .5,
//           },
//           display: "block",
//           opacity: 1
//       }}
//       className="fixed top-0 left-0 w-full min-h-[100vh] bg-[#313131ba] backdrop:blur-md bg-blend-darken">
//           <div className="w-full h-[100vh] flex justify-center items-center">
//               <div className="w-[450px] z-40 border-[1px] flex flex-col items-center  min-h-[200px] pb-2 bg-[#e9e9e9] rounded-md overflow-hidden">
//                   <div className="w-full relative h-[85%] bg-[#212212]  text-white ">
//                       {
//                           !capturing ? 
//                              <div className="bg-[#212212] h-[400px] w-full flex flex-col justify-center items-center">
//                                   <div className="h-[30px]">
//                                       <Buttonloader />
//                                   </div>
//                                    <p className="mt-4">Allow Camera on device.</p>
//                               </div> :
//                           <Webcam audio={false} ref={webcamRef} />
//                       }
//                   </div>
//                   <div className="w-full">
//                       <p className="text-center font-bold py-2">{displayMsg || "Follow the instructions."}</p>
//                       <div className="w-full flex justify-around">
//                           {getMedia && <button type="button" onClick={handleStartCaptureClick} className={`mt-2 ${capturing ? "bg-[#4dc851] text-[#fff]" : "bg-[#ccc]"} p-3 rounded-lg text-[#212112] font-semibold`}>{capturing  ? "Capturing..." : "Start Capturing"}</button>}
//                           <button type="button" ref={stopBTN} onClick={() => setVideoingModal(false)} className="mt-2 bg-[#ef3333] p-3 rounded-lg text-[#fefefe] font-semibold ">Cancel Capturing</button>
//                       </div>
//                   </div>
//               </div>
//           </div>
//       </motion.div>
//   )
// }


export default LiveVideoRecording;
