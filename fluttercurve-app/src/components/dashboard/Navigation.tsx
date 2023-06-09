import { motion } from "framer-motion";
import ActiveLink from "./activeLink";


export default function Navigation({nav, setNav}: {nav: boolean, setNav: (arg0:boolean) => void}) {
  return (
    <>
        <svg onClick={() => setNav(false)} className="fixed top-0 z-[51] block xl:hidden cursor-pointer right-2" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#ccc" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"/></svg>
       <motion.aside
        initial={{x: -100}}
        animate={{x: 0, transition: { duration: .3}}}
        style={{maxWidth: 'calc(100vw - 50px)'}}
        className="xl:block xxl:w-[330px] w-[300px] h-[100vh] xl:fixed absolute xl:z-0 z-[51] bg-white xl:bg-transparent top-0 left-0">
          <div className="relative px-2 py-4 w-full flex justify-center">
            <img src="/main.png" alt="" className="w-[50px] h-[50px]" />
          </div>

          <div className="w-full flex flex-col border-r-[1px] xl:border-r-[#ccc] overflow-y-auto" style={{overflow: 'auto', height: 'calc(100vh - 60px)'}}>
            <ActiveLink href="/office/dashboard">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#4d6ae9" d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/></svg>
                  </div>
                  <div className="">Dashboard</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/dashboard/profile">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><g fill="#4d6ae9"><path d="M32 20a8 8 0 1 1-16 0a8 8 0 0 1 16 0Z"/><path fillRule="evenodd" d="M23.184 43.984C12.517 43.556 4 34.772 4 24C4 12.954 12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20a21.253 21.253 0 0 1-.274 0c-.181 0-.362-.006-.542-.016ZM11.166 36.62a3.028 3.028 0 0 1 2.523-4.005c7.796-.863 12.874-.785 20.632.018a2.99 2.99 0 0 1 2.498 4.002A17.942 17.942 0 0 0 42 24c0-9.941-8.059-18-18-18S6 14.059 6 24c0 4.916 1.971 9.373 5.166 12.621Z" clipRule="evenodd"/></g></svg>
                  </div>
                  <div className="">My Profile</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/dashboard/referrals">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16"><path fill="#4d6ae9" d="M14.25 2.1a1.25 1.25 0 0 0-1.17-.1L6.91 4.43a1.22 1.22 0 0 1-.46.09H2.5a1.25 1.25 0 0 0-1.25 1.25v.1H0v3h1.25V9a1.25 1.25 0 0 0 1.25 1.22L4 13.4a1.26 1.26 0 0 0 1.13.72h.63A1.25 1.25 0 0 0 7 12.87v-2.53l6.08 2.43a1.27 1.27 0 0 0 .47.09a1.29 1.29 0 0 0 .7-.22a1.25 1.25 0 0 0 .55-1V3.13a1.25 1.25 0 0 0-.55-1.03zm-8.5 3.67V9H2.5V5.77zm0 7.1h-.63l-1.23-2.65h1.86zm1.62-3.72A2.29 2.29 0 0 0 7 9V5.7a2.26 2.26 0 0 0 .37-.11l6.18-2.46v8.48zm7.46-3.03v2.5a1.25 1.25 0 0 0 0-2.5z"/></svg>
                  </div>
                  <div className="">Affiliates</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/dashboard/deposits/invest">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#4d6ae9" d="M15 3a1 1 0 0 1 1 1v2h4a1 1 0 0 1 1 1v12h2v2H1v-2h2V7a1 1 0 0 1 1-1h4V4a1 1 0 0 1 1-1h6Zm-5 5H8v11h2V8Zm6 0h-2v11h2V8Zm-2-3h-4v1h4V5Z"/></svg>

                  </div>
                  <div className="">Make Deposit</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/dashboard/deposits/">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 2048 2048"><path fill="#4d6ae9" d="M1408 512h512v512h-128V731l-576 575l-256-256l-704 705v37h1664v128H128V128h128v1445l704-703l256 256l485-486h-293V512z"/></svg>
                  </div>
                  <div className="">My Investments</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/dashboard/earnings">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><path fill="#4d6ae9" d="M3.6 22.5c-1-2-1.6-4.2-1.6-6.5C2 8.3 8.3 2 16 2v2C9.4 4 4 9.4 4 16c0 2 .5 3.8 1.4 5.5l-1.8 1zM28 16c0 6.6-5.4 12-12 12c-2.9 0-5.6-1-7.7-2.8l5.7-5.7l-1.4-1.5l-6.5 6.5c-.4.4-.4 1 0 1.4C8.7 28.5 12.3 30 16 30c7.7 0 14-6.3 14-14h-2z"/><path fill="#4d6ae9" d="M18 25c-.1 0-.3 0-.4-.1c-.3-.1-.6-.4-.6-.8l-.7-5l2-.3l.4 3.3l2.2-1.7V15c0-.3.1-.5.3-.7l3.2-3.2c.9-.9 1.5-2.2 1.5-3.5V6h-1.5c-1.3 0-2.6.5-3.5 1.5l-3.2 3.2c-.2.2-.4.3-.7.3h-5.5l-1.7 2.2l3.3.4l-.3 2l-5-.7c-.4 0-.7-.3-.8-.6s-.1-.7.1-1l3-4c.3-.2.6-.3.9-.3h5.6l3-3c1.3-1.3 3.1-2 4.9-2H26c1.1 0 2 .9 2 2v1.5c0 1.9-.7 3.6-2 4.9l-3 3V21c0 .3-.1.6-.4.8l-4 3c-.2.1-.4.2-.6.2z"/></svg>
                  </div>
                  <div className="">My Earning</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/dashboard/withdrawals">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#4d6ae9" d="M12 15c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92c0-1.12-.52-3-4-3c-2 0-2-.63-2-1s.7-1 2-1s1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3c2 0 2 .68 2 1s-.62 1-2 1z"/><path fill="#4d6ae9" d="M5 2H2v2h2v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4h2V2H5zm13 18H6V4h12z"/></svg>
                  </div>
                  <div className="">My Withdrawal</div>
              </div>
            </ActiveLink>
            <div className="border-t-[1px] border-t-[#ccc]"></div>
            <ActiveLink href="/office/dashboard/compounding/">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 14 14"><g fill="none" stroke="#4d6ae9" strokeLinecap="round" strokeLinejoin="round"><rect width="13" height="11.5" x=".5" y=".5" rx="1"/><circle cx="8.5" cy="6.25" r="1.75"/><path d="M8.5 3.25V4.5m0 3.5v1.25m3-3h-1.25m-3.5 0H5.5m5.12-2.12l-.88.88M7.26 7.49l-.88.88m4.24 0l-.88-.88M7.26 5.01l-.88-.88M3 4.5V8m-1 4v1.5m9.5-1.5v1.5"/></g></svg>
                  </div>
                  <div className="">Compounding</div>
              </div>
            </ActiveLink>
          </div>
       </motion.aside>
    </>
  )
}




