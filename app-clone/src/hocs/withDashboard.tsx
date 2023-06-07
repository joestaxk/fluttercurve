import auth from "@/lib/auth";
import { userDataState, userDataStateType } from "@/rState/initialStates";
import userDataReducer from "@/rState/reducerAction";
import { Suspense, useEffect, useReducer, useState } from "react";
import { Cookies, useCookies } from "react-cookie";

export default function withDashboard(
  WrappedComponent: React.FC<{ state: userDataStateType }>
) {
  return function AuthDashboard(props: any) {
    const [state, dispatch] = useReducer(userDataReducer, userDataState);
    const [data, setData] = useState({} as userDataStateType);
    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await auth.isAuthenticated(
            cookies["xat"] as string
          );
          const userData = await res.json();
          dispatch({ type: "addData", payload: { ...userData } });
        } catch (error) {
          // Handle error here
        }
      };

      fetchData();
    }, [cookies]);

    useEffect(() => {
      setData(state);
    }, [state]);

    return (
      <Suspense fallback={<>Loading....</>}>
        <WrappedComponent state={data} {...props} />
      </Suspense>
    );
  };
}
