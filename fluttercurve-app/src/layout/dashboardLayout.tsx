import { motion } from "framer-motion";
import { AuthContext } from "../context/auth-context";
import { useEffect, useState } from "react";
import helpers from "../helpers";
import { useCookies } from "react-cookie";
import { Outlet } from "react-router-dom";
import { ProfileContext } from "../context/profile-context";
import { userDataStateType } from "../rState/initialStates";
import auth from "../lib/auth";

const userData:userDataStateType = helpers.getLocalItem("user_data") as any
const profile_data:string|void|undefined = helpers.getLocalItemStr("profile_data")

export default function DashboardLayout() {
    const [cookies] = useCookies();
    const [appContextData, setAuth] = useState({userData, userSession: cookies['xat']});
    const [profileDataContext, setProfileData] = useState<string|any>(profile_data);

    const updateContext = function(obj: any) {
      setAuth(Object.assign(appContextData, obj))
    }

    const updateProfileContext = async function(data: string|null) {
      if(data) {
        helpers.storeLocalItem('profile_data', data);
        setProfileData(data)
        return;
      }

      // if(!userData['avatar']) {
      //   return null;
      // }else if(userData['avatar'] && !profile_data) {
        const profileData:string = await helpers.loadImg() as string;
        console.log(profileData)
        helpers.storeLocalItem('profile_data', profileData);
        setProfileData(profileData)
      }
    //   setProfileData(profile_data)
    // }


    useEffect(() => {
      auth.getMe(helpers.getCookie('xat')).then(({data}:any) => {
        helpers.storeLocalItem('user_data', data)
      })
      updateProfileContext(null)
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
