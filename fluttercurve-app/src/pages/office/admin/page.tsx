import Dashboard, { NormalMode } from "../../../components/adminDashboard/Dashboard";
import withAdminDashboard from "../../../hocs/withAdminDashboard ";
import { userDataStateType } from "../../../rState/initialStates";
import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ButtonSpinner from "../../../components/utils/buttonSpinner";
import { Link } from "react-router-dom";
import adminAuth from "../../../lib/adminAuth";


function Page({state}:{state: userDataStateType}) {
  const [data, setData] = useState<any>({
    usercount: 0,
    depositcount: 0,
    suspendedcount: 0,
    verifycount: 0
  })
  const [toggle, setToggle] = useState(false)
  const [notifications, setNotification] = useState<{count: number, rows: any}>({} as any)

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
      async function getAllData() {
        const res = await adminAuth.getAllUserCount();
          setData(res.data)
        }
        
        getAllData();
    }, [])

    useEffect(() => {
      adminAuth.getNotification().then(({data}: any) => {
        setNotification(data)
      })
    }, [])

    return (
      <main>
        <Suspense fallback={<ButtonSpinner />}>
          <Dashboard state={state}>
            <div className="mt-4">
              <h1 className="text-3xl n:text-4xl text-white font-medium">Dashboard</h1>
              <div className="flex items-center mt-3">
                <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Home</h2>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
                </span>
                <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Welcome, {state.userName}</h2>
              </div>
              <NormalMode />
            </div>
          </Dashboard>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex justify-around flex-wrap w-full translate-y-[-4rem] gap-3 p-4">

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow lg:w-[23%] n:w-[48%] w-full rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Total usercount</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{data.usercount}</h1>
              </div>
              <div className="">
                <Link className="text-blue-600 hover:border-dotted hover:border-b-[1px] border-blue-600" to={"manage-users"}>view</Link>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow lg:w-[23%] n:w-[48%] w-full rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">OnGoing Plans</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{data.depositcount}</h1>
              </div>

              <Link className="text-blue-600 hover:border-dotted hover:border-b-[1px] border-blue-600" to={"manage-users"}>view</Link>
            </motion.div>

            <motion.div variants={item} className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow lg:w-[23%] n:w-[48%] w-full rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Suspened Users</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{data.suspendedcount}</h1>
              </div>

              <div className="">
                <Link className="text-blue-600 hover:border-dotted hover:border-b-[1px] border-blue-600" to={"manage-users"}>view</Link>
              </div>
            </motion.div>


            <motion.div variants={item}  className="bg-[url('/dashboard-bg.jpg')] bg-no-repeat bg-cover bg-center shadow lg:w-[23%] n:w-[48%] w-full rounded-lg h-[150px] p-4 flex items-center justify-between">
              <div className="">
                <h3 className="text-lg text-[#3c3c3c]">Verified Users</h3>
                <h1 className="text-2xl font-semibold text-[#4d6ae9]">{data.verifycount}</h1>
              </div>

              <Link className="text-blue-600 hover:border-dotted hover:border-b-[1px] border-blue-600" to={"manage-users"}>view</Link>
            </motion.div>
          </motion.div>
        </Suspense>

        <div className="p-5  translate-y-[-4rem]">
          <div className="bg-orange-100 border-[1px] border-orange-700  w-full p-6 pt-2 pb-1 rounded-lg text-orange-600">
            <div className="mb-3">
              <h1 className="text-2xl text-orange-800 font-semibold"><span>Notification</span><sup className="bg-orange-400 p-1">{notifications?.count}</sup></h1>
              <p>You get to see all new users, new deposit, logged in user</p>
            </div>

              <div className={`${toggle ? "max-h-[200px]" : "h-0"} overflow-y-auto scroll-smooth  transition-all duration-200`}>
                <div className="">
                    {
                      notifications?.rows?.length ? 
                      <>
                        {
                          notifications?.rows.map(({type, fullName, userIp, depositType}: any, i:number) => (
                            <div key={i.toString()}>
                              {
                                type === "EXISTING" ? 
                                
                                <div className="">
                                <div className="mb-2 bg-orange-300 p-3 rounded-xl flex justify-between items-center">
                                      <span className="font-meduim">
                                        <span className="border-dotted border-b-[1px] border-orange-600 cursor-pointer"><Link to={`manage-users?q=${fullName}`}>{userIp}</Link></span> just logged in
                                      </span>
{/*             
                                      <div className="w-5 h-5 flex items-center justify-start bg-orange-50 opacity-70 cursor-pointer rounded-full ">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="orange" d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"/></svg>
                                      </div> */}
                                </div>
                                </div>
                                : type === "DEPOSIT" ?
                                  <div className="">
                                      {/* <h1 className="text-2xl text-orange-400 font-semibold p-4 pl-0">Logged In Users</h1> */}
                                      <div className="mb-2 bg-orange-300 p-3 rounded-xl flex justify-between items-center">
                                            <span className="font-meduim">
                                              <span className="border-dotted border-b-[1px] border-orange-600 cursor-pointer">A User just made a success deposit on <Link to={`admin/manage-users?q=${depositType}`}></Link> Plan</span>
                                            </span>
{/*                   
                                            <div className="w-5 h-5 flex items-center justify-start bg-orange-50 opacity-70 cursor-pointer rounded-full ">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="orange" d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z"/></svg>
                                            </div> */}
                                      </div>
                                  </div> : <>Nothing is here</>
                              }
                            </div>
                          ))
                        }
                      </> : 
                      <></>
                    }

                  </div>
              </div>
                  {/* end of line */}

                <div className="w-full flex justify-center pt-2" onClick={() => setToggle(!toggle)}>
                    <div className="w-8 h-8 transition-all duration-200 flex items-center justify-start bg-orange-200 opacity-70 cursor-pointer rounded-full ">
                          {
                            toggle ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="currentColor" d="M212.24 164.24a6 6 0 0 1-8.48 0L128 88.49l-75.76 75.75a6 6 0 0 1-8.48-8.48l80-80a6 6 0 0 1 8.48 0l80 80a6 6 0 0 1 0 8.48Z"/></svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path fill="currentColor" d="m212.24 100.24l-80 80a6 6 0 0 1-8.48 0l-80-80a6 6 0 0 1 8.48-8.48L128 167.51l75.76-75.75a6 6 0 0 1 8.48 8.48Z"/></svg>
                          }
                      </div>
                  </div>
                </div>
          </div>
      </main>
    )
  }

const AdminDashboardWithAuth = withAdminDashboard(Page)
export default AdminDashboardWithAuth