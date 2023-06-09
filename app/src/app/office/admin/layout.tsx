"use client"
import Navigation from "@/components/dashboard/Navigation";
import Loading from "./loading";
import { motion } from "framer-motion";
import Router, { useRouter } from "next/router";
import { AuthContext } from "@/context/auth-context";
import { useState } from "react";
import { userDataStateType } from "@/rState/initialStates";
import helpers from "@/helpers";
import { useCookies } from "react-cookie";

const userData = helpers.getLocalItem("admin_data")
export default function AdminDashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode;
  }) {
    const [cookies, setCookies] = useCookies();
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
            <main className="xxl:pl-[330px] xl:pl-[300px] pl-0 bg-[#fafbff] min-h-[100vh]">
              {children}
            </main>
          </AuthContext.Provider>
          </motion.div>
      </section>
      </>
    );
  }
