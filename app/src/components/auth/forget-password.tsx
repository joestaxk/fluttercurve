import Link from 'next/link'
import React from 'react'
import style from "./auth.module.css"

export default function ForgetPasswordComponent() {
  return (
    <main className='w-full h-full flex justify-center'>
      <div className='w-[600px] min-h-auto rounded-xl p-8 bg-white'>
        <div className="">
          <div className="w-full text-center">
            <h1 className='text-[#33406a] text-3xl font-bold mb-1'>Forgotten Password</h1>
            <p>Use the form below to request for a password reset mail.</p>
          </div>

          <form action="" className='mt-8'>
            <div className='bg-[#f4f4f4] rounded-md mb-3'>
              <input id='email' className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="text" placeholder="Enter your Email-address" />
            </div>

            <div className="w-full mt-5 flex justify-center">
              <input type="submit" className='bg-[#007bff] p-4 text-white font-bold rounded-md' value="Reset Password" />
            </div>
          </form>

          <div className="mt-5">
            <div className={style.or}><span className='p-3 font-bold'>OR</span></div>
          </div>

          <div className="flex mt-3 justify-center text-lg">
            <p>Remembered your password? </p>
            <Link href={"/login"} className='ml-1 font-bold'>Login</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
