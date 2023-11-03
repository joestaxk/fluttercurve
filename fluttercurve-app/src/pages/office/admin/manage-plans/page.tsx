import Dashboard, { NormalMode } from "../../../../components/adminDashboard/Dashboard";
import withAdminDashboard from "../../../../hocs/withAdminDashboard ";
import { userDataStateType } from "../../../../rState/initialStates";
import { Suspense } from "react";
import ButtonSpinner from "../../../../components/utils/buttonSpinner";
import { ManagePlans } from "../../../../components/adminDashboard/managePlans";


function Page({state}:{state: userDataStateType}) {
    return (
      <main>
        <Suspense fallback={<ButtonSpinner />}>
          <Dashboard state={state}>
            <div className="mt-4">
              <h1 className="text-3xl n:text-4xl text-white font-medium">Dashboard</h1>
              <div className="flex items-center mt-3">
                <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Home</h2>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
                </span>
                <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Welcome, {state.userName}</h2>
              </div>
              <NormalMode />
            </div>
          </Dashboard>
        </Suspense>

        <ManagePlans />
      </main>
    )
  }

const AdminManagePlans = withAdminDashboard(Page)
export default AdminManagePlans