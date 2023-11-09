import helpers from "../../../../helpers";
import Dashboard from "../../../../components/dashboard/Dashboard";
import withDashboard from "../../../../hocs/withDashboard";
import auth from "../../../../lib/auth";
import { userDataStateType } from "../../../../rState/initialStates";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Transactions from "../../../../components/dashboard/transactions";

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


  const [cookies] = useCookies();
  const [, setActiveWithdraw] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        return await auth.getActiveWithdrawal(cookies['xat'] as string);
      } catch (error) {
        console.log(error)
      }
    }

    fetchData().then(({data}: any) => {
      let calcAmt = 0;
      data.forEach(({amount}: {amount: string}) => {
        calcAmt += parseInt(amount);
      })
      setActiveWithdraw(calcAmt)
    })
  }, [])

    return (
      <main>
        <Dashboard state={state}>
          <div className="mt-4">
            <h1 className="text-3xl n:text-4xl text-white font-medium">All Transactions</h1>
             <div className="flex items-center mt-3">
               <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Home</h2>
               <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">See All Transactions</h2>
             </div>
          </div>
        </Dashboard>

        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex justify-around flex-wrap w-full translate-y-[-4rem] gap-3 p-4">
            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Withdrawal</h3>
                <h1 className="text-2xl font-semibold text-[#514AB1]">{
                  !state.userAccount ? 
                  helpers.currencyFormat(parseFloat("0"), state.currency) : 
                  helpers.currencyFormat(helpers.calculateFixerData("USD", state.currency, (state.userAccount.totalWithdrawal)), state.currency)
                }</h1>
              </div>

              <img src={`/${state.currency}.png`} width={50} height={50} alt="money"/>

            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total Deposits</h3>
                <h1 className="text-2xl font-semibold text-[#514AB1]">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency,(state.userAccount?.totalDeposit || "0.00")), state.currency)}</h1>
              </div>

              <img src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>

            {/* I don't know how it works */}
            <motion.div variants={item}  className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center  shadow lg:w-[23%] n:w-[48%] w-full  rounded-lg  h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Account Balance</h3>
                <h1 className="text-2xl font-semibold text-[#514AB1]">{
                  !state.userAccount ? 
                  helpers.currencyFormat(parseFloat("0"), state.currency) : 
                  helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency, (parseInt(state.userAccount.totalDeposit) + parseInt(state.userAccount.totalEarning) - parseInt(state.userAccount.totalWithdrawal))), state.currency)
                }</h1>
              </div>

              <img src={`/${state.currency}.png`} width={50} height={50} alt="money"/>
            </motion.div>
          </motion.div>

          {/*  */}
          <Transactions  state={state}/>
      </main>
    )
  }


const TransactionWithDashboard = withDashboard(Page);
export default TransactionWithDashboard;