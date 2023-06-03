import helpers from "@/helpers";
import auth from "@/lib/auth";
import { userDataStateType } from "@/rState/initialStates";
import { useEffect, useState} from "react";
import { useCookies } from "react-cookie";
import ButtonSpinner from "../utils/buttonSpinner";


type selectedType<T> = {
  dailyInterestRate: T,
  duration: T,
  guarantee: T
  id: number,
  minAmt: T|any,
  maxAmt: T|any,
  plan: T
}

export default function DepositInvesment({state}:{state: userDataStateType}) {
  const [cookies, setCookie, removeCookie] = useCookies();
  const [depositPlans, setDepositPlans] = useState([]);
  const [check, setifChecked] = useState("0");
  const [selectedData, setSelectedData] = useState({} as selectedType<string>)
  const [validate, setValidation] = useState({
    msg: "",
    stat: false,
    payMethod: false,
  })
  const [loading, setLoadingState] = useState(false)

  
  useEffect(() => {
    async function fetchData() {
      try {
        const {data}:any = await auth.getDepositPlans(cookies['x-access-token'] as string);
        return data
      } catch (error) {
        console.log(error)
      }
    }

    fetchData().then((res:any) => setDepositPlans(res))
  }, [])

  let x = (id:number) => {
    return{
      borderImage: `${check === id.toString() ?
        "linear-gradient(20deg,#2626b0df,#2626b0a0,transparent) 1 / 1 / 0 stretch" :
        "linear-gradient(45deg,#ccc,#2121212b,transparent) 1 / 1 / 0 stretch" 
      }`,
      borderWidth: "1px",
      // borderImageSlice: "1"
    }
  }

  function handleSelectID(ev:any, id:number) {
    const filterID:selectedType<string> = depositPlans.filter((depo: {id:number}) => id === depo?.id)[0]

    if(!filterID) return;
    setifChecked(ev.target.id.toString())

    setSelectedData(filterID)
  }

  function handleSubmit(ev:any) {
    ev.preventDefault();

    const formVal = ev.target;
    const data = {
      amount: parseInt(formVal.amount.value || 0) as number,
      paymentMethod: formVal.paymentMethod.value
    };

    if(data.amount < parseInt(selectedData.minAmt)) {
      // do error
      return setValidation({...validate, stat: true, msg: `minimum amount is ${helpers.currencyFormatLong(selectedData.minAmt, state.currency)}`})
    }else {
      setValidation({...validate, stat: false, msg: ""})
    }

    if(data.amount > parseInt(selectedData.maxAmt)) {
      // do error
      return setValidation({...validate, stat: true, msg: `maximum amount is ${helpers.currencyFormatLong(selectedData.maxAmt, state.currency)}`})
    }else {
      setValidation({...validate, stat: false, msg: ""})
    }

    if(!data.paymentMethod) {
      return setValidation({...validate, payMethod: true, msg: `Select a payment Method`})
    }else {
      setValidation({...validate, payMethod: false, msg: ""})
    }
    if(data.paymentMethod === "account") {
      // check account balance
      
    }

    if(data.paymentMethod === "e-currency") {
      setValidation({...validate, stat: false, msg: ""})
    }

    // make api before continuing process!
    const depoInfoData = {
      plan: selectedData.plan,
      duration: selectedData.duration,
      intrestRate: selectedData.dailyInterestRate,
      investedAmt: data.amount
    } 

    const chargeAPIData = {
        description: `Payment for ${selectedData.plan} Plan`,
        metadata: {
            customer_name: state.fullName
        },
        name: selectedData.plan,
        local_price: {
          amount: data.amount,
          currency: state.currency
      }
    }
    
    setLoadingState(true)
    auth.newDepositRequest(cookies['x-access-token'], {chargeAPIData, depoInfoData}).then(({data}:any) => {
      if(data.code === "ETIMEDOUT"){
        setLoadingState(false)
        return alert("timeout");
      }


      // restate all data 
      formVal.amount.value = "";
      setSelectedData({} as any);
      setLoadingState(false)
      const constrURI = `https://commerce.coinbase.com/charges/${data.data.next}`
      if(typeof window === "undefined") return;
      window.open(constrURI, '_blank')
    }).catch((err) => {
      setLoadingState(false)
      console.log(err)
    })
  }
    return (
    <div className="p-4">
        <h1 className="text-3xl font-bold text-[#2b2b2b]">Make Deposits</h1>

        <div className="mt-5">
          <div className="text-xl border-dotted border-b-[#212121cc] text-[#121212d5]">01. Select Plan</div>

          <div className="flex flex-wrap w-full gap-4 mt-4">
            {
              depositPlans.length ? depositPlans.map(({id, dailyInterestRate, plan, guarantee, duration, minAmt, maxAmt}:any, i:number) => (
                <div 
                style={x(id)}
                key={i.toString()}
                className="w-[380px] transition-all duration-500 rounded-lg bg-[#fffefe] min-h-[300px]">
                  <div className=" p-4 mb-3 flex w-full justify-between">
                     <div className="text-2xl font-semi-bold text-[#2b2b2b]">{plan} plan</div>
                     <div className="flex gap-3">
                       <div className="text-[#199878] font-medium">{dailyInterestRate}%</div>
                       <div className="text-[#212121cc]">everyday</div>
                     </div>
                  </div>
   
                  <div className="">
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                          <div className="font-bold text-[#121d33e9]">Minimum Amount:</div>
                          <div className="text-[#212121cc]">{helpers.currencyFormatLong(minAmt, state.currency)}</div>
                      </div>
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                          <div className="font-bold text-[#121d33e9]">Maximum Amount:</div>
                          <div className="text-[#212121cc]">{helpers.currencyFormatLong(maxAmt, state.currency)}</div>
                      </div>
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                          <div className="font-bold text-[#121d33e9]">Money back guarantee:</div>
                          <div className="text-[#212121cc]">{guarantee}%</div>
                      </div>
                      <div className="p-4 border-b-[#ccc] border-b-[1px] flex justify-between">
                          <div className="font-bold text-[#121d33e9]">Duration:</div>
                          <div className="text-[#212121cc]">{duration} days</div>
                      </div>
                  </div>
                  
                  <div className="flex gap-1 p-4 w-full">
                     <input type="radio" name="plans"  id={id} onChange={(ev) => handleSelectID(ev,id)}/>
                     <label htmlFor={id} className={`transition-all duration-300 ${check === id.toString() ? 'text-[#2626b0df]' : 'text-[#2626b0a0]'} hover:text-[#2626b0da] cursor-pointer font-bold`}>Select{check === id.toString() ? "ed" : ''}</label>
                   </div>
                </div>
              )) : <DeposkelentonLoader />
            }
          </div>
        </div>


        {/* Input data */}

        <div className="mt-5 p-8 pl-0">
          <div className="text-xl border-dotted border-b-[#212121cc] text-[#121212d5]">02. Enter the amount of Deposit:</div>
          <p className={`${(validate.stat || validate.payMethod) ? 'text-[red]' : 'text-[green]'}  my-2`}>{validate.msg}</p>
          <form method="POST" onSubmit={handleSubmit}>
              <div className="flex flex-wrap w-full gap-2 mt-4">
                <div className={`border-[1px] ${validate.stat ? "border-[#d20b0b]" : "border-[#ccc]"} md:w-1/2 w-full rounded-lg overflow-hidden`}>
                  <input 
                    type="text"
                   name="amount" 
                  placeholder={`Enter Amount: ${helpers.currencyFormatLong(parseInt(selectedData.minAmt as any || 0), state.currency)}`} 
                  className="outline-none bg-transparent p-3 w-full"/>
                </div>

                <div className={`border-[1px] ${validate.payMethod ? "border-[#d20b0b]" : "border-[#ccc]"} md:w-1/2 w-full  rounded-lg overflow-hidden`}>
                  <select name="paymentMethod"  className="p-4 w-full h-full bg-transparent border-none">
                      <option value="" selected>Select Payment Source</option>
                      <option value="account">Account  ({helpers.currencyFormatLong(parseInt(state.userAccount?.totalBalance as any || 0), state.currency)})</option>
                      <option value="e-currency">E-currency</option>
                  </select>
                </div>
              </div>
              <button 
              className="min-w-[200px] p-4 rounded-xl bg-[#483aeff2] flex items-center justify-center gap-1 disabled:cursor-not-allowed  disabled:bg-[#898797f2] disabled:shadow-none hover:shadow-[#5b5595f2] shadow-lg transition-all duration-300  text-[#fff] mt-[1rem] font-semibold" 
              disabled={isNaN(selectedData.minAmt) || loading}>
               {loading&&<ButtonSpinner />}
                <div className="whitespace-nowrap">Make Deposit</div> 
              </button>
          </form>
        </div>
      </div>
    )
}

export function DeposkelentonLoader() {
  const arr = [1,2,3,4,5,6,7]
  return (
    <div className="flex flex-wrap w-full gap-4">
      {
        arr.map((el, i:number) => (
          <div key={i.toString()} className="w-[380px] border-[1px] rounded-lg bg-[#cccccc30] border-[#ccc] h-[350px]">
          </div>
        ))
      }
  </div>
  )
}
