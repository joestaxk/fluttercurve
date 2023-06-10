import Dashboard, { NormalMode } from "../../../../components/dashboard/Dashboard";
import { userDataStateType } from "../../../../rState/initialStates";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { PUBLIC_PATH } from "../../../../lib/requestService";
import useAlert from "../../../../hooks/alert";
import auth from "../../../../lib/auth";
import withDashboard from "../../../../hocs/withDashboard";
import { Link } from "react-router-dom";


function Page({state}:{state: userDataStateType}) {
  const [cookies] = useCookies();
  const [refferal, setRefferal] = useState([]);
  const { AlertComponent } = useAlert();

  useEffect(() => {
    async function fetchData() {
      try {
        return await auth.getRefferedUser(cookies['xat'] as string);
      } catch (error: any) {
        console.log(error.response)
      }
    }

    fetchData().then(({data}:any) => setRefferal(data))
  }, [])
    return (
      <main>
        <Dashboard state={state}>
          <div className="mt-4">
            <h1 className="text-3xl n:text-4xl text-white font-medium">Affiliate Marketing</h1>
             <div className="flex items-center mt-3">
               <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Home</h2>
               <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Affiliate Marketing</h2>
             </div>
          </div>
          <NormalMode />
        </Dashboard>

        <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity:1, y: -90}}
        transition={{ delay: 1, stiffness: ""}}
        className="flex justify-center gap-2 flex-wrap items-start w-full translate-y-[-40%] p-5">
          <div className={`bg-white ${state?.referral  ? "lg:w-[70%] w-full" : "w-[90%]"}  shadow rounded-lg min-h-[150px] p-4 flex items-center justify-between`}>
            <div className="">
                <h4 className="font-bold text-[#212121] text-3xl mb-3">My Referrals</h4>

                <div className="">
                  <h4 className="font-bold text-[#353535d4] text-xl mb-3">{!state.noRefferedUser ?"No referrals yet" : `${state.noRefferedUser} referrals Only`}</h4>
                  <p>Copy your referral link and start referring.</p>
                  <Link to={"/office/dashboard/profile"} className="w-fit flex items-center bg-[#393fff] p-3 mt-3 gap-2 transition hover:shadow-2xl shadow-[#212121dd] duration-200 text-white rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M29.25 6.76a6 6 0 0 0-8.5 0l1.42 1.42a4 4 0 1 1 5.67 5.67l-8 8a4 4 0 1 1-5.67-5.66l1.41-1.42l-1.41-1.42l-1.42 1.42a6 6 0 0 0 0 8.5A6 6 0 0 0 17 25a6 6 0 0 0 4.27-1.76l8-8a6 6 0 0 0-.02-8.48Z"/><path fill="currentColor" d="M4.19 24.82a4 4 0 0 1 0-5.67l8-8a4 4 0 0 1 5.67 0A3.94 3.94 0 0 1 19 14a4 4 0 0 1-1.17 2.85L15.71 19l1.42 1.42l2.12-2.12a6 6 0 0 0-8.51-8.51l-8 8a6 6 0 0 0 0 8.51A6 6 0 0 0 7 28a6.07 6.07 0 0 0 4.28-1.76l-1.42-1.42a4 4 0 0 1-5.67 0Z"/></svg>
                  <span>Start Referring</span>
                </Link>
                </div>
              </div>
          </div>

          {state?.referral ? <div className="bg-white lg:w-[20%] w-full min-h-[200px] shadow rounded-lg p-2 flex justify-center">
            <div className="flex flex-col">
               <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
                <img className="bg-no-repeat bg-center bg-cover w-full h-full" src={"/avatar-1.png"} width={50} height={50} alt="user image" />
               </div>

                <div className="">
                  <h4 className="font-bold text-[#353535d4] text-xl mb-3">{state?.referral}</h4>
                  <p className="#212121cc">You were referred by {state?.referral}. <span className="text-[#9b9b9b]">You can make 5%, when the refered user do their first deposit.</span></p>
                </div>
              </div>
          </div> : <></>}
         </motion.div>

         <div   className="flex flex-col items-center gap-2 flex-wrap justify-center translate-y-[-40%] w-full p-5">
             <div className="w-full flex flex-wrap gap-2">
               {
                refferal.length ? refferal.map(({createdAt, userName,firstDeposit,avatar}, i:number) => (
                  <div key={i.toString()} title={firstDeposit ? "User have made first deposit!": "User have not made any depost"} className="bg-white mb-4  w-[300px] border-[#ccc] border-[1px] shadow rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                        <img className="bg-no-repeat bg-center bg-cover w-full h-full" src={avatar ?`${PUBLIC_PATH}/private/users/${avatar}` : "/avatar-1.png"} width={50} height={50} alt="user image" />
                      </div>

                      <div className="">
                        <h4 className="font-bold text-[#353535d4] text-xl mb-3">{userName}</h4>
                        <p className="text-[#707070]">{createdAt}</p>
                      </div>
                    </div>

                    <svg className="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path fill={firstDeposit ? "green": "#ccc"} fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 0 0 1.745-.723a3.066 3.066 0 0 1 3.976 0a3.066 3.066 0 0 0 1.745.723a3.066 3.066 0 0 1 2.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 0 1 0 3.976a3.066 3.066 0 0 0-.723 1.745a3.066 3.066 0 0 1-2.812 2.812a3.066 3.066 0 0 0-1.745.723a3.066 3.066 0 0 1-3.976 0a3.066 3.066 0 0 0-1.745-.723a3.066 3.066 0 0 1-2.812-2.812a3.066 3.066 0 0 0-.723-1.745a3.066 3.066 0 0 1 0-3.976a3.066 3.066 0 0 0 .723-1.745a3.066 3.066 0 0 1 2.812-2.812Zm7.44 5.252a1 1 0 0 0-1.414-1.414L9 10.586L7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd"/></svg>
                  </div>
                )) : <></>
               }
            </div>
          </div>
          {AlertComponent}
      </main>
    )
  }



  const AffiliateWithAuth = withDashboard(Page)
  export default AffiliateWithAuth