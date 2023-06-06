import Link from 'next/link'
import React, { useState } from 'react'
import style from "./auth.module.css"
import auth from '@/lib/auth';
import instance from '@/lib/requestService';
import useAlert from '@/hooks/alert';
import ButtonSpinner from '../utils/buttonSpinner';


export default function ForgetPasswordComponent() {
  const {AlertComponent, showAlert} = useAlert()
  const [loading, setLoading] = useState(false);
  
  function handleForgetPassword(ev:any) {
    ev.preventDefault();
    const data = {
      email: ev.target.email.value
    }

    setLoading(true)
    instance.post('/client/auth/forgetPassword', data).then(({data}) => {
      showAlert("success", data.message)
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      const {message, description} = err?.response.data || err;
      if(message) {
        showAlert("error", message)
      }else if(description) {
        showAlert("error", description)
      }
    })
  }
  return (
    <main className='w-full h-full flex justify-center p-3'>
      <div className='w-[600px] min-h-auto rounded-xl md:p-8 p-4 bg-white'>
        <div className="">
          <div className="w-full text-center">
            <h1 className='text-[#33406a] text-3xl font-bold mb-1'>Forgotten Password</h1>
            <p className='md:text-lg text-sm'>Use the form below to request for a password reset mail.</p>
          </div>

          <form action="" onSubmit={handleForgetPassword} className='mt-8'>
            <div className='bg-[#f4f4f4] rounded-md mb-3 md:text-lg text-sm'>
              <input id='email' name='email' className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="text" placeholder="Enter your Email-address" required/>
            </div>

            <div className="w-full mt-5 flex justify-center">
              <button type="submit" className='bg-[#007bff] p-4 text-white font-bold rounded-md w-full disabled:bg-[#007bffb4] transition-all duration-300'  disabled={loading}>
                  {
                    loading ? <ButtonSpinner /> : "Reset Password"
                  }
              </button>
            </div>
          </form>

          <div className="mt-5">
            <div className={style.or}><span className='p-3 font-bold'>OR</span></div>
          </div>

          <div className="flex mt-3 justify-center md:gap-0 gap-1 md:text-lg text-sm">
            <p>Remembered your password? </p>
            <Link href={"/login"} className='ml-1 font-bold'>Login</Link>
          </div>
        </div>
      </div>
      {AlertComponent}
    </main>
  )
}
