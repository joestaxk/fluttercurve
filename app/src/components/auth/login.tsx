"use client"
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import style from "./auth.module.css"
import ButtonSpinner from '../utils/buttonSpinner'
import instance from '@/lib/requestService'
import { useCookies } from 'react-cookie';
import PageLoader from 'next/dist/client/page-loader'
import { userDataStateType } from '@/rState/initialStates'
import helpers from '@/helpers'

export default function LoginComponent() {
  const [loading, setLoading] = useState(false)
  const [msgDesc, setMsgDesc] = useState("");
  const [err, setErr] = useState(false);
  const [cookies, setCookie] = useCookies([] as any);

  

  async function handleLogin(ev: any) {
   ev.preventDefault();
   const targ = ev.target;

   const userBodyData = {
    email: targ.email.value,
    password: targ.password.value,
   }

   //  set loading
   setLoading(true)
   try {
      const {data}: {data: {message: string, userData: userDataStateType, session: {accessToken: string}}} = await instance.post('/client/auth/login', userBodyData);
      setErr(false);
      setMsgDesc(data.message)
      setCookie('xat', data.session.accessToken, {path: "/",})
      helpers.storeLocalItem("user_data", data.userData);
      location.href = "/office/dashboard"
   } catch (error:any) {
    setLoading(false)
    if(error.response.data.description) {
      setErr(true)
      setMsgDesc(error.response.data.description)
    }
   }
  }
  return (
    <main className='w-full h-full flex justify-center p-3'>
      <div className='md:w-[600px] w-full min-h-auto rounded-xl md:p-8 p-4 bg-white'>
        <div className="">
          <div className="w-full text-center">
            <h1 className='text-[#33406a] text-3xl font-bold mb-1'>Welcome Back!</h1>
          </div>

          <form method='POST' onSubmit={handleLogin} className='mt-8'>
          <p className={`${err ? 'text-[red]' : 'text-[green]'} md:text-lg text-sm my-2`}>{msgDesc}</p>
            <label htmlFor="email" className='md:text-lg text-sm'>Your Email</label>
            <div className='bg-[#f4f4f4] rounded-md mb-3'>
              <input id='email' className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="email" name='email' required/>
            </div>

            <label htmlFor="pass" className='md:text-lg text-sm'>Password</label>
            <div className='bg-[#f4f4f4] rounded-md'>
              <input id='pass' className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' name='password' type="password" required/>
            </div>
            <div className="flex mt-3  md:text-lg text-sm md:gap-0 gap-1">
                <p>Forgot your password?</p>
                <Link href={"/forget-password"} className='ml-1 font-bold text-[#3e4553cc]'>Recover password</Link>
            </div>


            <div className="w-full flex mt-3 md:text-lg text-sm">
              <div className="flex">
                <input type="checkbox" className='mr-3' id="agree" name="agree" />
                <label htmlFor='agree' className='font-bold text-[#3e4553cc]'> Keep me logged in</label>
              </div>
            </div>

            <div className="w-full mt-4 flex justify-center">
              <button type="submit" className='bg-[rgb(12,108,242)] disabled:opacity-40 w-full h-[50px] text-white font-bold rounded-md' value="create account" disabled={loading}>{loading ? <ButtonSpinner /> : "Login"}</button>
            </div>
          </form>

          <div className="mt-5">
            <div className={style.or}><span className='p-3 font-bold text-[#3e4553cc]'>OR</span></div>
          </div>

          <div className="flex md:gap-0 gap-1 mt-3 justify-center md:text-lg text-sm">
            <p>Don&apos;t have an account?</p>
            <Link href={"/register"} className='ml-1 font-bold text-[rgb(12,108,242)]'>Sign Up Here</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
