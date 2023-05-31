"use client"
import CalculateCompoundingInvestmentPlan from "@/components/compounding/calculate";
import Dashboard from "@/components/dashboard/Dashboard";
import withDashboard from "@/hocs/withDashboard";
import auth from "@/lib/auth";
import { userDataStateType } from "@/rState/initialStates";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export type compoundPlanType<T> = {
  interestRate: T,
  maxAmt: T,
  minAmt: T
  plan: T,
  duration: T,
}

function CompoundingInvesmentPlan({state, params}:{state: userDataStateType,params?: any}) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [compoundingPlans, setCompoundingPlans] = useState({} as compoundPlanType<string>);

  
  useEffect(() => {
    async function fetchData() {
      try {
        const ref = await auth.getACompoundingPlans(cookies['x-access-token'] as string, params.calculate);
        return (await ref.json())
      } catch (error) {
        console.log(error)
      }
    }
    fetchData().then((res:any) => setCompoundingPlans(res))
  }, [])

    return (
    <main>
      <Dashboard state={state}>
          <div className="mt-4">
            <h1 className="text-4xl text-white font-medium">Compounding Investment</h1>
             <div className="flex items-center mt-3">
               <h2 className="text-2xl text-[#e0e0e0] font-light">
                  <Link href="/office/dashboard/compounding">Home</Link>
              </h2>
               <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-2xl text-[#e0e0e0] font-light">
                <Link href="/office/dashboard/compounding/deposit/invest">Compounding Investment</Link>
              </h2>
              <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-2xl text-[#e0e0e0] font-light">{compoundingPlans.plan}</h2>
             </div>
          </div>
        </Dashboard>

        <CalculateCompoundingInvestmentPlan state={state}  compoundingPlans={compoundingPlans} />

    </main>
  )
}

export async function generateStaticParams({
  params: { calculate },
}: {
  params: { calculate: string };
}) {  
  return [{calculate}]
}

const PlanWithDashboard = withDashboard(CompoundingInvesmentPlan)
export default PlanWithDashboard;