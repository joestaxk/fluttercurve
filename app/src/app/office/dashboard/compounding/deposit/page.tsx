"use client"
import DepositCompounding from "@/components/compounding/deposit";
import Dashboard from "@/components/dashboard/Dashboard";
import withDashboard from "@/hocs/withDashboard";
import Link from "next/link";

function Page({state}:{state: any}) {
    return (
      <main>
        <Dashboard state={state}>
          <div className="mt-4">
            <h1 className="text-4xl text-white font-medium">Compounding Deposits</h1>
             <div className="flex items-center mt-3">
               <h2 className="text-2xl text-[#e0e0e0] font-light">
                <Link href="/office/dashboard/compounding">Home</Link>
               </h2>
               <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-2xl text-[#e0e0e0] font-light">Compounding Deposits</h2>
             </div>
          </div>
        </Dashboard>

        <DepositCompounding state={state}/>
      </main>
    )
  }

  const CompoundingDepoWithDashboard = withDashboard(Page)

export default CompoundingDepoWithDashboard;
