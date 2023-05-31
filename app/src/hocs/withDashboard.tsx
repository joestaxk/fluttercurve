import auth from "@/lib/auth"
import { userDataState, userDataStateType } from "@/rState/initialStates"
import userDataReducer from "@/rState/reducerAction"
import { Suspense, useEffect, useReducer, useState } from "react"
import { Cookies, useCookies } from "react-cookie";



export default function withDashboard(WrappedComponent: React.FC<{state: userDataStateType}>) {

  return function (props:any) {
    const [state, dispatch] = useReducer(userDataReducer, userDataState)
    const [data, setData] = useState({} as userDataStateType)
    const [cookies, setCookie, removeCookie] = useCookies();

    useEffect(() => {
      auth.isAuthenticated(cookies['x-access-token'] as string).then(res => res.json()).then((res:userDataStateType) => {
        dispatch({type: "addData", payload: {...res}})
      })
    }, [])

    useEffect(() => {
      setData(state)
    }, [state])

    return(
      <Suspense fallback={<>Loading....</>}>
        <WrappedComponent state={data} {...props}/>
      </Suspense>
    )
  }
}