import { useEffect, useState } from "react";
import useAlert from "../../../hooks/alert";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import adminAuth from "../../../lib/adminAuth";
import ButtonSpinner from "../../utils/buttonSpinner";

export default function CoinbaseApi() {
  const { showAlert, AlertComponent } = useAlert();
  const [showPassword, setShowPassword] = useState(false);
  const [, setApiKey] = useState("");
  const [loadingApiKey, setLoadingApiKey] = useState(false)
  const [loadingApiTestKey, setLoadingApiTestKey] = useState(false)

  useEffect(() => {
    // AXIOS REQ
    adminAuth.getCoinBaseApiKey().
    then((res: any) => {
        setApiKey(res.data.coinBaseApiKey);
      })
      .catch((err: any) => {
        console.error(err)
        showAlert("error", "Something went wrong!");
      });
  }, []);

  function togglePassword() {
      setShowPassword(!showPassword)
  }

  function handleCoinbaseApiKeySubmit(ev:any) {
    ev.preventDefault();

    const  {coinbaseKey} = ev.target;

    setLoadingApiKey(true)
    adminAuth
      .createOrUpdateCoinBaseApiKey({providedKey:  coinbaseKey.value})
      .then((res: any) => {
        setLoadingApiKey(false)
        showAlert("success", res.data.message)
      })
      .catch((err: any) => {
        setLoadingApiKey(false)
        showAlert("error", err.response.data.description)
        console.log(err);
      });
   }

   async function runTestOnApiKey(){
    setLoadingApiTestKey(true)
    try {
      const testRes = await adminAuth.testRunApiKey();
      setLoadingApiTestKey(false)
      showAlert("success", testRes.data)

    } catch (error:any) {
      console.log(error)
      setLoadingApiTestKey(false)
      showAlert("error", error.response.data.description)
    }
   }
  

  return (
    <div className="">
      <div className="border-[1px] border-gray-200 rounded-xl mt-2">
        <div className="bg-gray-100 p-3 font-medium flex justify-between">
          <span>Coinbase API Information</span>
        </div>

        <div className="p-4">
          <div className="">
            <label htmlFor="APINPUT">COINBASE API KEY</label>
            <form method="POST" onSubmit={handleCoinbaseApiKeySubmit}>
              <div className="mt-4 flex items-center gap-3">
                <div className="relative overflow-hidden border outline-none border-gray-300 rounded-lg lg:w-[400px] w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="coinbaseKey"
                    className="bg-transparent w-full p-4"
                    placeholder="Enter Api Key"
                  />
                  <span onClick={togglePassword} className="cursor-pointer">
                    {showPassword ? (
                      <EyeIcon className="absolute top-[30%] right-2 h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="absolute top-[30%] right-2 h-5 w-5" />
                    )}
                  </span>
                </div>
                <button disabled={loadingApiKey} className="outline-none disabled:opacity-75 flex gap-2 bg-[#2f46cc] text-white p-4 rounded">
                  {
                    loadingApiKey && (
                      <ButtonSpinner />
                    )
                  }
                  Update
                </button>

                <button type="button" onClick={runTestOnApiKey} disabled={loadingApiTestKey} className="outline-none disabled:opacity-75 flex gap-2 bg-[#cc342f] text-white p-4 rounded">
                  {
                    loadingApiTestKey && (
                      <ButtonSpinner />
                    )
                  }
                  Test Api Key
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {AlertComponent}
    </div>
  );
}
