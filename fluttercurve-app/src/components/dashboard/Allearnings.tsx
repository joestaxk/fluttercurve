import helpers from "../../helpers";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import auth from "../../lib/auth";
import { userDataStateType } from "../../rState/initialStates";


export default function AllEarning({state}: {state: userDataStateType}){
    const [cookies] = useCookies();
    const [data,setData] = useState([]);
  
    useEffect(() => {
      async function fetchData() {
          try {
              let {data}: any = await auth.getAllSuccessfulInvesment(cookies['xat']);
              if(data.length) {
                  setData(data as any)
              }
          } catch (error) {
              console.log(error)
          }
      }
      fetchData()
    }, [])

    return (
        <div className="pb-6 p-3">
            <h1 className="text-3xl mb-8 border-b-[#bdbdbdc0] border-b-[1px] text-[#333]">All Earnings</h1>

            <div className="flex flex-wrap gap-3">
            {
                data.length ?
                data.map((data:any, i:number) => (
                    <div 
                        key={i.toString()}
                        style={{borderImage: `linear-gradient(${data.investmentCompleted ? "100deg, #transparent,#3ddc75,transparent" : "20deg, #2626b0df,#2626b0a0,transparent"}) 1 / 1 / 0 stretch`}}
                        className="w-[380px] p-3 border-[1px] rounded-lg bg-[#e8e8e830] border-[#ccc] min-h-[350px]">
                        {data.investmentCompleted ? <div className="">
                            <div className="text-md mb2 text-[#212121cc] flex gap-1 items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"><mask id="ipSFiveStarBadge0"><path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"  strokeWidth="4" d="M23.103 20.817a1 1 0 0 1 1.794 0l2.985 6.048a1 1 0 0 0 .753.548l6.675.97a1 1 0 0 1 .554 1.705l-4.83 4.708a1 1 0 0 0-.288.885l1.14 6.648a1 1 0 0 1-1.45 1.054l-5.97-3.138a1 1 0 0 0-.931 0l-5.97 3.138a1 1 0 0 1-1.452-1.054l1.14-6.648a1 1 0 0 0-.287-.885l-4.83-4.708a1 1 0 0 1 .554-1.706l6.675-.97a1 1 0 0 0 .753-.547l2.985-6.048ZM36 4H12v10l12 5l12-5V4Z"/></mask><path fill="gold" d="M0 0h48v48H0z" mask="url(#ipSFiveStarBadge0)"/></svg>
                                <span>Investment Completed.</span>
                            </div>
                            <div className="text-4xl text-[#3ddc75] font-bold">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency, data.progressAmt), state.currency)}</div>
                        </div> : 
                        <div className="">
                            <div className="text-md mb-1 text-[#212121cc]">Earning So far.</div>
                            <div className="text-4xl text-[#3333bddf] font-bold">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency,  data.progressAmt), state.currency)}</div>
                        </div>
                        }
    
                        <h2 className="text-3xl mt-4 font-semi-bold text-[#2b2b2b] mb-3">{data.plan} Plan</h2>
    
    
                        <div className="flex justify-between mb-3">
                            <div className="">Duration: </div>
                            <div className="">{data.duration} days</div>
                        </div>
    
                        <div className="flex justify-between mb-3">
                            <div className="">Invested Amount: </div>
                            <div className="">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency, data.investedAmt), state.currency)}</div>
                        </div>
    
                        <div className="flex justify-between">
                            <div className="">Remaining days: </div>
                            <div className="">{!data.remainingDays ? "Just started" : data.remainingDays + " days"}</div>
                        </div>
    
                        <div className={`w-full ${data.investmentCompleted  ? "border-[#3ddc75] border-[1px]" : "border-[#553ddcb1] border-[1px]"} mt-5 rounded-md`}>
                            <div 
                            style={{background: `${data.investmentCompleted  ? "linear-gradient(20deg,#3ddc75,#3ddc75)" : "linear-gradient(40deg,#3d3ddc80,#25258d)"}`, width: `${(parseInt(data.remainingDays) / parseInt(data.duration)) * 100 }%` }}
                            className="h-4  transition-all duration-300"></div>
                        </div>
    
                        {!data.investmentCompleted ? 
                            <div className="w-full flex justify-center mt-8 text-[#eee] font-bold">
                                <button className="px-3 py-2 rounded-xl w-full bg-[#25258daa]">In Progress</button>
                            </div>:
                            <div className="w-full flex justify-center mt-8 text-[#eee] font-bold">
                                <button className="px-3 py-2 rounded-xl w-full bg-[#3ddc75]">Completed</button>
                            </div> 
                        }
                    </div>
                )) :  (<div className="mt-5 w-full">
                <div className="text-center w-full text-4xl text-[#21212174] font-bold">
                    <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1, transition: {delay: 2}}}
                    className=""> Nothing to see Yet!</motion.div>
                </div>
            </div>)
            }
        </div>

        </div>
    )
}