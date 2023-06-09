import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";



export default function ActiveLink(
    {children, href}: {children: ReactNode, href:string}
) {
    const [isActive, setActiveClass] = useState(false);

    useEffect(() => {
        if(typeof window === "undefined") return;
        const {pathname} = window.location;

        if(href === "/office/dashboard") {
            setActiveClass(true)
        }else {
            setActiveClass(false)
        }
        
        if(pathname.split("/dashboard")[1] && href.includes(pathname.split("/dashboard")[1])) {
            setActiveClass(true)
        }else {
            setActiveClass(false)
        }
    }, [])

    const handleActiveClass = function() {
        const {pathname} = window.location;
        setActiveClass(false)
        if(href.includes(pathname.split("/dashboard")[1])) {
            setActiveClass(true)
        }else {
            setActiveClass(false)
        }
    }

    return (
        <Link href={href} onClick={() => handleActiveClass} className={`p-5 w-full  ${isActive ? "bg-slate-200 font-medium" : "hover:bg-slate-200"}`}>
            {children}
        </Link>
    )
}