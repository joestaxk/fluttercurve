import { userDataStateType } from "@/rState/initialStates"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Compounding({state}:{state: userDataStateType}) {
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
            className="flex justify-around flex-wrap w-full translate-y-[-4rem]">
            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Compounding Balance</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{!state.compounding ? "0.00" : !state.compounding.totalBalance(state.compounding.totalDeposit as string, state.compounding.totalDeposit as string)} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.compounding?.totalDeposit || "0.00"} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Withdrawals</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.compounding?.totalWithdrawal || "0.00"} {state.currency}</h1>
              </div>

              <div className="">
                <Image src={`/${state.currency}.png`} width={50} height={50} alt="refer"/>
              </div>
            </motion.div>


            <motion.div variants={item}  className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow w-[23%] rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Earnings</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.compounding?.totalEarning || "0.00"} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>
          </motion.div>

          <div className="mt-5 w-full">
            <div className="text-center w-full text-4xl text-[#21212174] font-bold">
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1, transition: {delay: 2}}}
                 className=""> Nothing to see Yet!</motion.div>
            </div>
          </div>
        </main>
    )
}