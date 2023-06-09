import { Link, useLoaderData } from "react-router-dom";
import CalculateCompoundingInvestmentPlan from "../../../../../../../components/compounding/calculate";
import Dashboard from "../../../../../../../components/dashboard/Dashboard";
import withDashboard from "../../../../../../../hocs/withDashboard";
import auth from "../../../../../../../lib/auth";
import { userDataStateType } from "../../../../../../../rState/initialStates";
import { useEffect, useState } from "react";
import helpers from "../../../../../../../helpers";

export type compoundPlanType<T> = {
  interestRate: T,
  maxAmt: T,
  minAmt: T
  plan: T,
  duration: T,
}

export async function loader({params}: any) {
  try {
    const {data}:any = await auth.getACompoundingPlans(helpers.getCookie("xat") as string, params.depositID);
    return data;
  } catch (error) {
    throw error
  }
}

function CompoundingInvesmentPlan({state}:{state: userDataStateType}) {
  const [compoundingPlans, setCompoundingPlans] = useState({} as compoundPlanType<string>);
  const data:any = useLoaderData();

  useEffect(() => {
    setCompoundingPlans(data)
  }, [data])

    return (
    <main>
      <Dashboard state={state}>
          <div className="mt-4">
            <h1 className="text-3xl n:text-4xl text-white font-medium">Compounding Investment</h1>
             <div className="flex items-center mt-3">
               <h2 className="text-sm md:text-xl n:text-2xl   text-[#ccc] font-medium">
                  <Link to="/office/dashboard/compounding">Home</Link>
              </h2>
               <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-sm md:text-xl n:text-2xl   text-[#ccc] font-medium">
                <Link to="/office/dashboard/compounding/deposit/invest">Compounding Investment</Link>
              </h2>
              <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
               </span>
              <h2 className="text-sm md:text-xl n:text-2xl   text-[#ccc] font-medium">{compoundingPlans.plan}</h2>
             </div>
          </div>
        </Dashboard>

        <CalculateCompoundingInvestmentPlan state={state}  compoundingPlans={compoundingPlans} />

    </main>
  )
}


const PlanWithDashboard = withDashboard(CompoundingInvesmentPlan)
export default PlanWithDashboard;