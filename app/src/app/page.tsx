"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function Page() {
  const navigate = useRouter();
  useEffect(() => {
    navigate.push("/login")
  }, [])
  return (<>
   <h1 className="text-center">Redirecting...</h1>
  </>)
}