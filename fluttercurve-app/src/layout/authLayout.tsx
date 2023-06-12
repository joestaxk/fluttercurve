import { Link } from "react-router-dom";
// import LoginComponent from "@/components/auth/login";
// import withDashboard from "@/hocs/withDashboard";
// import withUnProtected from "@/hocs/withUnProctected";
import { Outlet } from "react-router-dom";
import { MAIN_URL } from "../lib/requestService";

export default function AuthLayout(){
  
    return (
      <main className="bg-authSkin min-h-[100vh] w-full">
          <div className="w-full flex justify-start p-[.3rem]">
             <div className="w-full flex justify-between items-center">
                 <Link  to={MAIN_URL} className="flex gap-2 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"/></svg>
                    <span className="md:block hidden whitespace-nowrap">Go back</span>
                  </Link>
                  
                  <div className="relative px-2 py-4 w-full flex justify-center">
                    <img src="/main_long.png" alt="" className="w-[200px] h-auto object-contain" />
                  </div>
                  <div className=""></div>
              </div>
           </div>

           <Outlet/>
      </main>
    )
}



// export default withUnProtected(Page);