import { Pageloader } from "../components/utils/buttonSpinner";
import { AuthContext } from "../context/auth-context";
import helpers from "../helpers";
import { userDataStateType } from "../rState/initialStates";
import {  Suspense, useContext, useEffect} from "react";

export default function withDashboard(
  WrappedComponent: React.FC<{ state: userDataStateType }>
) {
  return function AuthDashboard(props: any) {
    const {appContextData} = useContext(AuthContext)
    
    useEffect(() => {
      if(!appContextData?.userData || !appContextData?.userSession) {
       helpers.forceLogoutUser()
      }
    }, [appContextData]);
    return (
      <>
        {
          <Suspense fallback={<Pageloader />}>
            {
              !appContextData?.userData ? <div className="w-full h-[100vh] flex justify-center items-center"><Pageloader /></div>:
              <WrappedComponent state={appContextData?.userData} {...props} />              
            }
          </Suspense>
        }
      </>
    );
  };
}
