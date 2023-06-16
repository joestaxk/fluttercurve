import { motion } from "framer-motion";
import ActiveLink from "./activeLink";


export default function Navigation({setNav}: {setNav: (arg0:boolean) => void}) {
  return (
    <>
        <svg onClick={() => setNav(false)} className="fixed top-0 z-[51] block xl:hidden cursor-pointer right-2" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#ccc" d="M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z"/></svg>
       <motion.aside
        initial={{x: -100}}
        animate={{x: 0, transition: { duration: .3}}}
        style={{maxWidth: 'calc(100vw - 50px)'}}
        className="xl:block xxl:w-[330px] w-[300px] h-[100vh] xl:fixed absolute xl:z-0 z-[51] bg-white xl:bg-transparent top-0 left-0">
          <div className="relative px-2 py-4 w-full flex justify-center">
            <img src="/main_long.png" alt="" className="w-full h-auto object-contain" />
          </div>

          <div className="w-full flex flex-col border-r-[1px] xl:border-r-[#ccc] overflow-y-auto" style={{overflow: 'auto', height: 'calc(100vh - 60px)'}}>
            <ActiveLink href="/office/admin">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#514AB1" d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/></svg>
                  </div>
                  <div className="">Dashboard</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/admin/manage-users">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#514AB1" d="M10 12q-1.65 0-2.825-1.175T6 8q0-1.65 1.175-2.825T10 4q1.65 0 2.825 1.175T14 8q0 1.65-1.175 2.825T10 12Zm-7 8q-.425 0-.713-.288T2 19v-1.8q0-.825.425-1.55t1.175-1.1q1.275-.65 2.875-1.1T10 13h.35q.15 0 .3.05q-.2.45-.338.938T10.1 15q-.125.9-.075 1.513T10.3 18q.15.525.4 1.038t.55.962H3Zm14-2q.825 0 1.413-.588T19 16q0-.825-.588-1.413T17 14q-.825 0-1.413.588T15 16q0 .825.588 1.413T17 18Zm-1.3 1.5q-.3-.125-.563-.263T14.6 18.9l-1.075.325q-.175.05-.325-.013T12.95 19l-.6-1q-.1-.15-.062-.325t.187-.3l.825-.725q-.05-.35-.05-.65t.05-.65l-.825-.725q-.15-.125-.187-.3T12.35 14l.6-1q.1-.15.25-.212t.325-.013l1.075.325q.275-.2.538-.337t.562-.263l.225-1.1q.05-.175.175-.288t.3-.112h1.2q.175 0 .3.113t.175.287l.225 1.1q.3.125.563.275t.537.375l1.05-.375q.175-.075.338 0t.262.225l.6 1.05q.1.15.075.325t-.175.3l-.85.725q.05.3.05.625t-.05.625l.825.725q.15.125.188.3T21.65 18l-.6 1q-.1.15-.25.213t-.325.012L19.4 18.9q-.275.2-.537.338t-.563.262l-.225 1.1q-.05.175-.175.288t-.3.112h-1.2q-.175 0-.3-.112t-.175-.288l-.225-1.1Z"/></svg>
                  </div>
                  <div className="">Manage User</div>
              </div>
            </ActiveLink>
            {/* <ActiveLink href="/office/admin/manage-plans">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#514AB1" strokeWidth="2" d="M18 4V0v4ZM7 18H5h2Zm12 0H9h10ZM7 14H5h2Zm12 0H9h10ZM6 4V0v4ZM1 9h22H1Zm0 14h22V4H1v19Z"/></svg>
                  </div>
                  <div className="">Manage Plans</div>
              </div>
            </ActiveLink> */}
            <ActiveLink href="/office/admin/account-settings">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 32 32"><path fill="#514AB1" d="M15 20H9a3 3 0 0 0-3 3v2h2v-2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2h2v-2a3 3 0 0 0-3-3zm-3-1a4 4 0 1 0-4-4a4 4 0 0 0 4 4zm0-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2z"/><path fill="#514AB1" d="M28 19v9H4V8h12V6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-9Z"/><path fill="#514AB1" d="M20 19h6v2h-6zm2 4h4v2h-4zm10-13V8h-2.101a4.968 4.968 0 0 0-.732-1.753l1.49-1.49l-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 26 4.101V2h-2v2.101a4.968 4.968 0 0 0-1.753.732l-1.49-1.49l-1.414 1.414l1.49 1.49A4.968 4.968 0 0 0 20.101 8H18v2h2.101a4.968 4.968 0 0 0 .732 1.753l-1.49 1.49l1.414 1.414l1.49-1.49a4.968 4.968 0 0 0 1.753.732V16h2v-2.101a4.968 4.968 0 0 0 1.753-.732l1.49 1.49l1.414-1.414l-1.49-1.49A4.968 4.968 0 0 0 29.899 10zm-7 2a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3z"/></svg>
                  </div>
                  <div className="">Account Settings</div>
              </div>
            </ActiveLink>
            {/* <ActiveLink href="/office/admin/send-message">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#514AB1" d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/></svg>
                  </div>
                  <div className="">Send Message</div>
              </div>
            </ActiveLink> */}
            <ActiveLink href="/office/admin/general-settings">
              <div className="flex gap-2 xxl:text-xl text-lg hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#514AB1" d="m17 22l-.3-1.5q-.3-.125-.563-.263T15.6 19.9l-1.45.45l-1-1.7l1.15-1q-.05-.3-.05-.65t.05-.65l-1.15-1l1-1.7l1.45.45q.275-.2.538-.337t.562-.263L17 12h2l.3 1.5q.3.125.563.263t.537.337l1.45-.45l1 1.7l-1.15 1q.05.3.05.65t-.05.65l1.15 1l-1 1.7l-1.45-.45q-.275.2-.537.338t-.563.262L19 22h-2Zm1-3q.825 0 1.413-.588T20 17q0-.825-.588-1.413T18 15q-.825 0-1.413.588T16 17q0 .825.588 1.413T18 19ZM2 20V4h8l2 2h10v5.25q-.875-.625-1.9-.938T18 10q-2.925 0-4.963 2.038T11 17q0 .8.163 1.55t.512 1.45H2Z"/></svg>
                  </div>
                  <div className="">General Settings</div>
              </div>
            </ActiveLink>
          </div>
       </motion.aside>
    </>
  )
}




