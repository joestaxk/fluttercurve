import { motion } from "framer-motion";
import { AuthContext } from "../context/auth-context";
import { useState } from "react";
import helpers from "../helpers";
import { useCookies } from "react-cookie";
import { Outlet } from "react-router-dom";

const userData = helpers.getLocalItem("user_data")

export default function DashboardLayout() {
    const [cookies] = useCookies();
    const [appContextData, setAuth] = useState({userData, userSession: cookies['xat']});

    const updateContext = function(obj: any) {
      setAuth(Object.assign(appContextData, obj))
    }

    return (
      <>
        <section>
          <motion.div
            initial={{opacity: 0}}
            animate={{ opacity:1 }}
            transition={{ delay: 1, stiffness: ""}}
          >
          <AuthContext.Provider value={{appContextData, updateContext} as any}>
            <main className="xl:pl-[300px] p-0 bg-[#fafbff] min-h-[100vh]">
              <Outlet/>
            </main>
          </AuthContext.Provider>
          </motion.div>
      </section>
      </>
    );
  }
