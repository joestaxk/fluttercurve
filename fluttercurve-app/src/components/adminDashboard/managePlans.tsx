import { useEffect, useState } from "react";
import helpers from "../../helpers";
import { useCookies } from "react-cookie";
import useAlert from "../../hooks/alert";
import auth from "../../lib/auth";
import { DeposkelentonLoader } from "../dashboard/depositInvest";
import adminAuth from "../../lib/adminAuth";

export const ManagePlans = function () {
  const { AlertComponent, showAlert } = useAlert();
  const [cookies] = useCookies();
  const [depositPlans, setDepositPlans] = useState([]);
  const [currentPlan, setCurPlan] = useState({} as any);
  const [editPlan, setEditor] = useState(false);
  const [reqNewPlan, setReqPlan] = useState(false);

  const [createNewLoader, setCreateNewLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data }: any = await auth.getDepositPlans(
          cookies["xat"] as string
        );

        // set current data
        if (data && !currentPlan?.id) {
          setCurPlan(data[0]);
        }
        return data;
      } catch (error) {
        
      }
    } 
    fetchData().then((res: any) => setDepositPlans(res));
  }, [deleteLoader, createNewLoader]);

  function handleSelectPlans(ev: any) {
    const tar = ev.target;
    setCurPlan(depositPlans[tar.value]);
  }

  function handleCreateNewPlan(ev: any) {
    ev.preventDefault();

    const tar = ev.target;

    const data = {
      plan: tar.plan.value,
      interestRate: tar.interestRate.value,
      minAmt: tar.minAmt.value,
      maxAmt: tar.maxAmt.value,
      guarantee: 100,
      duration: tar.duration.value
    }
    setCreateNewLoader(true)
    // create this data
    adminAuth.createNewPlan(data).then((res: any) => {
      setCreateNewLoader(false)
      setReqPlan(false)
      showAlert("success", res.data)
    }).catch((err: any) => {
      setCreateNewLoader(false)
      showAlert("success", err.response.data.description)
    })
  }

  function handleUpdatePlan(ev:any, id:number){
    ev.preventDefault();

    const tar = ev.target;
    const data = {
      id,
      data: {
        plan: tar.plan.value,
        interestRate: tar.interestRate.value,
        minAmt: tar.minAmt.value,
        maxAmt: tar.maxAmt.value,
        guarantee: 100,
        duration: tar.duration.value
      }
    }


    setUpdateLoader(true)
    // create this data
    adminAuth.updateExitingPlan(data).then((res: any) => {
      setUpdateLoader(false)
      setReqPlan(false)
      setEditor(false)
      showAlert("success", res.data)
    }).catch((err: any) => {
      console.log(err)
      setUpdateLoader(false)
      showAlert("error", err.response.data.description)
    })
  } 


  function handleDeletePlan(ev:any, id:number) {
    ev.preventDefault();

    setDeleteLoader(true)
    adminAuth.deleteExisitngPlan(id).then((res: any) => {
      setDeleteLoader(false)
      showAlert("success", res.data)
    }).catch((err: any) => {
      showAlert("error", (err.response.data||err.response.data.description))
      setDeleteLoader(false)
    })
  }

  return (
    <>
      <div className="w-full md:p-8 p-3">
        <div className="">
          <h2 className="text-xl font-medium text-gray-800">Plans</h2>
          <p className="text-gray-600">
            Create, Upate, Delete, and Manage plans here.
          </p>
        </div>

        {/* select the use plans */}
        <div className="mt-5 ">
          <label htmlFor="plan p-2 text-gray-600">Select Plan &darr;</label>
          <div className="w-[400px] rounded-xl border border-gray-400 overflow-hidden">
            <select
              onChange={handleSelectPlans}
              name="managePlan"
              id="plan"
              className="appearance-none border-none w-full p-3 bg-transparent outline-none"
            >
              {!depositPlans.length ? (
                <option>Loading...</option>
              ) : (
                depositPlans.map(({ plan }: any, i: number) => (
                  <option key={i.toString()} value={i}>
                    {plan}
                  </option>
                ))
              )}
            </select>
          </div>
          <button onClick={() => setReqPlan(!reqNewPlan)} className={`${reqNewPlan ? "border-red-600" :"border-green-600"} mt-3 border p-2 rounded-xl`}>
            {
              reqNewPlan ? "Dismiss Plan" : "Create new plan"
            }
          </button>
        </div>

        <div className="flex  flex-wrap w-full gap-4 mt-4">
          <>
            {reqNewPlan && (
                <form onSubmit={handleCreateNewPlan} method="post">
                  <div className="border border-green-400 w-[380px] transition-all duration-500 rounded-lg bg-[#fffefe] min-h-[300px]">
                    <div className=" p-4 mb-3 space-y-2">
                      <div className="text-2xl font-semi-bold text-[#2b2b2b]">
                        <input
                          type="text"
                          className="border-dotted border border-gray-600 outline-none w-full"
                          name="plan"
                          required
                          placeholder={"Enter Plan"}
                        />
                      </div>

                      <div className="flex gap-3">
                        <input
                          type="number"
                          name="interestRate"
                          required
                          className="border-dotted border text-[#199878] border-gray-600 outline-none w-full"
                          placeholder={"Enter interest rate ex 25-100"}
                        />
                      </div>
                    </div>

                    <div className="">
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                        <div className="font-bold text-[#121d33e9]">
                          Minimum Amount:
                        </div>
                        <div className="text-[#212121cc]">
                          <input
                            type="number"
                            name="minAmt"
                            required
                            className="border-dotted border border-gray-600 outline-none w-full"
                            placeholder={"Minimum Amount"}
                          />
                        </div>
                      </div>
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                        <div className="font-bold text-[#121d33e9]">
                          Maximum Amount:
                        </div>
                        <div className="text-[#212121cc]">
                          <input
                            type="number"
                            name="maxAmt"
                            required
                            className="border-dotted border border-gray-600 outline-none w-full"
                            placeholder={"Maximum Amount"}
                          />
                        </div>
                      </div>

                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                        <div className="font-bold text-[#121d33e9]">
                          Duration:
                        </div>
                        <div className="text-[#212121cc]">
                          <input
                            type="number"
                            name="duration"
                            required
                            className="border-dotted border border-gray-600 outline-none w-full"
                            placeholder={"duration ex. 7, 30, 365 days"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap p-2 space-x-3">
                      <button disabled={createNewLoader} className="text-[#f6f6f6] disabled:opacity-50 rounded-xl p-3 border border-green-600 outline-none bg-green-600">
                        Create this Plan
                      </button>
                    </div>
                  </div>
                </form>
            )}
          </>

          <>
            {!currentPlan?.id ? (
              <DeposkelentonLoader />
            ) : (
              <form onSubmit={(ev) => handleUpdatePlan(ev, currentPlan.id)} method="post">
                <div className="border border-orange-400 w-[380px] transition-all duration-500 rounded-lg bg-[#fffefe] min-h-[300px]">
                  <div className=" p-4 mb-3 flex w-full justify-between">
                    <div className="text-2xl font-semi-bold text-[#2b2b2b]">
                      {editPlan ? (
                        <input
                          type="text"
                          className="border-dotted border border-gray-600 outline-none w-full"
                          name="plan"
                          defaultValue={currentPlan?.plan}
                        />
                      ) : (
                        <span>{currentPlan?.plan} plan</span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {editPlan ? (
                        <input
                          type="text"
                          className="border-dotted border text-[#199878] border-gray-600 outline-none w-full"
                          name="interestRate"
                          defaultValue={currentPlan?.dailyInterestRate}
                        />
                      ) : (
                        <div className="text-[#199878] font-medium">
                          {parseInt(currentPlan?.dailyInterestRate) / 100}%
                        </div>
                      )}
                      <div className="text-[#212121cc]">everyday</div>
                    </div>
                  </div>

                  <div className="">
                    <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                      <div className="font-bold text-[#121d33e9]">
                        Minimum Amount:
                      </div>
                      <div className="text-[#212121cc]">
                        {editPlan ? (
                          <input
                            type="text"
                            name="minAmt"
                            className="border-dotted border border-gray-600 outline-none w-full"
                            defaultValue={currentPlan?.minAmt}
                          />
                        ) : (
                          <span>
                            {helpers.currencyFormatLong(
                              helpers.calculateFixerData(
                                "USD",
                                "USD",
                                parseInt(currentPlan?.minAmt)
                              ),
                              "USD"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                      <div className="font-bold text-[#121d33e9]">
                        Maximum Amount:
                      </div>
                      <div className="text-[#212121cc]">
                        {editPlan ? (
                          <input
                            type="text"
                            name="maxAmt"
                            className="border-dotted border border-gray-600 outline-none w-full"
                            defaultValue={currentPlan?.maxAmt}
                          />
                        ) : (
                          <span>
                            {helpers.currencyFormatLong(
                              helpers.calculateFixerData(
                                "USD",
                                "USD",
                                parseInt(currentPlan?.maxAmt)
                              ),
                              "USD"
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                      <div className="font-bold text-[#121d33e9]">
                        Money back guarantee:
                      </div>
                      <div className="text-[#212121cc]">
                        {currentPlan?.guarantee}%
                      </div>
                    </div>
                    <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                      <div className="font-bold text-[#121d33e9]">
                        Duration:
                      </div>
                      <div className="text-[#212121cc]">
                        {editPlan ? (
                          <input
                            type="text"
                            name="duration"
                            className="border-dotted border border-gray-600 outline-none w-full"
                            defaultValue={currentPlan?.duration}
                          />
                        ) : (
                          <span>{currentPlan?.duration} days</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap p-2 space-x-3">
                
                    {editPlan&&<button disabled={updateLoader} className="disabled:opacity-50 text-[#f6f6f6] rounded-xl p-3 border border-green-600 outline-none bg-green-600">
                        Update
                    </button>}
              
                    <button
                      type="button"
                      onClick={(ev) => handleDeletePlan(ev, currentPlan?.id)}
                      disabled={deleteLoader}
                      className="disabled:opacity-50 text-[#f6f6f6] rounded-xl p-3 border border-red-600 outline-none bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditor(!editPlan);
                        !editPlan && showAlert(
                          "success",
                          "You can now edit the plan contents"
                        );
                      }}
                      className="text-[#f6f6f6] rounded-xl p-3 border border-gray-600 outline-none bg-gray-600"
                    >
                      {editPlan ? "Cancel Editing" : "Edit"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        </div>
      </div>
      {AlertComponent}
    </>
  );
};
