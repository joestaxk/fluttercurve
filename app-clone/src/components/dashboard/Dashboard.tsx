
import auth from "@/lib/auth";
import { userDataStateType } from "@/rState/initialStates";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Navigation from "./Navigation";
import { useResize } from "@/hooks/resize";

function Dashboard({children, state}:{children: any, state: userDataStateType}) {
    const [show, setShow] = useState(false)
    const [nav, setNav]   = useState(false)
    const [imageData, setImageData] = useState("/avatar-1.png")
    const [width, height] = useResize();

    useEffect(() => {
        if(state.avatar) setImageData(`${process.env.PUBLIC_PATH}/private/users/${state.avatar}`)
    }, [state.avatar])

    console.log(width)
    return (
        <>
            {(width < 1279) ? (
                <>
                   {nav && <>
                     <Navigation nav={nav} setNav={setNav}/>
                    <DropdownOverlay cb={() => setNav(false)} />
                   </>}
                </>
            ): <>
                <Navigation nav={nav} setNav={setNav}/>
            <DropdownOverlay cb={() => setNav(false)} />
            </>}
            <main>
           <div className="min-h-[350px] p-5 bg-[url(/gradient.svg)] bg-[100%] bg-cover bg-no-repeat rounded-br-[2rem] rounded-bl-[2rem]">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-[#ccc] gap-3">
                    <div className="cursor-pointer transition-all duration-500 block xl:hidden " onClick={() => setNav(!nav)}>
                        {
                         
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><g id="evaMenu2Fill0"><g id="evaMenu2Fill1"><g id="evaMenu2Fill2" fill="#ccc"><circle cx="4" cy="12" r="1"/><rect width="14" height="2" x="7" y="11" rx=".94" ry=".94"/><rect width="18" height="2" x="3" y="16" rx=".94" ry=".94"/><rect width="18" height="2" x="3" y="6" rx=".94" ry=".94"/></g></g></g></svg>
                        }
                    </div>
                    <div className="md:flex gap-1 hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ccc" d="M12 2C6.486 2 2 6.486 2 12v4.143C2 17.167 2.897 18 4 18h1a1 1 0 0 0 1-1v-5.143a1 1 0 0 0-1-1h-.908C4.648 6.987 7.978 4 12 4s7.352 2.987 7.908 6.857H19a1 1 0 0 0-1 1V18c0 1.103-.897 2-2 2h-2v-1h-4v3h6c2.206 0 4-1.794 4-4c1.103 0 2-.833 2-1.857V12c0-5.514-4.486-10-10-10z"/></svg>
                        <span>Support</span>
                    </div>
                    <div className="md:flex gap-1 hidden ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ccc" d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm8-7l8-5V6l-8 5l-8-5v2l8 5Z"/></svg>
                        <Link href={"mailto:info@gencapitals.com"}>info@gencapitals.com</Link>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative">
                    <div className="relative" id="show">
                        <div  onClick={() => setShow(!show)} className="cursor-pointer">
                        <img
                          
                           src={imageData}
                           className="rounded-full w-[50px]  h-[50px]"
                           alt={"user"} 
                           width={50}
                           height={50}
                         />
                        {
                            state?.isVerified && <svg className="absolute right-0 bottom-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path fill="blue" fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 0 0 1.745-.723a3.066 3.066 0 0 1 3.976 0a3.066 3.066 0 0 0 1.745.723a3.066 3.066 0 0 1 2.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 0 1 0 3.976a3.066 3.066 0 0 0-.723 1.745a3.066 3.066 0 0 1-2.812 2.812a3.066 3.066 0 0 0-1.745.723a3.066 3.066 0 0 1-3.976 0a3.066 3.066 0 0 0-1.745-.723a3.066 3.066 0 0 1-2.812-2.812a3.066 3.066 0 0 0-.723-1.745a3.066 3.066 0 0 1 0-3.976a3.066 3.066 0 0 0 .723-1.745a3.066 3.066 0 0 1 2.812-2.812Zm7.44 5.252a1 1 0 0 0-1.414-1.414L9 10.586L7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z" clipRule="evenodd"/></svg>
                        }
                        </div>


                       {show && (
                        <>
                            <ProfileMenu/>
                            <DropdownOverlay cb={() => setShow(false)} />
                        </>
                       )}
                    </div>  
                    <div className="text-[#f3f1f1]">
                        <div className="font-semi-bold first-letter:capitalize">{state?.userName}</div> 
                        <div className="text-[#59ef5e]">{state?.email}</div>
                    </div>
                </div>
              </div>

              <div className="">
                {children}
              </div>
           </div>
        </main>
        </>
    )
}


export function NormalMode() {
    return (
        <div className="text-[#4d6ae9] flex jus gap-2 rounded-md mt-3 text-xl items-center font-bold w-fit p-4 bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path fill="#4d6ae9" d="M30 18a4.06 4.06 0 0 0 4-4V6H24V4.43A2.44 2.44 0 0 0 21.55 2h-7.1A2.44 2.44 0 0 0 12 4.43V6H2v8a4.06 4.06 0 0 0 4.05 4h4v-2.08h2v5.7a1 1 0 1 1-2 0v-1.56H6.06A6.06 6.06 0 0 1 2 18.49v9.45a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-9.45a6 6 0 0 1-4.06 1.57H28V18ZM14 4.43a.45.45 0 0 1 .45-.43h7.1a.45.45 0 0 1 .45.43V6h-8Zm12 17.19a1 1 0 1 1-2 0v-1.56H14V18h10v-2.08h2Z" className="clr-i-solid clr-i-solid-path-1"/><path fill="none" d="M0 0h36v36H0z"/></svg>
            <div>Normal Mode</div>
        </div>
    )
}

export function DropdownOverlay({ cb }: {cb: () => void}) {
    return (
        <div onClick={cb} className="xl:hidden fixed inset-x-0 inset-y-0 bg-[#212121cc] z-50"></div>
    )
}

function ProfileMenu() {
    const [cookies, setCookies, removeCookies] = useCookies()
    async function handleLogout() {
        try {
        const logout = await (await auth.logout(cookies["xat"]));
        removeCookies("xat", {path: "/login"})
        if(logout){
            console.log(logout)
            window.location.replace("/login")
        }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <motion.div 
         initial={{display: "none", opacity: 0}}
         animate={{
            transition: {
            delay: .3,
            duration: .3,
         },
         display: "block",
         opacity: 1
        }}

        className="absolute left-[-8rem] mt-2 w-[200px] min-h-[150px] rounded-lg p-2 bg-[#fcfcfc] z-[51]">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="rgba(33, 33, 33, 0.5)" strokeLinecap="round" strokeLinejoin="round"  strokeWidth="1.5"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2Z"/><path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z"/></g></svg>
                    <Link href="office/dashboard/profile">My Profile</Link>
                </div>

                <div className="flex items-center gap-2 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 15 15"><path fill="rgba(33, 33, 33, 0.5)" d="M2 1h5v1H2V1Zm6 7.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0Z"/><path fill="rgba(33, 33, 33, 0.5)" fillRule="evenodd" d="M0 12.5A1.5 1.5 0 0 0 1.5 14h12a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 13.5 3h-12A1.5 1.5 0 0 0 0 4.5v8ZM9.5 6a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5Z" clipRule="evenodd"/></svg>
                    <Link href="office/dashboard/profile/kyc">KYC verification</Link> 
                </div>

                <div className="flex items-center gap-2 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="rgba(33, 33, 33, 0.5)" d="M12.5 9c-1 0-1.8.4-2.4 1L6.9 8.3c.1-.3.1-.5.1-.8v-.4l2.9-1.3c.6.7 1.5 1.2 2.6 1.2C14.4 7 16 5.4 16 3.5S14.4 0 12.5 0S9 1.6 9 3.5v.4L6.1 5.2C5.5 4.5 4.6 4 3.5 4C1.6 4 0 5.6 0 7.5S1.6 11 3.5 11c1 0 1.8-.4 2.4-1L9 11.7v.8c0 1.9 1.6 3.5 3.5 3.5s3.5-1.6 3.5-3.5S14.4 9 12.5 9zm0-8C13.9 1 15 2.1 15 3.5S13.9 6 12.5 6S10 4.9 10 3.5S11.1 1 12.5 1zm-9 9C2.1 10 1 8.9 1 7.5S2.1 5 3.5 5S6 6.1 6 7.5S4.9 10 3.5 10zm9 5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5z"/></svg>
                    <span>Connect Wallet</span> 
                </div>

                {/* <div className="flex items-center gap-2 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgba(33, 33, 33, 0.5)" d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.29c2.97.88 5 3.61 5 6.71v6l2 2m-7 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"/></svg>
                    <span>Notification</span> 
                </div> */}

                <div className="text-[#db3939] flex items-center gap-2 p-2" onClick={handleLogout}>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20"><path fill="#db3939" d="M10.24 0c3.145 0 6.057 1.395 7.988 3.744a.644.644 0 0 1-.103.92a.68.68 0 0 1-.942-.1a8.961 8.961 0 0 0-6.944-3.256c-4.915 0-8.9 3.892-8.9 8.692c0 4.8 3.985 8.692 8.9 8.692a8.962 8.962 0 0 0 7.016-3.343a.68.68 0 0 1 .94-.113a.644.644 0 0 1 .115.918C16.382 18.564 13.431 20 10.24 20C4.583 20 0 15.523 0 10S4.584 0 10.24 0Zm6.858 7.16l2.706 2.707c.262.261.267.68.012.936l-2.644 2.643a.662.662 0 0 1-.936-.01a.662.662 0 0 1-.011-.937l1.547-1.547H7.462a.662.662 0 0 1-.67-.654c0-.362.3-.655.67-.655h10.269l-1.558-1.558a.662.662 0 0 1-.011-.936a.662.662 0 0 1 .936.011Z"/></svg>
                 <span className="font-semibold">Logout</span> 
                </div>


            </div>

        </motion.div>
    )
}

export default Dashboard;