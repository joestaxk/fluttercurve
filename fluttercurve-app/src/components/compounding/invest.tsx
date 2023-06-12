import { userDataStateType } from "../../rState/initialStates"
import { motion } from "framer-motion"
import { Suspense } from "react"
import { DeposkelentonLoader } from "../dashboard/depositInvest"
import CompoundingInvesmentPlan from "./investPlans"

export default function CompoundingInvestment({state}:{state: userDataStateType}) {
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
         <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex justify-around flex-wrap w-full translate-y-[-4rem] gap-3 p-4">
            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Compounding Balance</h3>
                <h1 className="text-2xl font-semibold text-[#514AB1]">{!state.compounding ? "0.00" : !state.compounding.totalBalance(state.compounding.totalDeposit as string, state.compounding.totalDeposit as string)} {state.currency}</h1>
              </div>

              <img src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#514AB1]">{state.compounding?.totalDeposit || "0.00"} {state.currency}</h1>
              </div>

              <img src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Withdrawals</h3>
                <h1 className="text-2xl font-semibold text-[#514AB1]">{state.compounding?.totalWithdrawal || "0.00"} {state.currency}</h1>
              </div>

              <div className="">
                <img src={`/${state.currency}.png`} width={50} height={50} alt="refer"/>
              </div>
            </motion.div>


            <motion.div variants={item}  className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Earnings</h3>
                <h1 className="text-2xl font-semibold text-[#514AB1]">{state.compounding?.totalEarning || "0.00"} {state.currency}</h1>
              </div>

              <img src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>
          </motion.div>

          <Suspense fallback={<DeposkelentonLoader/>}>
            <CompoundingInvesmentPlan state={state} />
          </Suspense>
        </main>
    )
}