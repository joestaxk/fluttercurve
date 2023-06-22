import Dashboard, { DropdownOverlay, NormalMode } from "../../../../components/adminDashboard/Dashboard";
import withAdminDashboard from "../../../../hocs/withAdminDashboard ";
import { userDataStateType } from "../../../../rState/initialStates";
import { Suspense, useState } from "react";
import ButtonSpinner from "../../../../components/utils/buttonSpinner";
import ManageUsers from "../../../../components/adminDashboard/manageusers";
import useAlert from "../../../../hooks/alert";
import adminAuth from "../../../../lib/adminAuth";


function Page({state}:{state: userDataStateType}) {
  const [expand,setExpance] = useState(false)
  const [loading,setLoading] = useState(false)
  const {AlertComponent, showAlert}  = useAlert()

  function handleSubmiting(ev:any) {
    ev.preventDefault();
    const val = ev.target
    if(!val.header.value || !val.message.value) return showAlert("error", "Invalid Message fields")

    setLoading(true)
    adminAuth.deliverMails(val.header.value, val.message.value).then(({data}:any) => {
      setLoading(true)
      showAlert("success", data?.message)
      val.message.value = ""
      val.header.value = ""
    }).catch((err:any) => {
      setLoading(false)
      showAlert("error", err.response?.data)
    })
  }
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
                <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Manage Users</h2>
              </div>
              <NormalMode />
            </div>
          </Dashboard>
        </Suspense>

        <ManageUsers />

        <div className={`fixed z-[51] bottom-0 right-0 mb-4 mr-3 min-w-15 border-[1px] border-purple-500 transition-all duration-800 ${!expand ? "min-h-15 flex justify-center items-center rounded-full p-1 bg-gray-100" : " min-h-[400px] rounded-lg"}`}>
          {expand ?
          <>
           <div className="z-[500] md:w-[400px] w-full  min-h-[400px] p-5 pr-0 bg-white   rounded-lg">
            <div className="mb-3">
              <h1 className="text-blue-500 text-2xl font-medium">Send Mail to your users</h1>
              <p className="text-md text-gray-600">You can only send mail to verified user's only.</p>
            </div>
            <div className="h-[400px] overflow-y-auto pr-4">
              <form action="" onSubmit={handleSubmiting}>
                {/* <div className="">
                  <label htmlFor="Subject">To:-</label>
                  <div className="border-[1px] mb-3 border-gray-200 rounded-lg p-1 focus-within:border-blue-500">
                      <input type="text" id="Subject" placeholder="Are you send to all client or just one." defaultValue={"admin@..,joestaxk@,hello@gmail.com....+20 more"}  className="outline-none p-3 bg-transparent  text-gray-400 w-full disabled:bg-slate-100" />
                </div>
                </div> */}
                <div className="">
                  <label htmlFor="Subject">Heading</label>
                  <div className="border-[1px] mb-3 border-gray-200 rounded-lg p-1 focus-within:border-blue-500">
                      <input type="text" name="header" id="Subject" placeholder="Header of your mail."  className="outline-none p-3 bg-transparent w-full disabled:bg-slate-100" required />
                  </div>

                  <label htmlFor="message">Message</label>
                  <div className="border-[1px] border-gray-200 rounded-lg p-2 focus-within:border-blue-500">
                    <textarea name="message" id="message"  className="bg-transparent w-full outline-none" placeholder="What message do you want to send to all your Client" cols={30} rows={10} required />
                  </div>

                  <button className="bg-blue-600 p-3 mt-2 text-white rounded-lg hover:bg-blue-500 disabled:opacity-60" disabled={loading}>Send Messages</button>
                </div>
              </form>
            </div>

          </div>
          </>
           :
          <button className="" onClick={() => setExpance(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 48 48"><g fill="none" stroke="#514AB1" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="M36 15h8v26H4V15h8m12 4V5m6 6l-6-6l-6 6"/><path d="m4 15l20 15l20-15"/></g></svg>
          </button>
          }
        </div>
          {expand && <DropdownOverlay cb={() => setExpance(false)} />}
          {AlertComponent}
      </main>
    )
  }

const AdminManageUser = withAdminDashboard(Page)
export default AdminManageUser