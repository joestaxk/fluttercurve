"use client"
import ForgetPasswordComponent from "@/components/auth/forget-password";
import { Metadata } from "next";
import Link from "next/link";


// export const metadata: Metadata = {
//   title: 'Become a member | Fluttercurve',
// };

export default function ForgetPassword(){
    return (
      <main className="bg-authSkin min-h-[100vh] w-full">
         <div className="w-full flex justify-start p-[2rem]">
            <div className="w-full flex justify-between">
                <Link href={"/"} className="flex gap-2 group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:scale-110" width="24" height="24" viewBox="0 0 1024 1024"><path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"/></svg>
                  <span className="md:block hidden">Go back</span>
                </Link>
                
                <div className="text-[#4874ebed] md:text-2xl text-xl font-extrabold">FLUTTERCURVE<span className="text-[#4b57f57f]">.COM</span></div>

                <div className=""></div>
            </div>
          </div>

           <ForgetPasswordComponent />
      </main>
    )
}
