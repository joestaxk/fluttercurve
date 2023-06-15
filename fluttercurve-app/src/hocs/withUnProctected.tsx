import { Pageloader } from "../components/utils/buttonSpinner";
import helpers from "../helpers";
import { userDataStateType } from "../rState/initialStates";
import {  Suspense, useEffect, useState, } from "react";

export default function withUnProtected(
  WrappedComponent: React.FC<{ state: userDataStateType }>
) {
  return function AuthDashboard(props: any) {
    const appContextData:userDataStateType = helpers.getLocalItem('user_data') as any
     const [auth, setAuth] = useState(true)
    useEffect(() => {
      // const checks = appContextData?.email && helpers.getCookie('xat') && helpers.getCookie('xat')?.split('.').length === 3
      // if(!appContextData.isVerified && checks) {
      //   location.href = "/office/dashboard"
      // }else if(appContextData.isVerified && checks) {
      //   location.href = "/office/admin"
      // }

      setAuth(false)
    }, [appContextData]);

    return (
      <>
        {
          <Suspense fallback={<Pageloader />}>
            {
              auth ? <div className="w-full h-[100vh] flex justify-center items-center"><Pageloader /></div>:
              <WrappedComponent {...props} />    
            }
          </Suspense>
        }
      </>
    );
  };
}
