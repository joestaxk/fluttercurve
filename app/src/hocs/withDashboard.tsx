import { Pageloader } from "@/components/utils/buttonSpinner";
import { AuthContext } from "@/context/auth-context";
import helpers from "@/helpers";
import auth from "@/lib/auth";
import { userDataState, userDataStateType } from "@/rState/initialStates";
import userDataReducer from "@/rState/reducerAction";
import { useRouter } from "next/navigation";
import {  Suspense, useContext, useEffect, useReducer, useState } from "react";
import { Cookies, useCookies } from "react-cookie";

export default function withDashboard(
  WrappedComponent: React.FC<{ state: userDataStateType }>
) {
  return function AuthDashboard(props: any) {
    const [state, dispatch] = useReducer(userDataReducer, userDataState);
    const [data, setData] = useState({} as userDataStateType);
    const {appContextData,updateContext} = useContext(AuthContext)
    
    useEffect(() => {
      if(!appContextData?.userData) {
       helpers.forceLogoutUser()
      }
    }, [appContextData]);
    return (
      <>
        {
          <Suspense fallback={<Pageloader />}>
            {
              !appContextData?.userData ? <div className="w-full h-[100vh] flex "><Pageloader /></div>:
              <WrappedComponent state={appContextData?.userData} {...props} />              
            }
          </Suspense>
        }
      </>
    );
  };
}
