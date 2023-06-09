import { Pageloader } from "@/components/utils/buttonSpinner";
import { AuthContext } from "@/context/auth-context";
import helpers from "@/helpers";
import { userDataStateType } from "@/rState/initialStates";
import { useRouter } from "next/navigation";
import {  Suspense, useEffect, } from "react";

export default function withUnProtected(
  WrappedComponent: React.FC<{ state: userDataStateType }>
) {
  return function AuthDashboard(props: any) {
    const router = useRouter()
    const appContextData:userDataStateType = helpers.getLocalItem('user_data') as any

    useEffect(() => {
      if(appContextData?.email && helpers.getCookie('xat') && helpers.getCookie('xat')?.split('.').length === 3) {
        router.push("/office/dashboard")
      }
    }, [appContextData]);

    return (
      <>
        {
          <Suspense fallback={<Pageloader />}>
            {
              <WrappedComponent {...props} />              
            }
          </Suspense>
        }
      </>
    );
  };
}
