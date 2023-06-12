import { Link } from "react-router-dom";
import helpers from "../../helpers";
import auth from "../../lib/auth";
import { userDataStateType } from "../../rState/initialStates";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";

type selectedType<T> = {
  dailyInterestRate: T,
  duration: T,
  guarantee: T
  id: number,
  minAmt: T|any,
  plan: T
}

export default function CompoundingInvesmentPlan({state}:{state: userDataStateType}) {
  const [cookies,] = useCookies();
  const [compoundingPlans, setCompoundingPlans] = useState([]);

  
  useEffect(() => {
    async function fetchData() {
      try {
        const {data}:selectedType<string>|any =  await auth.getCompoundingPlans(cookies['xat'] as string);
        if(data) {
          setCompoundingPlans(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])
  
  let x = () => {
    return{
      borderImage: "linear-gradient(20deg,transparent,#f3d8b8,transparent) 1 / 1 / 0 stretch",
      borderWidth: "1px",
    }
  }

    return (
    <div className="pb-5 p-3">
        <h1 className="text-3xl font-bold text-[#2b2b2b]">Make Deposits</h1>

        <div className="mt-5">
          <div className="text-xl border-dotted border-b-[#212121cc] text-[#121212d5]">01. Select Plan</div>

          <div className="flex flex-wrap w-full items-start gap-4 mt-4">
            {
              //@ts-ignore
              !compoundingPlans?.length ?<div className="mt-5 w-full">
              <div className="text-center w-full md:text-4xl text-2xl text-[#21212174] font-bold">
                  <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1, transition: {delay: 2}}}
                   className=""> Nothing to see Yet!</motion.div>
              </div>
            </div> : compoundingPlans.map(({interestRate, plan, duration, minAmt, maxAmt, uuid}:any, i:number) => (
                <div 
                key={i.toString()}
                style={x()}
                className="w-[450px] transition-all duration-500 rounded-lg bg-[#fffefe] min-h-[300px]">
                  <div className=" p-4 mb-3 flex flex-col w-full justify-between items-center">
                     <div className="text-2xl font-semi-bold text-[#323232d5] mb-2 font-bold">{plan}</div>
                     <div className="flex gap-3">
                       <div className="text-[#22b76c] font-medium text-3xl">{interestRate} <sup>%</sup></div>
                     </div>
                  </div>
   
                  <div className="">
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                          <div className="font-bold text-[#526288]">Minimum Amount:</div>
                          <div className="text-[#212121cc]">{helpers.currencyFormatLong(minAmt, state.currency)}</div>
                      </div>
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                          <div className="font-bold text-[#526288]">Maximum Amount:</div>
                          <div className="text-[#212121cc]">{helpers.currencyFormatLong(maxAmt, state.currency)}</div>
                      </div>
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                          <div className="font-bold text-[#526288]">Duration:</div>
                          <div className="text-[#212121cc]">{duration} Month{duration > 1 ? "s" : ""}</div>
                      </div>
                  </div>
                  
                  <div className="flex gap-1 p-4 w-full bg-[#514AB1]">
                     <label className={`flex gap-1 items-center  cursor-pointer font-bold hover:border-dotted hover:border-b-[1px] text-[#fff]`}>
                        <Link to={`/office/dashboard/compounding/deposit/invest/calculate/${uuid}`} className="">Continue with Plan </Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                    </label>
                   </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
}
