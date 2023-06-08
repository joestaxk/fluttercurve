import { Metadata } from "next";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export const metadata: Metadata = {
  title: 'Become a member | Fluttercurve',
};

export default function Verification(){
    return (
    <>
        <main className="bg-authSkin min-h-[100vh] w-full">
          <div className="w-full flex justify-start p-[2rem]">
             <div className="w-1/2 flex justify-between">
                 <Link href={"/"}>Go back</Link>
                  <div className="text-blue-700">Flutter <span className="text-pink-900 font-bold">CURVE</span></div>
              </div>
           </div>

           <div className="">
            Account has been cre
           </div>
      </main>
    </>
    )
}