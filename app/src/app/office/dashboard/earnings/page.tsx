"use client"
import helpers from "@/helpers";
import Dashboard from "@/components/dashboard/Dashboard";
import DepositInvesment, { DeposkelentonLoader} from "@/components/dashboard/depositInvest";
import withDashboard from "@/hocs/withDashboard";
import auth from "@/lib/auth";
import { userDataStateType } from "@/rState/initialStates";
import { motion } from "framer-motion";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import AllEarning from "@/components/dashboard/Allearnings";

function Page({state}:{state: userDataStateType}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 1.3
      }
    }
  }
  
  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, y: -20}
  }


  const [cookies, setCookie, removeCookie] = useCookies();
  const [activeDepo, setActiveDeposit] = useState(0);
  const [depositPlans, setDepositPlans] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const ref = await auth.getActiveDeposit(cookies['x-access-token'] as string);
        return (await ref.json())
      } catch (error) {
        console.log(error)
      }
    }

    fetchData().then((res:any[]) => {
      let calcAmt = 0;
      res.forEach(({amount}) => {
        calcAmt += parseInt(amount);
      })
      setActiveDeposit(calcAmt)
    })
  }, [])
  
    return (
      <main>
        <Dashboard state={state}>
          <div className="mt-4">
            <h1 className="text-4xl text-white font-medium">My Earnings</h1>
             <div className="flex items-center mt-3">
               <h2 className="text-2xl text-[#e0e0e0] font-light">Home</h2>
               <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-2xl text-[#e0e0e0] font-light">My Earnings</h2>
             </div>
          </div>
        </Dashboard>

        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex justify-around flex-wrap w-full translate-y-[-4rem]">
            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Balance</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{!state.userAccount ? "0.00" : !state.userAccount.totalBalance(state.userAccount.totalDeposit as string, state.userAccount.totalDeposit as string)} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>

            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.userAccount?.totalDeposit || "0.00"} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Active Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{helpers.currencyFormat(activeDepo, state?.currency)}</h1>
              </div>

              <div className="">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 16 16"><path fill="#8d95af" d="m8 16l-2-3h1v-2h2v2h1l-2 3zm7-15v8H1V1h14zm1-1H0v10h16V0z"/><path fill="currentColor" d="M8 2a3 3 0 1 1 0 6h5V7h1V3h-1V2H8zM5 5a3 3 0 0 1 3-3H3v1H2v4h1v1h5a3 3 0 0 1-3-3z"/></svg>
              </div>
            </motion.div>

            {/* I don't know how it works */}
            <motion.div variants={item}  className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Withdrawals</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.userAccount?.totalWithdrawal || "0.00"} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>
          </motion.div>

          {/*  */}
            <AllEarning />
      </main>
    )
  }


const EarningWithDashboard = withDashboard(Page);
export default EarningWithDashboard;