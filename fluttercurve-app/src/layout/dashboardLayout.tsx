import { motion } from "framer-motion";
import { AuthContext } from "../context/auth-context";
import { useEffect, useState } from "react";
import helpers from "../helpers";
import { useCookies } from "react-cookie";
import { Outlet } from "react-router-dom";
import { ProfileContext } from "../context/profile-context";
import auth from "../lib/auth";

const profile_data:string|void|undefined = helpers.getLocalItemStr("profile_data")

export default function DashboardLayout() {
    const [cookies] = useCookies();
    const [appContextData, setAuth] = useState({userData: {}, userSession: cookies['xat']});
    const [profileDataContext, setProfileData] = useState<string|any>(profile_data);

    const updateContext = function(obj: any) {
      setAuth((prev:any) => {return {...prev, userData: obj}});
    }

    const updateProfileContext = async function() {
        const profileData:string = await helpers.loadImg() as string;
        setProfileData(profileData)
      }


    useEffect(() => {
      auth.getMe(helpers.getCookie('xat')).then(({data}:any) => {
        setProfileData(data)
        updateContext(data)
        updateProfileContext()
      })
      
      auth.currencyConversion(helpers.getCookie('xat')).then(({data}:any) => {
        helpers.storeLocalItem('currency_data', data)
      })
    }, [])


    useEffect(() => {
        auth.calculateEarningsAndDeposit(cookies['xat']).then(({data}:any) => {
          setAuth((prev:any) => {return {...prev,  userData: {...prev.userData, ...data}}})
        }).catch(console.log)
    }, [])

    return (
      <>
        <section>
          <motion.div
            initial={{opacity: 0}}
            animate={{ opacity:1 }}
            transition={{ delay: 1, stiffness: ""}}
          >
          <AuthContext.Provider value={{appContextData, updateContext} as any}>
            <ProfileContext.Provider value={{profileDataContext, updateProfileContext} as any}>
                <main className="xl:pl-[300px] p-0 bg-[#fafbff] min-h-[100vh]">
                  <Outlet/>
                </main>
            </ProfileContext.Provider>
          </AuthContext.Provider>
          </motion.div>
      </section>
      </>
    );
  }
