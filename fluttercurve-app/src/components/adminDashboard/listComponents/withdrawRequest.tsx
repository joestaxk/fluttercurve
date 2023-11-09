import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext, ManageSingleUserLoader } from "../listData";
import adminAuth from "../../../lib/adminAuth";
import helpers from "../../../helpers";
import useAlert from "../../../hooks/alert";
import ButtonSpinner from "../../utils/buttonSpinner";

export default function WithdrawRequest() {
  const [user, setUser] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const { showAlert, AlertComponent } = useAlert();
  const context = useContext(CreateUserIDContext);

  const [approveLoader, setApproLoader] = useState(false);
  const [denyLoader, setDenyLoader] = useState(false);
  const [delLoader, setDelLoader] = useState(false);

  useEffect(() => {
    console.log(context);
    adminAuth
      .getUserWithdrawalRequest(context.ID)
      .then((res: any) => {
        setUser([...res?.data]);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [context.ID, approveLoader, denyLoader, delLoader]);

  useEffect(() => {
    if (!user.length) return;
    setData(user);
  }, [user, approveLoader, denyLoader, delLoader]);

  // approve
  function handleApprove(id:any) {
    setApproLoader(true)
    adminAuth
      .approveWithdrawalReq(id)
      .then((res: any) => {
        setApproLoader(false)
        showAlert("success", res.data)
        console.log(res)
      })
      .catch((error: any) => {
        showAlert("error", error.response.data.description)
        setApproLoader(false)
        console.log(error)
      });
  }
  // deny
  function handleDeny(id:any) {
    setDenyLoader(true)
    adminAuth
      .denyWithdrawalReq(id)
      .then((res: any) => {
        setDenyLoader(false)
        showAlert("success", res.data)
        console.log(res)
      })
      .catch((error: any) => {
        showAlert("error", error.response.data.description)
        setDenyLoader(false)
        console.log(error)
      });
  }
  // delete
  function handleDel(id:any) {
    setDelLoader(true)
    adminAuth
      .delWithdrawalReq(id)
      .then((res: any) => {
        setDelLoader(false)
        showAlert("success", res.data)
        console.log(res)
      })
      .catch((error: any) => {
        showAlert("error", error.response.data.description)
        setDelLoader(false)
        console.log(error)
      });
  }

  return (
    <div className="">
      {typeof user === "undefined" ? (
        <ManageSingleUserLoader />
      ) : (
        <>
          <div className="mt-5">
            <h2 className="text-xl font-medium text-[#212121cc]">
              Widthrawal Request
            </h2>
          </div>
          <div className="w-full overflow-y-auto rounded-2xl border-[1px] border-gray-100 mt-1">
            <table className="w-full border-[#e6e4e4] border-[1px]">
              <thead className="bg-[#f3f3f3]">
                <tr className="text-left">
                  <th className="p-3 font-medium">Currency</th>
                  <th className="p-3 font-medium">Wallet Address</th>
                  <th className="p-3 font-medium">mode</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Approve</th>
                  <th className="p-3 font-medium">Cancel</th>
                  <th className="p-3 font-medium">Delete</th>
                </tr>
              </thead>
              <tbody className="border-[#e6e4e4] border-[1px]">
                {!data.length ? (
                  <p className="p-3">No withdrawal Request</p>
                ) : (
                  data.map(
                    ({
                      id,
                      currency,
                      walletAddress,
                      mode,
                      status,
                      amount,
                    }: any) => (
                      <tr className="text-left">
                        <td className="p-3 font-medium">
                          {currency.toUpperCase()}
                        </td>
                        <td className="p-3 font-medium">{walletAddress}</td>
                        <td className="p-3 font-medium">{mode}</td>
                        <td className="p-3 font-medium">{status}</td>
                        <td className="p-3 font-medium">
                          {helpers.currencyFormatLong(
                            helpers.calculateFixerData(
                              "USD",
                              context?.user.currency,
                              amount
                            ),
                            context.user?.currency
                          )}
                        </td>

                        <td className="p-3 font-medium space-x-2 flex flex-wrap gap-2">
                          <button
                            onClick={handleApprove.bind(null, id)}
                            disabled={status == "SUCCESSFUL" || approveLoader}
                            className="bg-emerald-700 text-white rounded-full p-2 hover:opacity-90 transition-all duration-300 disabled:opacity-40"
                          >
                            {approveLoader ? (
                              <ButtonSpinner />
                            ) : (
                              <svg
                                aria-hidden="true"
                                fill="none"
                                stroke="white"
                                className="w-6"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.5 12.75l6 6 9-13.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                              </svg>
                            )}
                          </button>
                          </td>
                          <td>
                          <button
                            onClick={handleDeny.bind(null, id)}
                            disabled={status == "FAILED" || denyLoader}
                            className="bg-red-700 text-white rounded-full p-2 hover:opacity-90 transition-all duration-300 disabled:opacity-40"
                          >
                            {denyLoader ? (
                              <ButtonSpinner />
                            ) : (
                              <svg
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                className="w-6"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 18L18 6M6 6l12 12"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                              </svg>
                            )}
                          </button>
                          </td>
                          <td>
                          <button 
                          onClick={handleDel.bind(null, id)}
                          disabled={delLoader} className="bg-red-700 text-white rounded-full p-2 hover:opacity-90 transition-all duration-300 disabled:opacity-40">
                            {delLoader ? (
                              <ButtonSpinner />
                            ) : (
                              <svg
                                aria-hidden="true"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.5"
                                viewBox="0 0 24 24"
                                className="w-6"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                ></path>
                              </svg>
                            )}
                          </button>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
      {AlertComponent}
    </div>
  );
}
