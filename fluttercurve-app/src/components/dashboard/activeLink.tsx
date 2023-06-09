
import { ReactNode } from "react";
import { Link, useMatch } from "react-router-dom";



export default function ActiveLink(
    {children, href}: {children: ReactNode, href:string}
) {
    const match = useMatch(href)
    return (
        <Link to={href} className={`p-5 w-full  ${Boolean(match) ? "bg-slate-200 font-medium" : "hover:bg-slate-200"}`}>
            {children}
        </Link>
    )
}
