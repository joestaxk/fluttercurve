import { Navigate } from "react-router-dom";

export default function Root() {
  Navigate({to: "/login"})
  return (<>
   <h1 className="text-center">Redirecting...</h1>
  </>)
}