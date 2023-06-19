import { Link } from "react-router-dom";
import Compounding from "../../../../components/compounding";
import Dashboard from "../../../../components/dashboard/Dashboard";
import withDashboard from "../../../../hocs/withDashboard";

function Page({state}:{state: any}) {
  console.log(state)
    return (
      <main>
        <Dashboard state={state}>
          <div className="mt-4">
            <h1 className="text-3xl n:text-4xl text-white font-medium">Compounding Mode</h1>
             <div className="flex items-center mt-3">
               <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Home</h2>
               <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Welcome</h2>
             </div>

             <div className="flex gap-3 mt-3">
              <div className="w-[200px] flex bg-slate-100 hover:bg-slate-200 transition-all duration-200 rounded-md ">
                <Link to={"/office/dashboard/compounding/deposit/invest"} className="p-4 w-full">Make Investment</Link>
              </div>

              <div className="w-[200px] bg-slate-100 flex hover:bg-slate-200 transition-all duration-200  rounded-md">
                <Link to={"/office/dashboard/compounding/deposit"} className="p-4 w-full">View Earnings</Link>
              </div>
             </div>
          </div>
        </Dashboard>
        <Compounding state={state}/>
      </main>
    )
  }

  const CompoundingWithDashboard = withDashboard(Page)

export default CompoundingWithDashboard;
