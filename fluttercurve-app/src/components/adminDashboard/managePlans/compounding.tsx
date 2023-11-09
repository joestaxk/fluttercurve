import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import auth from "../../../lib/auth";
import adminAuth from "../../../lib/adminAuth";
import { DeposkelentonLoader } from "../../dashboard/depositInvest";
import helpers from "../../../helpers";
import ButtonSpinner from "../../utils/buttonSpinner";
import useAlert from "../../../hooks/alert";

export const ManageCompoundPlans = function () {
  const { showAlert } = useAlert();
  const [cookies] = useCookies();
  const [compoundPlans, setCompoundingPlans] = useState([]);
  const [currentPlan, setCurPlan] = useState({} as any);
  const [editPlan, setEditor] = useState(false);
  const [reqNewPlan, setReqPlan] = useState(false);

  const [createNewLoader, setCreateNewLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [genCompoundPlanpreloader, setGenCompoundPlanpreloader] =
    useState(false);
  const [curId, setCurId] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data }: any = await auth.getCompoundingPlans(
          cookies["xat"] as string
        );

        // set current data
        // if (data && !currentPlan?.id) {
          setCurPlan(data[curId]);
        // }

        return data;
      } catch (error) {}
    }
    fetchData().then((res: any) => setCompoundingPlans(res));
  }, [genCompoundPlanpreloader, updateLoader, deleteLoader, createNewLoader]);

  function handleSelectPlans(ev: any) {
    const tar = ev.target;
    setCurId(tar);
    setCurPlan(compoundPlans[tar.value]);
  }

  function handleCreateNewPlan(ev: any) {
    ev.preventDefault();

    const tar = ev.target;

    const data = {
      plan: tar.plan.value,
      interestRate: tar.interestRate.value,
      minAmt: tar.minAmt.value,
      maxAmt: tar.maxAmt.value,
      duration: tar.duration.value,
    };
    setCreateNewLoader(true);
    // create this data
    adminAuth
      .createNewCompoundPlan(data)
      .then((res: any) => {
        setCreateNewLoader(false);
        setReqPlan(false);
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        setCreateNewLoader(false);
        showAlert("success", err.response.data.description);
      });
  }

  function handleUpdatePlan(ev: any, id: number) {
    ev.preventDefault();

    const tar = ev.target;
    const data = {
      id,
      data: {
        plan: tar.plan.value,
        interestRate: tar.interestRate.value,
        minAmt: tar.minAmt.value,
        maxAmt: tar.maxAmt.value,
        duration: tar.duration.value,
      },
    };

    setUpdateLoader(true);
    // create this data
    adminAuth
      .updateExistingCompoundPlan(data)
      .then((res: any) => {
        setUpdateLoader(false);
        setReqPlan(false);
        setEditor(false);
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        console.log(err);
        setUpdateLoader(false);
        showAlert("error", err.response.data.description);
      });
  }

  function handleDeletePlan(ev: any, id: number) {
    ev.preventDefault();

    setDeleteLoader(true);
    adminAuth
      .deleteExisitngCompoundPlan(id)
      .then((res: any) => {
        setDeleteLoader(false);
        if (compoundPlans.length) {
          setCurPlan([]);
        }
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        showAlert("error", err.response.data || err.response.data.description);
        setDeleteLoader(false);
      });
  }

  function generateNormalPresamplePlan() {
    setGenCompoundPlanpreloader(true);
    adminAuth
      .generateCompoundPresamplePlan()
      .then((res: any) => {
        setGenCompoundPlanpreloader(false);
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        setGenCompoundPlanpreloader(false);
        showAlert("error", err.response.data || err.response.data.description);
      });
  }

  return (
    <>
      <div className="my-8 text-xl">
        <span className="text-blue-600 font-bold">Mode</span> Compounding
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
            {!compoundPlans.length ? (
              <option>Loading...</option>
            ) : (
              compoundPlans.map(({ plan }: any, i: number) => (
                <option key={i.toString()} value={i}>
                  {plan}
                </option>
              ))
            )}
          </select>
        </div>
        <button
          onClick={() => setReqPlan(!reqNewPlan)}
          className={`${
            reqNewPlan ? "border-red-600" : "border-green-600"
          } mt-3 border p-2 rounded-xl`}
        >
          {reqNewPlan ? "Dismiss Plan" : "Create new plan"}
        </button>

        {!compoundPlans.length && (
          <button
            disabled={genCompoundPlanpreloader}
            onClick={generateNormalPresamplePlan}
            className={`flex items-center gap-2 xl:ml-3 hover:bg-blue-50 border-blue-500 mt-3 disabled:opacity-50 border p-2 rounded-xl`}
          >
            {genCompoundPlanpreloader && <ButtonSpinner />}
            <span>Generate pre-sample plans</span>
          </button>
        )}
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
                      placeholder={"Enter interest rate ex 12-100"}
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
                    <div className="font-bold text-[#121d33e9]">Duration:</div>
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
                  <button
                    disabled={createNewLoader}
                    className="text-[#f6f6f6] disabled:opacity-50 rounded-xl p-3 border border-green-600 outline-none bg-green-600"
                  >
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
            <form
              onSubmit={(ev) => handleUpdatePlan(ev, currentPlan.id)}
              method="post"
            >
              <div className="w-[450px] transition-all duration-500 rounded-lg border border-blue-500 bg-[#fffefe] min-h-[300px]">
                <div className=" p-4 mb-3 flex flex-col w-full justify-between items-center">
                  <div className="text-2xl font-semi-bold text-[#323232d5] mb-2 font-bold">
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
                    <div className="text-[#22b76c] font-medium text-3xl">
                      {editPlan ? (
                        <input
                          type="text"
                          className="border-dotted border text-[#199878] border-gray-600 outline-none w-full"
                          name="interestRate"
                          defaultValue={currentPlan?.interestRate}
                        />
                      ) : (
                        <div className="text-[#199878] font-medium">
                          {parseInt(currentPlan?.interestRate)}
                          <sup>%</sup>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="">
                  <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                    <div className="font-bold text-[#526288]">
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
                    <div className="font-bold text-[#526288]">
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
                    <div className="font-bold text-[#526288]">Duration:</div>
                    <div className="text-[#212121cc]">
                      {editPlan ? (
                        <input
                          type="text"
                          name="duration"
                          className="border-dotted border border-gray-600 outline-none w-full"
                          defaultValue={currentPlan?.duration}
                        />
                      ) : (
                        <span>
                          {currentPlan?.duration} Month
                          {currentPlan?.duration > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap p-2 space-x-3">
                  {editPlan && (
                    <button
                      disabled={updateLoader}
                      className="disabled:opacity-50 text-[#f6f6f6] rounded-xl p-3 border border-green-600 outline-none bg-green-600"
                    >
                      Update
                    </button>
                  )}

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
                      !editPlan &&
                        showAlert(
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
    </>
  );
};
