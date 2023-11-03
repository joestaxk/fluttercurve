import {useEffect, useState } from "react";
import helpers from "../../../helpers";
import { motion } from "framer-motion";
import useAlert from "../../../hooks/alert";
import instance from "../../../lib/requestService";
import ButtonSpinner from "../../utils/buttonSpinner";


export default function CurrencyData() {
    const {AlertComponent, showAlert} = useAlert();
    const [data, setData] = useState([]);
    const [drop, setToggleDrop] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        instance.get("/service/getCurrencies").then((res) => {
           setData(res.data)
        }).catch((err:any) => {
            showAlert('error', err.response.data)
        })
    }, [])

    // useEffect(() => {
    //     const tmp = data.findIndex(({isDefault}: any) => isDefault);
    //     if(tmp == 0) return;
    //     const getTmp = data[tmp-1];
    //     data[tmp-1] = data[0];
    //     data[0] = getTmp;
    // }, [data])

    function handleSubmit(ev:any) {
        ev.preventDefault();
        const {
            currency
        } = ev.target;

        if(!currency.value || currency.value.length > 4) return showAlert('error', "Invalid currecy code") 
        setLoading(true)
        instance.post('/service/addCurrency', {currency: currency.value.toUpperCase()}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}}).then((res:any) => {
            setLoading(false)
            showAlert('success', res.data)
            currency.value = ""
        }).catch((err) => {
            setLoading(false)
            showAlert('error', err.response.data)
            console.log(err)
        })
    }

    function deleteCurrency(id:number) {
        data.splice(id-1, 1)
        setData([...data])
        setToggleDrop(false)
        setLoading(true)
        instance.post('/service/deleteCurrency', {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}}).then((res:any) => {
            setLoading(false)
            showAlert('success', res.data)
        }).catch((err) => {
            setLoading(false)
            showAlert('error', err.response.data)
            console.log(err)
        })
    }

    function switchDefault(id: number){
        setLoading(true)
        setToggleDrop(false)
        instance.post('/service/switchToDefault', {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}}).then((res:any) => {
            setLoading(false)
           setData(res.data.currencies)
           showAlert('success', res.data.message)
        }).catch((err) => {
            setLoading(false)
            showAlert('error', err.response.data)
            console.log(err)
        })
    }


  return (
    <div className="">
        <div className="border-[1px] border-gray-200 rounded-xl mt-2">
          <div className="bg-gray-100 p-3 font-medium flex justify-between">
            <span>Currency Information</span>
            <div className="flex items-center">
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4">
            <div className="bg-orange-200 flex w-full items-center p-6 rounded-lg text-orange-600">
                <div className="mr-3">
                    <b><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 80c-8.66 0-16.58 7.36-16 16l8 216a8 8 0 0 0 8 8h0a8 8 0 0 0 8-8l8-216c.58-8.64-7.34-16-16-16Z"/><circle cx="256" cy="416" r="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg> </b> 
                </div>
                <div className="">
                    <span>
                    The conversion currency is in "British Pounds", you can can switch to another currency. Ex. From
                    </span>
                    <span className="flex">
                        <code>£</code> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="orange" d="M18 10a1 1 0 0 0-1-1H5.41l2.3-2.29a1 1 0 0 0-1.42-1.42l-4 4a1 1 0 0 0-.21 1.09A1 1 0 0 0 3 11h14a1 1 0 0 0 1-1Zm3.92 3.62A1 1 0 0 0 21 13H7a1 1 0 0 0 0 2h11.59l-2.3 2.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4-4a1 1 0 0 0 .21-1.09Z"/></svg>
                        <code> Client choice($)</code>
                    </span>

                </div>
            </div>

            <div className="bg-orange-200 mt-2 w-full items-center p-6 rounded-lg flex gap-3 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="orange" d="m10 17.55l-1.77 1.72a2.47 2.47 0 0 1-3.5-3.5l4.54-4.55a2.46 2.46 0 0 1 3.39-.09l.12.1a1 1 0 0 0 1.4-1.43a2.75 2.75 0 0 0-.18-.21a4.46 4.46 0 0 0-6.09.22l-4.6 4.55a4.48 4.48 0 0 0 6.33 6.33L11.37 19A1 1 0 0 0 10 17.55ZM20.69 3.31a4.49 4.49 0 0 0-6.33 0L12.63 5A1 1 0 0 0 14 6.45l1.73-1.72a2.47 2.47 0 0 1 3.5 3.5l-4.54 4.55a2.46 2.46 0 0 1-3.39.09l-.12-.1a1 1 0 0 0-1.4 1.43a2.75 2.75 0 0 0 .23.21a4.47 4.47 0 0 0 6.09-.22l4.55-4.55a4.49 4.49 0 0 0 .04-6.33Z"/></svg>
                <a href="https://www.iban.com/currency-codes" referrerPolicy="no-referrer" target="_blank">See More currency code.</a>
            </div>


          </div>


          <div className="p-3">
            <form onSubmit={handleSubmit} action="" method="post" className="flex gap-2 flex-wrap">
                <div className="relative border-[1px] w-[300px] border-gray-400 outline-none rounded-lg focus-within:border-orange-400">
                    <input type="text" className="p-3 outline-none bg-transparent" name="currency" placeholder="Add a currency by code only."/>
                    <button type="button" onClick={() => setToggleDrop(!drop)} className="absolute top-4 right-0 mr-2 outline-none">
                        {
                            drop ? 
                            <svg xmlns="http://www.w3.org/2000/svg" className="rotate-180" width="18" height="18" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M4.182 6.182a.45.45 0 0 1 .636 0L7.5 8.864l2.682-2.682a.45.45 0 0 1 .636.636l-3 3a.45.45 0 0 1-.636 0l-3-3a.45.45 0 0 1 0-.636Z" clip-rule="evenodd"/></svg>
                            : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M4.182 6.182a.45.45 0 0 1 .636 0L7.5 8.864l2.682-2.682a.45.45 0 0 1 .636.636l-3 3a.45.45 0 0 1-.636 0l-3-3a.45.45 0 0 1 0-.636Z" clip-rule="evenodd"/></svg>
                        }
                    </button>

                    {drop && <motion.div
                     initial={{opacity: 0}}
                     animate={{opacity: 1, transition: {duration: .5}}}
                     exit={{opacity: 0, transition: {duration: .5}}}
                     className="w-full max-h-[200px] overflow-y-auto shadow-gray-200 shadow-lg rounded-md absolute border-[1px] border-gray-200 bg-[#fff] z-10">
                        {
                            data.length ? data.map(({id, currency, isDefault}:any) => (
                                <div key={id}>
                                    {
                                        isDefault ? (
                                            <label key={id} tabIndex={0} htmlFor="currency" className="w-full border-b-[1px] border-gray-200 flex justify-between items-center p-2">
                                                <span>{currency}</span>
                                                <span className="text-gray-500"><i>Default</i></span>
                                            </label>
                                        ) : (
                                        <div key={id} className="">
                                            <label tabIndex={0}   htmlFor={currency} className="w-full group border-b-[1px] border-gray-200 flex justify-between items-center p-2">
                                                <span>{currency}</span>
                                                <div className="flex gap-1">
                                                    <input type="radio" id={currency} onChange={switchDefault.bind(null, id)} name="markasdef" value={"USD"}/>

                                                    <motion.button
                                                    type="button"
                                                    onClick={deleteCurrency.bind(null, id)}
                                                    initial={{opacity: 0}}
                                                    animate={{opacity: 1, transition: {duration: .5}}}
                                                    exit={{opacity: 0, transition: {duration: .5}}}
                                                    className="hidden group-hover:block">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="red" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4.001h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-14ZM14 10l-4 4m0-4l4 4"/></svg>
                                                    </motion.button>
                                                </div>
                                            </label>
                                        </div>
                                        )
                                    }
                                </div>
                            )) : <label tabIndex={0} 
                            className="w-full group border-b-[1px] border-gray-200 flex justify-between items-center p-2">
                                 Add Something...
                          </label>
                        }
                    </motion.div>}
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 transition duration-100 p-3 flex gap-1 text-gray-50 rounded-lg disabled:opacity-60" disabled={loading}>
                   {loading && <ButtonSpinner />}
                    Add Currency
                </button>
            </form>
          </div>

        </div>
        {AlertComponent}
    </div>
  );
}
