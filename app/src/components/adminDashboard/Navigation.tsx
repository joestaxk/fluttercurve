import ActiveLink from "@/components/dashboard/activeLink";


export default function Navigation() {
  return (
    <>
       <main className="w-[330px] pr-3 min-h-[100vh]  fixed top-0 left-0">
          <div className="w-full flex flex-col mt-[10rem] gap-4 border-r-[1px] border-r-[#ccc]">
            <ActiveLink href="/office/admin">
              <div className="flex gap-2 text-xl hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="#857ea3" d="M4 13h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zm0 8h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm10 0h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1zM13 4v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1h-6c-.55 0-1 .45-1 1z"/></svg>
                  </div>
                  <div className="">Dashboard</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/admin/account-settings">
              <div className="flex gap-2 text-xl hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48"><g fill="#857ea3"><path d="M32 20a8 8 0 1 1-16 0a8 8 0 0 1 16 0Z"/><path fill-rule="evenodd" d="M23.184 43.984C12.517 43.556 4 34.772 4 24C4 12.954 12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20a21.253 21.253 0 0 1-.274 0c-.181 0-.362-.006-.542-.016ZM11.166 36.62a3.028 3.028 0 0 1 2.523-4.005c7.796-.863 12.874-.785 20.632.018a2.99 2.99 0 0 1 2.498 4.002A17.942 17.942 0 0 0 42 24c0-9.941-8.059-18-18-18S6 14.059 6 24c0 4.916 1.971 9.373 5.166 12.621Z" clip-rule="evenodd"/></g></svg>
                  </div>
                  <div className="">Account Settings</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/admin/manage-plans">
              <div className="flex gap-2 text-xl hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16"><path fill="#857ea3" d="m8 16l-2-3h1v-2h2v2h1l-2 3zm7-15v8H1V1h14zm1-1H0v10h16V0z"/><path fill="#857ea3" d="M8 2a3 3 0 1 1 0 6h5V7h1V3h-1V2H8zM5 5a3 3 0 0 1 3-3H3v1H2v4h1v1h5a3 3 0 0 1-3-3z"/></svg>
                  </div>
                  <div className="">Manage Plans</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/admin/manage-user">
              <div className="flex gap-2 text-xl hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#857ea3" d="M21.5 9v10M5.5 9v10m-3-10v10m16-10v10M2 21h20M0 23.5h24M12 11h-1a1 1 0 0 0-1 1v.375a1 1 0 0 0 .72.96l2.56.747a1 1 0 0 1 .72.96V16a1 1 0 0 1-1 1h-1m0-6h1a1 1 0 0 1 1 1v.5M12 11V9m0 8h-1a1 1 0 0 1-1-1v-.5m2 1.5v2M23.5 6.25V7H.5v-.75C5.5 4.5 8.5 3 11.75.5h.5C15.5 3 18.5 4.5 23.5 6.25Z"/></svg>
                  </div>
                  <div className="">Manage User</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/admin/verification">
              <div className="flex gap-2 text-xl hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#857ea3" d="M21.5 9v10M5.5 9v10m-3-10v10m16-10v10M2 21h20M0 23.5h24M12 11h-1a1 1 0 0 0-1 1v.375a1 1 0 0 0 .72.96l2.56.747a1 1 0 0 1 .72.96V16a1 1 0 0 1-1 1h-1m0-6h1a1 1 0 0 1 1 1v.5M12 11V9m0 8h-1a1 1 0 0 1-1-1v-.5m2 1.5v2M23.5 6.25V7H.5v-.75C5.5 4.5 8.5 3 11.75.5h.5C15.5 3 18.5 4.5 23.5 6.25Z"/></svg>
                  </div>
                  <div className="">Data Verification</div>
              </div>
            </ActiveLink>
            <ActiveLink href="/office/admin/send-messages">
              <div className="flex gap-2 text-xl hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#857ea3" d="M21.5 9v10M5.5 9v10m-3-10v10m16-10v10M2 21h20M0 23.5h24M12 11h-1a1 1 0 0 0-1 1v.375a1 1 0 0 0 .72.96l2.56.747a1 1 0 0 1 .72.96V16a1 1 0 0 1-1 1h-1m0-6h1a1 1 0 0 1 1 1v.5M12 11V9m0 8h-1a1 1 0 0 1-1-1v-.5m2 1.5v2M23.5 6.25V7H.5v-.75C5.5 4.5 8.5 3 11.75.5h.5C15.5 3 18.5 4.5 23.5 6.25Z"/></svg>
                  </div>
                  <div className="">Send Messages</div>
              </div>
            </ActiveLink>
            <div className="border-t-[1px] border-t-[#ccc]"></div>
            <ActiveLink href="/office/admin/settings/">
              <div className="flex gap-2 text-xl hover:font-medium items-center ">
                  <div className="">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 14 14"><g fill="none" stroke="#857ea3" stroke-linecap="round" stroke-linejoin="round"><rect width="13" height="11.5" x=".5" y=".5" rx="1"/><circle cx="8.5" cy="6.25" r="1.75"/><path d="M8.5 3.25V4.5m0 3.5v1.25m3-3h-1.25m-3.5 0H5.5m5.12-2.12l-.88.88M7.26 7.49l-.88.88m4.24 0l-.88-.88M7.26 5.01l-.88-.88M3 4.5V8m-1 4v1.5m9.5-1.5v1.5"/></g></svg>
                  </div>
                  <div className="">General Settings</div>
              </div>
            </ActiveLink>
          </div>
       </main>
    </>
  )
}




