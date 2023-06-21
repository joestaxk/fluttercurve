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

        <div className="p-5">
        <div className="bg-orange-200  w-full p-6 rounded-lg text-orange-600">
                <div className="mb-2">
                    <span>
                      6 User just logged in
                    </span>
                </div>
                <div className="">
                    <span>
                      1 New User just signed up
                    </span>
                </div>
            </div>
        </div>
      </main>
    )
  }

const AdminDashboardWithAuth = withAdminDashboard(Page)
export default AdminDashboardWithAuth