import helpers from "../../helpers";
import auth from "../../lib/auth";
import { Suspense, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { userDataStateType } from "../../rState/initialStates";
import { DeposkelentonLoader } from "../dashboard/depositInvest";

export default function Compounding({state}:{state: userDataStateType}) {
  const [cookies] = useCookies();
  const [data,setData] = useState([]);

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

      useEffect(() => {
        async function fetchData() {
            try {
                let {data}: any = await auth.getAllCompoundingDepositRequest(cookies['xat']);
                console.log(data)
                if(data.length) {
                    setData(data as any)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
      }, [])

      function calculateRemainingTime(expireAt: string): string {
            const expirationTime = new Date(expireAt);
            const currentTime = new Date();
    
            const remainingTimeInSeconds = Math.floor((expirationTime.getTime() - currentTime.getTime()) / 1000);
            const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
            const remainingSeconds = remainingTimeInSeconds % 60;
    
            const formattedTime = `${remainingMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}  `;
    
            return formattedTime;
        }
    
        function UpdateRemainingTime({ expireAt }: { expireAt: string }): React.ReactElement {
            const [remainingTime, setRemainingTime] = useState('');
          
            useEffect(() => {
              const intervalId = setInterval(() => {
                const time = calculateRemainingTime(expireAt);
                setRemainingTime(time);
          
                if (time === '00:00 remaining') {
                  clearInterval(intervalId);
                }
              }, 1000);
          
              return () => {
                clearInterval(intervalId);
              };
            }, [expireAt]);
          
            return <div>{remainingTime}</div>;
          }
          
    return (
        <main>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex justify-around flex-wrap w-full mobile:translate-y-[-4rem] translate-y-[-1rem] gap-3 p-4">
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

          <div className="pb-6 p-3">
            <h1 className="text-3xl mb-8 border-b-[#bdbdbdc0] border-b-[1px] text-[#333]">All Investment</h1>

            <Suspense fallback={<DeposkelentonLoader/>}>
              <div className="flex flex-wrap gap-3">
                  {
                      data.length ?
                      data.map((data:any) => (
                          // <div 
                          // style={{borderImage: "linear-gradient(100deg,#transparent,#3ddc75,transparent) 1 / 1 / 0 stretch"}}
                          // className="w-[380px] p-3 border-[1px] rounded-lg bg-[#e5e5e530] border-[#ccc] min-h-[350px] flex flex-col">
                          //     <div className="">
                              <div 
                              key={data.id.toString()}
                              style={{borderImage: "linear-gradient(100deg,#transparent,#3ddc75,transparent) 1 / 1 / 0 stretch"}}
                              className="w-[380px] p-3 border-[1px] rounded-lg bg-[#e5e5e530] border-[#ccc] min-h-[350px] flex flex-col">
                                  <div className="">
                                      <div className={`text-4xl ${data.status === "SUCCESSFUL" ? "text-[#56c87f]" : "text-[#437053]"} font-bold`}>{helpers.currencyFormatLong(data.initialBalance, state.currency)}</div>
                                  </div>

                                  <h2 className="text-3xl mt-4 font-semi-bold text-[#2b2b2b] mb-3">{data.plan} Plan</h2>


                                  <div className="flex justify-between mb-3">
                                      <div className="">Status: </div>
                                      <div className="font-semibold text-[#424242]">{data.status}</div>
                                  </div>

                                  <div className="flex justify-between mb-3">
                                      <div className="">Date Deposited: </div>
                                      <div className="">{new Date(data.createdAt).toDateString()}</div>
                                  </div>

                                  <div className="flex justify-between mb-3">
                                      <div className="">Time Deposited: </div>
                                      <div className="">{new Date(data.createdAt).toLocaleTimeString()}</div>
                                  </div>

                                  { data.status == "NEW" &&  <div className="flex justify-between flex-grow text-[#e83131] font-semibold">
                                      <div className="">Expires At: </div>
                                      <div className="">{Date.now() > (new Date(data.expiresAt) as any) ? "expired" : <UpdateRemainingTime expireAt={data.expiresAt} />}</div>
                                  </div> }

                                  { data.status == "SUCCESSFUL" &&  <div className="flex justify-between flex-grow">
                                      <div className="">Duration: </div>
                                      <div className="">7days</div>
                                  </div>}


                                  <div className="w-full flex flex-col gap-2 justify-center mt-8 text-[#eee] font-bold">
                                      {data.status == "NEW" && <Link target="_blank" to={`https://commerce.coinbase.com/charges/${data.chargeID}`} className="px-3 py-2 text-center rounded-xl w-full bg-[#514AB1] transition-all duration-200 hover:bg-[#212689d7]">Complete Payment</Link>}
                                      {/* <button className="px-3 py-2 rounded-xl w-full bg-[#f42525]">Cancel Payment</button> */}
                                      {
                                          data.status === "SUCCESSFUL" ?
                                          <>
                                              <button className="px-3 py-2 rounded-xl w-full bg-[#56c87f]">{parseInt(data.remainingDays) < parseInt(data.duration) ?  "In progress" : "Completed"}</button>
                                              <Link to={"/office/dashboard/earnings"} className="px-3 py-2 rounded-xl w-full bg-[#5680c8] text-center">View Earnings</Link>
                                          </> : <></>
                                      }
                                  </div>
                          </div> 
                      )) 
      
                  :   (<div className="mt-5 w-full">
                          <div className="text-center w-full text-4xl text-[#21212174] font-bold">
                              <motion.div
                              initial={{opacity: 0}}
                              animate={{opacity: 1, transition: {delay: 2}}}
                              className=""> Nothing to see Yet!</motion.div>
                          </div>
                      </div>)
                  }
              </div>
            </Suspense>

        </div>
        </main>
    )
}