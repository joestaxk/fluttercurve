"use client"
import Dashboard, { NormalMode } from "@/components/dashboard/Dashboard";
import Image from "next/image";
import TradingViewWidget from "@/components/dashboard/ChartTv";
// import { Suspense } from "react";
import withDashboard from "@/hocs/withDashboard";
import { userDataStateType } from "@/rState/initialStates";
import { Suspense } from "react";
import { motion } from "framer-motion";
import ButtonSpinner from "@/components/utils/buttonSpinner";


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

    return (
      <main>
        <Suspense fallback={<ButtonSpinner />}>
          <Dashboard state={state}>
            <div className="mt-4">
              <h1 className="text-4xl text-white font-medium">Dashboard</h1>
              <div className="flex items-center mt-3">
                <h2 className="text-2xl text-[#e0e0e0] font-light">Home</h2>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
                </span>
                <h2 className="text-2xl text-[#e0e0e0] font-light">Welcome, {state.userName}</h2>
              </div>
              <NormalMode />
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
                <h3 className="text-lg text-[#3c3c3c]">Number of Referral</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.noRefferedUser}</h1>
              </div>

              <div className="">
                <Image src={"/users.svg"} width={50} height={50} alt="refer"/>
              </div>
            </motion.div>


            <motion.div variants={item}  className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Withdrawals</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.userAccount?.totalDeposit || "0.00"} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>
          </motion.div>

          <div className="">
            <TradingViewWidget />
          </div>
        </Suspense>
      </main>
    )
  }

const DashboardWithAuth = withDashboard(Page)
export default DashboardWithAuth