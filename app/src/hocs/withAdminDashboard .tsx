import { Pageloader } from "@/components/utils/buttonSpinner";
import { AuthContext } from "@/context/auth-context";
import helpers from "@/helpers";
import { userDataStateType } from "@/rState/initialStates";
import {  Suspense, useContext, useEffect} from "react";

export default function withAdminDashboard(
  WrappedComponent: React.FC<{ state: userDataStateType }>
) {
  return function AuthDashboard(props: any) {
    const {appContextData} = useContext(AuthContext)
    
    useEffect(() => {
      console.log(appContextData)
      // if(!appContextData?.userData.isVerified || !appContextData?.userData || !appContextData?.userSession) {
      //   helpers.forceLogoutAdmin()
      // }
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
