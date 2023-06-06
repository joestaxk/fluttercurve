import { Pageloader } from "@/components/utils/buttonSpinner";
import auth from "@/lib/auth";
import { userDataState, userDataStateType } from "@/rState/initialStates";
import userDataReducer from "@/rState/reducerAction";
import { useRouter } from "next/navigation";
import {  useEffect, useReducer, useState } from "react";
import { Cookies, useCookies } from "react-cookie";

export default function withDashboard(
  WrappedComponent: React.FC<{ state: userDataStateType }>
) {
  return function AuthDashboard(props: any) {
    const [state, dispatch] = useReducer(userDataReducer, userDataState);
    const [data, setData] = useState({} as userDataStateType);
    const [cookies, setCookie, removeCookie] = useCookies();
    const router = useRouter();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await auth.isAuthenticated(
            cookies["x-access-token"] as string
          );
          const userData = await res.json();

          if(userData) {
            ['/login', '/register', '/', '/forget-password', '/verification'].forEach((pathname:string) => {
              if(location.pathname.startsWith(pathname)) {
                router.push("/login")
              }else {
                router.push("/office/dashboard")
              }
            })
            dispatch({ type: "addData", payload: { ...userData } });
            }else {
            router.push("/login")
          }
        } catch (error) {
          // // Handle error here
          // removeCookie('x-access-token')
          // router.push("/login")
        }
      };

      if(!cookies['x-access-token']) {
        router.push('/login')
      }else {
        fetchData();
      }
    }, [cookies]);
 
    useEffect(() => {
      console.log(state)
      setData(state);
    }, [state]);

    return (
      data.email ?
      <WrappedComponent state={data} {...props} />
      :
      <div className="w-full h-[100vh] flex justify-center items-center">
        <Pageloader />
      </div>
    );
  };
}
