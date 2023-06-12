import { useEffect, useState } from 'react'
import style from "./auth.module.css"
import ButtonSpinner from '../utils/buttonSpinner';
import auth from '../../lib/auth';
import instance from '../../lib/requestService';
import useAlert from '../../hooks/alert';
import { Link } from 'react-router-dom';
import { useLoaderData } from "react-router-dom";



export async function loader({ params }: any) {
  return {token: params.token}
}

export default function ForgetPassword() {
  const {AlertComponent, showAlert} = useAlert()
  const [loading, setLoading] = useState(false);
  const [viewPwd, setViewPwd] = useState({
    cpass: false,
    pass: false
  });
  const { token }: any = useLoaderData();
  const [switchForm, setSwitch] = useState(false);


  useEffect(() => {
    console.log(token)
    if(!token||token?.length < 12) return;
     setSwitch(true);
  }, [token])

  async function handleResetPassword(ev:any) {
    ev.preventDefault();
    const body =  {
      password: ev.target.password.value,
      cpassword: ev.target.cpassword.value
    }

    if(body.password !== body.cpassword) {
      return showAlert("error", 'Mismatch passwords')
    }

    try {
      const res = await auth.updatePasswordByLink(token, {password: body.password});
      showAlert("success", res.data.message)
    } catch (error:any) {
      showAlert("error", error.response.data?.description)
    }
  }
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
            <h1 className='text-[#514AB1] text-3xl font-bold mb-1'>Forgotten Password</h1>
            <p className='md:text-lg text-sm text-[#1f3446d9]'>Use the form below to request for a password reset mail.</p>
          </div>

          {
            !switchForm ?
            <form action="" onSubmit={handleForgetPassword} className='mt-8'>
              <div className='bg-[#f4f4f4] rounded-md mb-3 md:text-lg text-sm'>
                <input id='email' name='email' className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="text" placeholder="Enter your Email-address" required/>
              </div>

              <div className="w-full mt-5 flex justify-center">
                <button type="submit" className='bg-gradient-to-tl from-[#A33E94] to-[#514AB1] p-4 text-white font-bold rounded-md w-full flex justify-center disabled:bg-[#514ab1b3] transition-all duration-300'  disabled={loading}>
                    {
                      loading ? <ButtonSpinner /> : "Reset Password"
                    }
                </button>
              </div>
          </form> :
          <form action="" onSubmit={handleResetPassword} className='mt-8'>
          <div className='bg-[#f4f4f4] rounded-md mb-3 md:text-lg text-sm relative'>
            <input title="Password should be > 8" name='password' className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type={viewPwd.pass ? "text" : "password"} placeholder="Enter your new password" required autoComplete='off'/>
            <button type='button' onClick={() => setViewPwd((PREV) => {return {...PREV, pass: !viewPwd.pass}} )}  className='appearance-none border-none absolute right-2 top-3'>
              {!viewPwd.pass ? <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 12 12"><path fill="#212121cc" d="M1.974 6.659a.5.5 0 0 1-.948-.317c-.01.03 0-.001 0-.001a1.633 1.633 0 0 1 .062-.162c.04-.095.099-.226.18-.381c.165-.31.422-.723.801-1.136C2.834 3.827 4.087 3 6 3c1.913 0 3.166.827 3.931 1.662a5.479 5.479 0 0 1 .98 1.517l.046.113c.003.008.013.06.023.11L11 6.5s.084.333-.342.474a.5.5 0 0 1-.632-.314v-.003l-.006-.016a3.678 3.678 0 0 0-.172-.376a4.477 4.477 0 0 0-.654-.927C8.584 4.673 7.587 4 6 4s-2.584.673-3.194 1.338a4.477 4.477 0 0 0-.795 1.225a2.209 2.209 0 0 0-.03.078l-.007.018ZM6 5a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM5 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Z"/></svg>
                : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#212121cc" strokeLinecap="round" strokeLinejoin="round" stroke-width="2"><path d="M6.873 17.129c-1.845-1.31-3.305-3.014-4.13-4.09a1.693 1.693 0 0 1 0-2.077C4.236 9.013 7.818 5 12 5c1.876 0 3.63.807 5.13 1.874"/><path d="M14.13 9.887a3 3 0 1 0-4.243 4.242M4 20L20 4M10 18.704A7.124 7.124 0 0 0 12 19c4.182 0 7.764-4.013 9.257-5.962a1.694 1.694 0 0 0-.001-2.078A22.939 22.939 0 0 0 19.57 9"/></g></svg>
              }
            </button>
          </div>

          <div className='bg-[#f4f4f4] rounded-md mb-3 md:text-lg text-sm relative'>
            <input name='cpassword' className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type={viewPwd.cpass ? "text" : "password"} placeholder="Confirm new password" required autoComplete='off'/>
            <button onClick={() => setViewPwd((PREV) => {return {...PREV, cpass: !viewPwd.cpass}} )} type='button' className='appearance-none border-none absolute right-2 top-3'>
              {!viewPwd.cpass ? <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 12 12"><path fill="#212121cc" d="M1.974 6.659a.5.5 0 0 1-.948-.317c-.01.03 0-.001 0-.001a1.633 1.633 0 0 1 .062-.162c.04-.095.099-.226.18-.381c.165-.31.422-.723.801-1.136C2.834 3.827 4.087 3 6 3c1.913 0 3.166.827 3.931 1.662a5.479 5.479 0 0 1 .98 1.517l.046.113c.003.008.013.06.023.11L11 6.5s.084.333-.342.474a.5.5 0 0 1-.632-.314v-.003l-.006-.016a3.678 3.678 0 0 0-.172-.376a4.477 4.477 0 0 0-.654-.927C8.584 4.673 7.587 4 6 4s-2.584.673-3.194 1.338a4.477 4.477 0 0 0-.795 1.225a2.209 2.209 0 0 0-.03.078l-.007.018ZM6 5a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM5 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Z"/></svg>
              : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#212121cc" strokeLinecap="round" strokeLinejoin="round" stroke-width="2"><path d="M6.873 17.129c-1.845-1.31-3.305-3.014-4.13-4.09a1.693 1.693 0 0 1 0-2.077C4.236 9.013 7.818 5 12 5c1.876 0 3.63.807 5.13 1.874"/><path d="M14.13 9.887a3 3 0 1 0-4.243 4.242M4 20L20 4M10 18.704A7.124 7.124 0 0 0 12 19c4.182 0 7.764-4.013 9.257-5.962a1.694 1.694 0 0 0-.001-2.078A22.939 22.939 0 0 0 19.57 9"/></g></svg>
              }
            </button>
          </div>

          <div className="w-full mt-5 flex justify-center">
            <button type="submit" className='bg-gradient-to-tl from-[#A33E94] to-[#514AB1]  p-4 text-white font-bold rounded-md w-full flex justify-center disabled:bg-[#514ab1b3] transition-all duration-300'  disabled={loading}>
                {
                  loading ? <ButtonSpinner /> : "Reset Password"
                }
            </button>
          </div>
          </form>

          }

          <div className="mt-5">
            <div className={style.or}><span className='p-3 font-bold'>OR</span></div>
          </div>

          <div className="flex mt-3 justify-center md:gap-0 gap-1 md:text-lg text-[#1f3446d9] text-sm">
            <p>Remembered your password? </p>
            <Link to={"/login"} className='ml-1 font-bold text-[#514AB1]'>Login</Link>
          </div>
        </div>
      </div>
      {AlertComponent}
    </main>
  )
}
