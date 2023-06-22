import helpers from "../../helpers";
import { userDataStateType } from "../../rState/initialStates"
import { motion } from "framer-motion"
import { useRef, useState } from "react";
import calculateCompoundingPlan from "../../helpers/calculateCompoundingData"
import { compoundPlanType } from "../../pages/office/dashboard/compounding/deposit/invest/calculate/page";
import { useParams } from "react-router-dom";
import auth from "../../lib/auth";
import useAlert from "../../hooks/alert";
import ButtonSpinner from "../utils/buttonSpinner";


export default function CalculateCompoundingInvestmentPlan({state, compoundingPlans}:{state: userDataStateType, compoundingPlans: compoundPlanType<string>}) {
    const {depositID} = useParams()
    const [intrestCalc, setIntrest] = useState({
        FIV:0,
        TIE:0,
        IB: 0,
        EIR:12,
    })
    const [multiIntrestCalc, setMultiIntrest] = useState([] as any[])
    const [validate, setValidation] = useState({
        min: false,
        max: false,
        amount: false,
        duration: false,
    })
    const periodRef: {current: any} = useRef(null)
    const amtRef: {current: any} = useRef(null)
    const {AlertComponent, showAlert} = useAlert()
    const [loading, setLoadingState] = useState(false)
    const ahref:{current: any} = useRef(null);

    // motion style
    const container = {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            delayChildren: 1.3
          }
        }
      }
      
      const item = {
        hidden: { opacity: 0 },
        show: { opacity: 1, y: -20}
      }



      function forValidatingData(data: any) {
        //EMPTYDATA VALIDATION
        if(!data.initialAmt) {
            setValidation((prevState:any) => { return {...prevState, amount: true}});
            return false
        }else {
            setValidation((prevState:any) => { return {...prevState, amount: false}})
        }
        // MIN VALIDATION
        if(data.initialAmt < helpers.calculateFixerData("USD", state.currency, parseInt(compoundingPlans.minAmt))) {
            setValidation((prevState:any) => { return {...prevState, min: true}})
            return false
        }else {
            setValidation((prevState:any) => { return {...prevState, min: false}})
        }
        // MAX VALIDATION
        if(data.initialAmt > helpers.calculateFixerData("USD", state.currency, parseInt(compoundingPlans.maxAmt))) {
            setValidation((prevState:any) => { return {...prevState, max: true}})
            return false
        }else {
            setValidation((prevState:any) => { return {...prevState, max: false}})
        }
        // DURATION VALIDATION
        if(data.compoundingPeriod < 1 || data.compoundingPeriod > 120) {
            setValidation((prevState:any) => { return {...prevState, duration: true}})
            return false
        }else {
            setValidation((prevState:any) => { return {...prevState, duration: false}})
        }
        return true;
      }

      async function handleSubmit(ev: any) {
        ev.preventDefault();
        let val = ev.target;

        const data = {
            initialAmt: val.initialAmt.value,
            compoundingPeriod: val.compoundingPeriod.value,
        }
        if(!forValidatingData(data)) return;
        // we will be sending this off after validation
        const _data = {
            compoundingPeriod: data.compoundingPeriod,
            id: depositID,
            amount: helpers.calculateFixerData(state.currency, "USD", data.initialAmt),
            currency:state.currency
        }
  
        setLoadingState(true)
        try {
            const response = await auth.makeInvestment(helpers.getCookie('xat'), _data);
            // restate all data 
            val.initialAmt.value = "";
            setLoadingState(false)
            showAlert("success", "Redirecting to payment Gateway");
            const constrURI = `https://commerce.coinbase.com/charges/${response.data.next}`
            ahref.current.href = constrURI;
            ahref.current.click();
        } catch (error:any) {
            setLoadingState(false)
            showAlert("error", error.response.data.message || "Something Wrong :(");
            if(error.response.data.code === "ETIMEDOUT"){
                return showAlert("error", "Timeout. try again :(");
            }
        }
      }

      function handleCalculation(){
        const data = {
            initialAmt: amtRef.current.value,
            compoundingPeriod: periodRef.current.value,
        }

        //for validation
        if(!forValidatingData(data)) return;
 
        // do some calculation
        let res:any = calculateCompoundingPlan.compoundingData(data.initialAmt, parseInt(compoundingPlans.interestRate), data.compoundingPeriod)
        setIntrest((prevState:any) => {return {...prevState, ...res.calculation}})
        return setMultiIntrest(res._data)
      }
      

    return (
        <main>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex justify-center gap-4 flex-wrap items-start w-full translate-y-[-4rem] p-3">
                
            <motion.div variants={item} className="shadow lg:w-[45%] n:w-[65%] md:w-[80%] w-full rounded-lg min-h-[300px] p-4 bg-[#fdffff]">
              <div className="">
                <form method="POST" onSubmit={handleSubmit}>
                    <div className="">
                        <label htmlFor="font-bold text-[#212121cc] text-xl mb-1">Enter Amount to Invest</label>
                        <div className={`${validate.amount ? "text-[#d62c2c] border-[#d62c2c]": "border-[#ccc] focus-within:border-[#4385ff]"} min-h-fit border-[1px] w-full flex`}>
                            <div className="w-[80%]">
                                <input type="number" name="initialAmt" ref={amtRef} defaultValue={helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency, compoundingPlans?.minAmt as any), state.currency)} className="w-full p-4 outline-none" placeholder="0.0"/>
                            </div>
                            <div className="w-[20%] flex flex-col items-center font-bold bg-[#ebebeb] text-[#526288] ">
                                <div>{compoundingPlans?.interestRate}%</div>
                                <div>interest</div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <div className={`${validate.min ? "text-[#d62c2c]": ""}`}>
                                Min. of <span className={`font-bold ${validate.min ? "text-[#d62c2c]": "text-[#526288]"}`}>{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency, compoundingPlans?.minAmt as any), state.currency)}</span>
                            </div>
                            <div className={`${validate.max ? "text-[#d62c2c]": ""}`}>
                                 Max. of <span className={`font-bold ${validate.max ? "text-[#d62c2c]": "text-[#526288]"}`}>{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency, compoundingPlans?.maxAmt as any), state.currency)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3">
                        <label htmlFor="font-bold text-[#526288] text-xl mb-1">Investment Duration</label>
                        <div className={`${validate.duration ? "text-[#d62c2c] border-[#d62c2c]": "border-[#ccc] focus-within:border-[#4385ff]"} transition-all duration-300  border-[1px] w-full flex`}>
                            <div className="w-[80%] ">
                                <input type="number" ref={periodRef} defaultValue={compoundingPlans?.duration} name="compoundingPeriod" className="w-full p-4 outline-none" placeholder="0.0"/>
                            </div>
                            <div className="w-[20%] text-[#526288] flex flex-col items-center  justify-center font-bold bg-[#ebebeb]">
                                <div>Month</div>
                            </div>
                        </div>
                    </div>
                  

                    <div className="flex justify-between mt-3">
                        <button onClick={handleCalculation} type="button" name="calculate" className="bg-[#3939ff] flex items-center p-3 gap-2  text-white font-semi-bold rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="white" d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm2 .5v2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5zm0 4v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM4.5 9a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM4 12.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zM7.5 6a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM7 9.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM10 6.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm.5 2.5a.5.5 0 0 0-.5.5v4a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-1z"/></svg>
                            <span>Calculate</span>
                        </button>

                        <button  type="submit" name="continue" className="bg-[#0e802c] disabled:bg-[#195f2bca] flex items-center p-3 gap-2 text-white font-semi-bold rounded-md " disabled={loading}>
                            <span>Continue</span>
                            {
                                loading ? 
                                <ButtonSpinner /> : 
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                            }
                        </button>
                    </div>
                </form>
              </div>

            </motion.div>

            <motion.div variants={item} className="shadow lg:w-[45%] n:w-[65%] md:w-[80%] w-full  min-h-[400px]">
              <div className="bg-[#fdffff] p-4 rounded-lg">
                <h2 className="text-[#526288] text-2xl font-semibold">Calculation Projection</h2>

                <div className="flex flex-wrap gap-2 mt-4">
                    <div className="w-[48%] min-h-[100px]">
                        <div className="text-lg font-[400] mb-2">Future investment value</div>
                        <div className="md:text-4xl text-xl font-semibold text-[#5e88e9]">
                            {
                                helpers.currencyFormat(intrestCalc.FIV.toFixed(2) as any, state.currency)
                            }
                        </div>
                    </div>
                    <div className="w-[48%] min-h-[100px] ">
                        <div className="text-lg font-[400] mb-2">Total interest earned </div>
                        <div className="md:text-4xl text-xl font-semibold text-[#33ce69]">
                            {
                                helpers.currencyFormat(intrestCalc.TIE.toFixed(2) as any, state.currency)
                            }
                        </div>
                    </div>
                    <div className="w-[48%] min-h-[100px] ">
                        <div className="text-lg font-[400] mb-2">Initial Balance</div>
                        <div className="md:text-4xl text-xl font-semibold text-[gray]">
                            {helpers.currencyFormat( intrestCalc.IB as any, state.currency)}
                        </div>
                    </div>
                    <div className="w-[48%] min-h-[100px] ">
                        <div className="text-lg font-[400] mb-2">Effective Interest Rate</div>
                        <div className="md:text-4xl text-xl text-[#ff8800] font-semibold">{intrestCalc.EIR.toFixed(2) as any} <sup>%</sup></div>
                        <p className="text-[#404040] mt-3 text-[15px]">The effective interest rate is the rate of interest / earnings that you receive on your investment after compounding has been included.</p>
                    </div>
                </div>
              </div>

              <div className="mt-3">
                    <table className="w-full">
                        <thead className="bg-[#1354e9] text-[#fff]">
                            <tr className="">
                                <th className="text-left py-4 pl-2">Periods</th>
                                <th className="text-left py-4 pl-2">Interest</th>
                                <th className="text-left py-4 pl-2">Total Interest</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                multiIntrestCalc.length ? multiIntrestCalc.map((data, i) => (
                                    <tr key={i.toString()}>
                                        <td className="text-left py-4 pl-2">{data?.period}</td>
                                        <td className="text-left py-4 pl-2">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency,data?.TIE as any), state.currency)}</td>
                                        <td className="text-left py-4 pl-2">{helpers.currencyFormatLong(helpers.calculateFixerData("USD", state.currency,data?.FIV as any), state.currency)}</td>
                                    </tr>
                                )):<tr></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </motion.div>
          </motion.div>
          {AlertComponent}
          <a ref={ahref} target="_blank" className="hidden">redirect</a>
        </main>
        )
}