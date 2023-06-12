import useAlert from "../../hooks/alert";
import auth from "../../lib/auth";
import { userDataStateType } from "../../rState/initialStates";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import ButtonSpinner from "../utils/buttonSpinner";

export default function Withdrawal({state}: {state: userDataStateType}) {
  const [cacheAcctBal, setAcctBal] = useState<null|string>(null)
  const [loading, setLoadingState] = useState<boolean>(false)
  const {AlertComponent, showAlert} = useAlert()
  const [cookies] = useCookies();

  useEffect(() => {
    setAcctBal(state.userAccount as any);
  }, [state])
  
  async function handleWithdrawalSubmit(ev: any){
    setLoadingState(true)
    ev.preventDefault();
    const tar = ev.target;
    const data = {
      amount: tar.amount.value,
      currency: tar.currency_method.value,
      walletAddress: tar.withdraw_details.value,
      mode: tar.mode_method.value
    }

    if(!cacheAcctBal){
       setLoadingState(false)
       return showAlert("error", "Deposit funds.")
      }
    try {
      const reqAcctBal = await auth.getAccountBalance(cookies['xat']);

      if(typeof reqAcctBal.data !== "number") {
        setLoadingState(false)
        return;
      }
      
      const res = await auth.newWithdrawalRequest(cookies['xat'], data)
      // if(res.status === 201) {
        setLoadingState(false)
        tar.amount.value = ""
        tar.currency_method.value = ""
        tar.withdraw_details.value = ""
        tar.mode_method.value = ""
        showAlert("success", res.data.message)
      // }
    } catch (error:any) {
      setLoadingState(false)
      console.log(error.response.data)
      showAlert("error", error.response.data.description.desc)
    }

  }


  return (
    <div className="p-3 mb-5">
      <h1 className="text-3xl mb-1 text-[#333]">Make Withdraw?</h1>
      <p className="mb-8 text-[#333333ca]">If you don&apos;t get recieve any funds after 24hrs make sure you contact our support team.</p>
      <div className="flex justify-start">
        <div className="xl:w-[50%] lg:w-[75%] md:w-[80%] w-full">
          <form 
            onSubmit={handleWithdrawalSubmit}
            action=""
            method="post">
            <div className=" ">
              <div className="mb-4">
                <label className="mb-2 text-[#212121cc] font-medium text-lg">Enter Withdrawal Amount</label>
                <div className="border-[#ccc] border-[1px]  rounded-lg overflow-hidden">
                  <input
                    type="number"
                    name="amount"
                    className="p-4 w-full outline-none bg-transparent"
                    placeholder={!state.userAccount ? "You can't withdraw due to insufficient funds" : "How much are you taking out?"}
                    id="withdrawal"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 text-[#212121cc] font-medium text-lg">Choose Currency</label>
                <div className="border-[#ccc] border-[1px] rounded-lg ">
                  <select name="currency_method" className="p-4 outline-none bg-transparent border-none w-full" required>
                    <option value="">-Payment Method-</option>
                    <option value="bitcoin">Bitcoin BTC</option>
                    <option value="ethereum_classic">Ethereum Classic ETC</option>
                    <option value="ethereum">Ethereum ETH</option>
                    <option value="litecoin">Litecoin LTC</option>
                    <option value="usdt">USDT USDT</option>
                    <option value="xrp">Ripple Coin XRP</option>
                    <option value="doge">Dogecoin DOGE</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 text-[#212121cc] font-medium text-lg">Choose Mode.</label>
                <div className="border-[#ccc] border-[1px] rounded-lg ">
                  <select name="mode_method" className="p-4 outline-none bg-transparent border-none w-full" required>
                    <option value="normal">Normal Mode</option>
                    <option value="compounding">Compounding Mode</option>
                  </select>
                </div>
              </div>

              <div className="">
                <label className="mb-2 text-[#303030cc] font-medium text-lg">Withdrawal Details</label>
                <div className="relative border-[#ccc] border-[1px]  rounded-lg overflow-hidden">
                  <input
                    type="text"
                    name="withdraw_details"
                    className="p-4 w-full outline-none bg-transparent"
                    placeholder="Paste Wallet Address here!"
                    id="withdrawal"
                    required
                  />
                </div>
              </div>

              
              <div className="mt-4">
                <button type="submit" className="px-3 flex items-center justify-center gap-2 bg-[#373cc1cc] hover:bg-[#373cc1a8] transition-all duration-300 py-4 rounded-lg font-bold text-[#fff] w-fit">
                  <span>
                    Withdraw
                  </span>
                  {
                    loading?<ButtonSpinner />: 
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path fill="#fff" d="M22 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1ZM7 20v-2a2 2 0 0 1 2 2Zm10 0h-2a2 2 0 0 1 2-2Zm0-4a4 4 0 0 0-4 4h-2a4 4 0 0 0-4-4V8h10Zm4-6h-2V7a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3H3V4h18Zm-9 5a3 3 0 1 0-3-3a3 3 0 0 0 3 3Zm0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1Z"/></svg>
                    </span>
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {AlertComponent}
    </div>

  );
}




