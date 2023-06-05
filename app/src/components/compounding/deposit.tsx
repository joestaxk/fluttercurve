import { userDataStateType } from "@/rState/initialStates"
import { motion } from "framer-motion"
import Image from "next/image"

function DepositCompounding({state}:{state: userDataStateType}) {
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
                <h3 className="text-lg text-[#3c3c3c]">Earned So Far</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{!state.userAccount ? "0.00" : !state.userAccount.totalBalance(state.userAccount.totalDeposit as string, state.userAccount.totalDeposit as string)} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.userAccount?.totalDeposit || "0.00"} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Active Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.noRefferedUser}</h1>
              </div>

              <div className="">
                <Image src={`/${state.currency}.png`} width={50} height={50} alt="refer"/>
              </div>
            </motion.div>


            <motion.div variants={item}  className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Ended Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{state.userAccount?.totalDeposit || "0.00"} {state.currency}</h1>
              </div>

              <Image src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>
          </motion.div>

          {/* <div className="mt-5 w-full">
            <div className="text-center w-full text-3xl text-[#21212174] font-bold">
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1, transition: {delay: 2}}}
                 className=""> Nothing to see Yet!</motion.div>
            </div>
          </div> */}
          <Deposits />
        </main>
    )
}

function Deposits() {
    return (
        <main className="bg-white w-[35%] rounded-lg border-[#ccc] border-[1px] shadow-2xl">
          <div className="">
            <h2>£10,000</h2>
            <div className=""> (12%)</div>
          </div>
           <div className="">
              <div className="">Not started</div>
              <div className="">Awaiting Approval</div>
           </div>
           <div className="">
            Plan:
            <span>Optima Compounding (Promo)</span>
           </div>

           <div className="border-t-[#ccc] border-t-[1px] p-5">
              <div className=""></div>
              <div className="">
                <div className="">Date Deposited</div>
                <div className="">19th May 2023 09:12:04 am</div>
              </div>
           </div>
        </main>
    )
}
export default DepositCompounding;