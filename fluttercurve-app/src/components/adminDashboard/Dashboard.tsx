import { userDataStateType } from "../../rState/initialStates";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Navigation from "./Navigation";
import { useResize } from "../../hooks/resize";
import helpers from "../../helpers";
import { Link } from "react-router-dom";
import { ProfileContext } from "../../context/profile-context";
import useAlert from "../../hooks/alert";
import { Dialog } from "@headlessui/react";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { XCircleIcon } from "@heroicons/react/24/outline";
import adminAuth from "../../lib/adminAuth";
import moment from "moment";

function Dashboard({
  children,
  state,
}: {
  children: any;
  state: userDataStateType;
}) {
  const [show, setShow] = useState(false);
  const [nav, setNav] = useState(false);
  const [width] = useResize();
  const { profileDataContext } = useContext(ProfileContext);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotification] = useState<{
    count: number;
    rows: any;
  }>({} as any);
  const { AlertComponent, showAlert } = useAlert();

  const [unMarkCount, setUnMarkCount] = useState<{
    count: number;
    rows: any;
  }>({} as any);

  const [loadingMAAR, setLoadingMaar] = useState<boolean>(false);
  const [loadingCAN, setLoadingCAN] = useState<boolean>(false);

  useEffect(() => {
    adminAuth.getNotification().then(({ data }: any) => {
      setNotification(data);
    });

    // get all unviewed notifications
    adminAuth.getAllUnmarkNotification().then(({ data }: any) => {
      setUnMarkCount(data);
    });
  }, [loadingCAN, loadingMAAR]);

  //@action functions
  function clearAllNotification() {
    setLoadingCAN(true)
    adminAuth
      .deleteAllNotification()
      .then(({ data }: any) => {
        setLoadingCAN(false)
        showAlert("success", data);
      })
      .catch((err:any) => {
        setLoadingCAN(false)
        showAlert("error", err.response.data || "Something Went Wrong");
      });
  }

  function markAllNotificationAsRead() {
    setLoadingMaar(true)
    adminAuth
      .markAllAsRead()
      .then(({ data }: any) => {
        setLoadingMaar(false)
        showAlert("success", data);
      })
      .catch((err:any) => {
        setLoadingMaar(false)
        showAlert("error",  err.response.data || "Something Went Wrong");
      });
  }

  useEffect(() => {
    const body = document.querySelector("body") as HTMLBodyElement;
    if (nav) {
      body.style.cssText = "overflow-y: hidden";
    } else {
      body.style.cssText = "overflow-y: auto";
    }
  }, [nav]);

  return (
    <>
      {width < 1279 ? (
        <>
          {nav && (
            <div>
              <Navigation setNav={setNav} />
              <DropdownOverlay cb={() => setNav(false)} />
            </div>
          )}
        </>
      ) : (
        <div>
          <Navigation setNav={setNav} />
          {/* <DropdownOverlay cb={() => setNav(false)} /> */}
        </div>
      )}
      <main>
        <div className="min-h-[350px] p-5 bg-[url(/gradient.svg)] bg-[100%] bg-cover bg-no-repeat rounded-br-[2rem] rounded-bl-[2rem]">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-[#ccc] gap-3">
              <div
                className="cursor-pointer transition-all duration-500 block xl:hidden "
                onClick={() => setNav(!nav)}
              >
                {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                  >
                    <g id="evaMenu2Fill0">
                      <g id="evaMenu2Fill1">
                        <g id="evaMenu2Fill2" fill="#ccc">
                          <circle cx="4" cy="12" r="1" />
                          <rect
                            width="14"
                            height="2"
                            x="7"
                            y="11"
                            rx=".94"
                            ry=".94"
                          />
                          <rect
                            width="18"
                            height="2"
                            x="3"
                            y="16"
                            rx=".94"
                            ry=".94"
                          />
                          <rect
                            width="18"
                            height="2"
                            x="3"
                            y="6"
                            rx=".94"
                            ry=".94"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                }
              </div>
              <div className="md:flex gap-1 hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ccc"
                    d="M12 2C6.486 2 2 6.486 2 12v4.143C2 17.167 2.897 18 4 18h1a1 1 0 0 0 1-1v-5.143a1 1 0 0 0-1-1h-.908C4.648 6.987 7.978 4 12 4s7.352 2.987 7.908 6.857H19a1 1 0 0 0-1 1V18c0 1.103-.897 2-2 2h-2v-1h-4v3h6c2.206 0 4-1.794 4-4c1.103 0 2-.833 2-1.857V12c0-5.514-4.486-10-10-10z"
                  />
                </svg>
                <span>Support</span>
              </div>
              <div className="md:flex gap-1 hidden ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#ccc"
                    d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm8-7l8-5V6l-8 5l-8-5v2l8 5Z"
                  />
                </svg>
                <Link to={"mailto:info@fluttercuve.com"}>
                  support@fluttercurve.com
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 relative">
              <div className="flex group ml-4">
                <button
                  type="button"
                  className="relative -m-2.5 bg-[rgba(29,29,29,.04)] p-2 rounded-full  inline-flex items-center justify-center  text-gray-700"
                  onClick={() => setNotificationOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="w-[25px] h-[25px] rounded-full bg-[#514AB1] p-2 flex justify-center items-center absolute -top-1 left-5 font-semibold text-white">
                    {unMarkCount.count}
                  </div>
                  <HiOutlineBellAlert className="h-7 w-7 dark:stroke-white" />
                </button>
              </div>

              <div className="relative" id="show">
                <div
                  className="cursor-pointer flex gap-1"
                  onClick={() => setShow(!show)}
                >
                  <div className="relative">
                    <img
                      src={
                        (profileDataContext as unknown as string) ||
                        "/avatar-1.png"
                      }
                      className="rounded-full w-[50px]  h-[50px] border-[1px] border-gray-700 object-cover"
                      alt={state.userName}
                      width={50}
                      height={50}
                      crossOrigin="anonymous"
                    />
                    {state?.isVerified && (
                      <svg
                        className="absolute right-0 bottom-0"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill={
                            state?.isKyc === "APPROVED" ? "gold" : "skyblue"
                          }
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 0 0 1.745-.723a3.066 3.066 0 0 1 3.976 0a3.066 3.066 0 0 0 1.745.723a3.066 3.066 0 0 1 2.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 0 1 0 3.976a3.066 3.066 0 0 0-.723 1.745a3.066 3.066 0 0 1-2.812 2.812a3.066 3.066 0 0 0-1.745.723a3.066 3.066 0 0 1-3.976 0a3.066 3.066 0 0 0-1.745-.723a3.066 3.066 0 0 1-2.812-2.812a3.066 3.066 0 0 0-.723-1.745a3.066 3.066 0 0 1 0-3.976a3.066 3.066 0 0 0 .723-1.745a3.066 3.066 0 0 1 2.812-2.812Zm7.44 5.252a1 1 0 0 0-1.414-1.414L9 10.586L7.707 9.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="text-[#f3f1f1] md:block hidden">
                    <div className="font-semi-bold first-letter:capitalize">
                      {state?.userName}
                    </div>
                    <div className="text-[#59ef5e]">{state?.email}</div>
                  </div>

                  {show && (
                    <>
                      <ProfileMenu />
                      <DropdownOverlay cb={() => setShow(false)} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="">{children}</div>
        </div>

        <Dialog
          as="div"
          className="transition-transform duration-300"
          open={notificationOpen}
          onClose={setNotificationOpen}
        >
          <div className="fixed inset-0 z-30 bg-black opacity-25" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-30 w-full overflow-y-auto bg-white sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between border border-b p-4">
              <h1 className="md:text-2xl text-md  font-bold">Notification</h1>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-100"
                onClick={() => setNotificationOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XCircleIcon
                  className="h-7 w-7 text-gray-500"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="p-2 mt-5">
              {/* Notification List */}
              {!notifications.count ? (
                <div className="flex justify-center items-center h-[80vh]">
                  <div className="flex items-center flex-col">
                    <img
                      src="/no_data.svg"
                      className="leading-0"
                      alt="no data"
                    />
                    <span className="texxt-xs text-gray-400">no data</span>
                  </div>
                </div>
              ) : (
                <div className="mb-20">
                  {notifications?.rows.map(
                    (
                      {
                        type,
                        fullName,
                        userIp,
                        markAsRead,
                        depositType,
                        createdAt,
                      }: any,
                      i: number
                    ) => (
                      <div key={i.toString()}>
                        {type === "EXISTING" ? (
                          <div className="w-full border  border-gray-300 p-3 pb-1 mb-3 rounded-lg">
                            <div className="flex justify-between items-center border-b">
                              <h3
                                className={`font-semibold text-sm ${
                                  markAsRead
                                    ? "text-[#555555]"
                                    : "text-[#1b1b1b]"
                                }`}
                              >
                                Login Alert
                              </h3>
                              <small className="text-gray-500">
                                {moment(createdAt).fromNow()}
                              </small>
                            </div>
                            <p className="text-sm font-light mt-3">
                              {fullName}@{" "}
                              <i>
                                <Link to={`manage-users?q=${fullName}`}>
                                  {userIp}
                                </Link>
                                /
                              </i>
                              , just logged in.
                            </p>
                          </div>
                        ) : type === "DEPOSIT" ? (
                          <div className="w-full border border-[#e7e7e7] border-b-gray-300 p-3 mb-3 pb-1 rounded-lg">
                            <div className="flex justify-between items-center border-b">
                              <h3
                                className={`font-semibold text-sm ${
                                  markAsRead
                                    ? "text-[#60f585]"
                                    : "text-[#34c257]"
                                }`}
                              >
                                New Deposit
                              </h3>
                              <small className="text-gray-500">
                                {moment(createdAt).fromNow()}
                              </small>
                            </div>
                            <p className="text-sm font-light mt-3">
                              {fullName} just made a new{" "}
                              <b className="font-semibold">{depositType}</b>{" "}
                              deposit.
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="fixed bg-[#fff] bottom-0 flex gap-2 justify-between items-center   p-5 px-1 border-t border-[#f2f2f2]">
                <button
                  onClick={clearAllNotification}
                  disabled={!notifications.count}
                  className="border disabled:border-[#2121218a] disabled:text-[#2121218a] border-[#212121] text-[#212121c5] hover:text-[#212121] transition-all rounded-xl p-2 font-medium"
                >
                  
                  {loadingCAN ? "Clearing All..." : "Clear All Notification"}

                </button>
                <button
                  onClick={markAllNotificationAsRead}
                  disabled={!notifications.count}
                  className="border border-[#212121] disabled:border-[#2121218a] disabled:text-[#2121218a] text-[#212121c5] hover:text-[#212121] transition-all rounded-xl p-2 font-medium"
                >
                  {loadingMAAR ? "Marking All..." : "Mark All As Read"}
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </main>

      {AlertComponent}
    </>
  );
}

export function NormalMode() {
  return (
    <div className="text-[#e5ac31] flex jus gap-2 rounded-md mt-3 text-xl items-center font-bold w-fit p-4 bg-white">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 36 36"
      >
        <path
          fill="#e5ac31"
          d="M30 18a4.06 4.06 0 0 0 4-4V6H24V4.43A2.44 2.44 0 0 0 21.55 2h-7.1A2.44 2.44 0 0 0 12 4.43V6H2v8a4.06 4.06 0 0 0 4.05 4h4v-2.08h2v5.7a1 1 0 1 1-2 0v-1.56H6.06A6.06 6.06 0 0 1 2 18.49v9.45a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2v-9.45a6 6 0 0 1-4.06 1.57H28V18ZM14 4.43a.45.45 0 0 1 .45-.43h7.1a.45.45 0 0 1 .45.43V6h-8Zm12 17.19a1 1 0 1 1-2 0v-1.56H14V18h10v-2.08h2Z"
          className="clr-i-solid clr-i-solid-path-1"
        />
        <path fill="none" d="M0 0h36v36H0z" />
      </svg>
      <div>Admin Mode</div>
    </div>
  );
}

export function DropdownOverlay({ cb }: { cb: () => void }) {
  return (
    <div
      onClick={cb}
      className="fixed inset-x-0 inset-y-0 bg-[#212121a8] z-50"
    ></div>
  );
}

function ProfileMenu() {
  const { AlertComponent, showAlert } = useAlert();
  return (
    <motion.div
      initial={{ display: "none", opacity: 0 }}
      animate={{
        transition: {
          delay: 0.3,
          duration: 0.3,
        },
        display: "block",
        opacity: 1,
      }}
      className="absolute top-10 right-0 mt-2 w-[200px] min-h-[100px] rounded-lg p-2 bg-[#fcfcfc] z-[51]"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              stroke="rgba(33, 33, 33, 0.5)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2Z" />
              <path d="M4.271 18.346S6.5 15.5 12 15.5s7.73 2.846 7.73 2.846M12 12a3 3 0 1 0 0-6a3 3 0 0 0 0 6Z" />
            </g>
          </svg>
          <Link to="/office/dashboard/profile">My Profile</Link>
        </div>

        {/* <div className="flex items-center gap-2 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="rgba(33, 33, 33, 0.5)" d="M21 19v1H3v-1l2-2v-6c0-3.1 2.03-5.83 5-6.71V4a2 2 0 0 1 2-2a2 2 0 0 1 2 2v.29c2.97.88 5 3.61 5 6.71v6l2 2m-7 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"/></svg>
                    <span>Notification</span> 
                </div> */}

        <div
          className="text-[#db3939] flex items-center gap-2 p-2"
          onClick={helpers.logoutUser.bind(null, showAlert)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 20 20"
          >
            <path
              fill="#db3939"
              d="M10.24 0c3.145 0 6.057 1.395 7.988 3.744a.644.644 0 0 1-.103.92a.68.68 0 0 1-.942-.1a8.961 8.961 0 0 0-6.944-3.256c-4.915 0-8.9 3.892-8.9 8.692c0 4.8 3.985 8.692 8.9 8.692a8.962 8.962 0 0 0 7.016-3.343a.68.68 0 0 1 .94-.113a.644.644 0 0 1 .115.918C16.382 18.564 13.431 20 10.24 20C4.583 20 0 15.523 0 10S4.584 0 10.24 0Zm6.858 7.16l2.706 2.707c.262.261.267.68.012.936l-2.644 2.643a.662.662 0 0 1-.936-.01a.662.662 0 0 1-.011-.937l1.547-1.547H7.462a.662.662 0 0 1-.67-.654c0-.362.3-.655.67-.655h10.269l-1.558-1.558a.662.662 0 0 1-.011-.936a.662.662 0 0 1 .936.011Z"
            />
          </svg>
          <span className="font-semibold">Logout</span>
        </div>
      </div>
      {AlertComponent}
    </motion.div>
  );
}

export default Dashboard;
