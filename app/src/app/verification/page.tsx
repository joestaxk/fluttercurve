'use client'
import { Pageloader } from "@/components/utils/buttonSpinner";
import auth from "@/lib/auth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function Verification(){
  const search = useSearchParams();
  const router = useRouter();
  const [cookies, setCookie] = useCookies()


    useEffect(() => {
        if(!search.get("token")) {
          router.push('/login')
        }else {
          auth.checkVerifedUser(search.get("token") as string).then((res:any) => res.json()).then((res) => {
          if(!res.data?.accessToken) {
            router.push('/login')
          }else {
            setCookie("xat", res.data?.accessToken)
            router.push('/office/dashboard')
          }
          })
        }
    }, [])
    return (
      
    <>
      {
        !cookies['xat'] ? <Pageloader /> : 
          <main className="bg-authSkin min-h-[100vh] w-full">
            <div className="w-full flex justify-start p-[2rem]">
                <div className="w-full flex justify-between">
                    <Link href={process.env.MAIN_URL as string} className="flex gap-2 group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"/></svg>
                        <span className="md:block hidden">Go back</span>
                      </Link>
                      
                      <div className="text-[#4874ebed] md:text-2xl text-xl font-extrabold">FLUTTERCURVE<span className="text-[#4b57f57f]">.COM</span></div>

                      <div className=""></div>
                  </div>
              </div>

              <div className="w-full h-[60vh] flex justify-center items-center">
                  <div className='md:w-[400px] border-[#ccc] border-[1px] w-full min-h-auto rounded-xl md:p-8 p-4 bg-white'>
                    <div className="flex justify-center">
                        <div className="flex justify-center flex-col items-center">
                          <h1 className='text-[#33406a] text-3xl font-bold mb-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path fill="green" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0c1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263c-12.512-12.496-32.768-12.496-45.28 0z"/></svg>
                          </h1>

                          <h2 className="font-semibold text-[#212121cc]">Account has been verified successfully</h2>
                          <small>Redirecting 3s ....</small>
                        </div>
                    </div>
                  </div>
              </div>
          </main>
      }
    </>
    )
}
