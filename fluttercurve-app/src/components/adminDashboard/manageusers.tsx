import React, { useEffect, useRef, useState } from "react";
import adminAuth from "../../lib/adminAuth";
import helpers from "../../helpers";
import { motion } from "framer-motion";
import ListData, { ManageUserLoader } from "./listData";
import useAlert from "../../hooks/alert";
import ButtonSpinner from "../utils/buttonSpinner";

export default function ManageUser() {
  const [switches, setSwitches] = useState<boolean>(false);
  const [ID, setID] = useState<string>("");

  function setSwitch(_ID: string) {
    setID(_ID);
    setSwitches(true);
  }
  function goBack() {
    setSwitches(false);
  }
  return (
    <>
      {switches ? (
        <EditUsers ID={ID} goBack={goBack} />
      ) : (
        <ListUsers setSwitch={setSwitch} />
      )}
    </>
  );
}

function EditUsers({ ID, switches, goBack }: any) {
  useEffect(() => {
    if (!ID) return;
  }, [ID]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ transition: { delay: 0.5 }, opacity: 0 }}
    >
      <div className="w-full md:p-8 p-3">
        <button
          onClick={goBack}
          className="mb-2 flex items-center gap-2 bg-gray-200 p-3 rounded-3xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:scale-110"
            width="20"
            height="20"
            viewBox="0 0 1024 1024"
          >
            <path
              fill="#212121cc"
              d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0z"
            />
          </svg>
          <span className="text-[#818181e1]">Back to lists</span>
        </button>

        <div className="">
          <h2 className="text-xl font-medium">Users</h2>
          <p className="text-gray-600">
            Upate, Suspend, Approve and Manipulate User's Account here.
          </p>
        </div>

        <ListData ID={ID} switches={switches} />
      </div>
    </motion.div>
  );
}

function ListUsers({ setSwitch }: any) {
  const [userList, setList] = useState({} as any);
  const [fakeList, setFakeList] = useState({} as any);
  let [page, setPage] = useState(1);
  const [loading, setloading] = useState(false);
  const { AlertComponent, showAlert } = useAlert();
  const [sUser, setParams] = useState("");
  const inputRef: { current: any } = useRef(null);

  const [checks, setCheckAll] = useState(false);
  const [mapIds, setMapsOnCheck] = useState({} as any); // Initialize as an empty object
  const [deleteUserData, setDeleteUserData] = useState([]);

  // loading for single deleted user
  const [singleDeletedLoader, setSingleDeletedLoader] = useState(false);
  const [multipleDeletedLoader, setMultipleDeletedLoader] = useState(false);

  //Handling checkings
  const checkAllListeners = function (ev: any) {
    const isChecked = ev.target.checked;
    setCheckAll(isChecked);

    const checkboxes = document.querySelectorAll("[data-check]");

    checkboxes.forEach((checkbox) => {
      const id: any = checkbox.getAttribute("data-check");
      setMapsOnCheck((prev: any) => ({ ...prev, [id]: isChecked }));
    });
  };

  const checkSingleListener = function (ev: any, id: string) {
    if (id) {
      setMapsOnCheck((prev: any) => {
        return { ...prev, [id]: ev.target.checked };
      });
    }
  };

  useEffect(() => {
    const selectedUserIds: any = Object.keys(mapIds).filter((id) => mapIds[id]);
    setDeleteUserData(selectedUserIds);
    if (selectedUserIds.length >= 2) {
      setCheckAll(true);
    } else {
      setCheckAll(false);
    }
  }, [mapIds, checks]);

  // @delete multiple user
  useEffect(() => {
    // go back to default
    setCheckAll(false);
    setDeleteUserData([]);
  }, [multipleDeletedLoader]);
  const deleteMultipleUsers = function () {
    if (deleteUserData.length < 2)
      return showAlert("error", "Select more than 1 user");
    setMultipleDeletedLoader(true);
    adminAuth
      .deleteMultipleUsers(deleteUserData)
      .then((res: any) => {
        // preload
        setMultipleDeletedLoader(false);
        // alert
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        setMultipleDeletedLoader(false);
        showAlert("error", err.response.data?.name.description);
      });
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  async function LoadUser() {
    setloading(true);
    try {
      const { data } = await adminAuth.getAllUser(page);
      setList(data);
      setloading(false);
    } catch (error) {
      console.log(error);
      setloading(false);
      showAlert("error", "Can't load data. NETWORK-ERR");
    }
  }

  useEffect(() => {
    setFakeList(userList);
  }, [userList]);

  useEffect(() => {
    LoadUser();
  }, [page, singleDeletedLoader, multipleDeletedLoader]);

  function debounce(func: any, delay: number) {
    let timeout: any;

    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(func, delay);
    };
  }

  function captureKeyLogs(ev: any) {
    const getValue = ev.target.value;
    debounce(function () {
      const filteredUserList = userList.data.filter((res: any) =>
        res.fullName.includes(getValue)
      );
      setFakeList((prev: any) => ({ ...prev, data: filteredUserList }));
    }, 1000)();
  }

  useEffect(() => {
    if (location.search) {
      const s: string = location?.search
        ?.replace("?", "")
        .split("=")[1]
        .replace("%20", " ");
      setParams(s);
      if (!userList?.data) return;
      const filteredUserList = userList?.data.filter((res: any) =>
        res.fullName.includes(inputRef.current.value)
      );
      setFakeList((prev: any) => ({ ...prev, data: filteredUserList }));
    }
  }, [inputRef.current, userList.data]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.2 } }}
        exit={{ transition: { delay: 0.5 }, opacity: 0 }}
        className="w-full md:p-8 p-3"
      >
        <div className="my-4">
          <h2 className="text-xl font-medium text-[#212121cc]">Users</h2>
          <p className="text-gray-600">
            A list of all the user's account including their name, title, email
            and role.
          </p>

          <div className="">
            <div className="border-[1px] border-gray-200 rounded-lg  focus-within:border-blue-500">
              <input
                ref={inputRef}
                type="text"
                placeholder="Filter by fullname only. We search only this page."
                defaultValue={sUser}
                className="outline-none p-3 bg-transparent w-full disabled:bg-slate-100"
                onChangeCapture={captureKeyLogs}
                disabled={!userList?.data}
              />
            </div>
          </div>
        </div>

        {typeof fakeList?.data === "undefined" ? (
          <ManageUserLoader />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
              exit={{ transition: { delay: 0.5 }, y: -5, opacity: 0 }}
              className="w-full overflow-y-auto rounded-2xl border-[1px] border-gray-100 mt-5"
            >
              <table className="w-full border-[#e6e4e4] border-[1px]">
                <thead className="bg-[#f3f3f3]">
                  <tr className="text-left">
                    <th className="p-3 font-medium">
                      <div className="flex gap-2">
                        <input
                          onChange={checkAllListeners}
                          checked={checks}
                          type="checkbox"
                          className="p-3"
                          name="check_all"
                          id="ck_all"
                        />
                        {checks && (
                          <button
                            onClick={deleteMultipleUsers}
                            className="border-red-600 border appearance-none rounded-lg p-1 bg-red-600 text-white"
                          >
                            {multipleDeletedLoader
                              ? "Deleting All"
                              : "Delete All"}
                          </button>
                        )}
                      </div>
                    </th>
                    <th className="p-3 font-medium">Name</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Role</th>
                  </tr>
                </thead>

                <tbody className="border-[#e6e4e4] border-[1px]">
                  {fakeList.data.map((res: any) => {
                    if(res.isAdmin) return;
                    return (
                      <motion.tr
                        key={res.id.toString()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2 } }}
                        exit={{ transition: { delay: 0.5 }, opacity: 0 }}
                      >
                        <UserRow
                          user={res}
                          mapIds={mapIds}
                          checkFn={checkSingleListener}
                          setSwitch={setSwitch}
                          showAlert={showAlert}
                          singleDeletedLoader={singleDeletedLoader}
                          setSingleDeletedLoader={setSingleDeletedLoader}
                        />
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>

            <div className="relative flex items-center justify-center  w-full  py-3">
              {loading && (
                <div className="absolute inset-0 w-full h-full bg-slate-200 opacity-60 z-10 flex justify-center">
                  <ButtonSpinner color="#333" />
                </div>
              )}
              <div className=" sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <nav
                    className="isolate inline-flex items-center space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <a
                      onClick={() => {
                        page >= userList.totalPage
                          ? setPage(--page)
                          : setPage(1);
                      }}
                      href="#"
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <div className="px-4">
                      <p className="text-sm text-gray-700 flex gap-1">
                        Showing
                        <span className="font-medium">{userList.page}</span>
                        to
                        <span className="font-medium">{userList.limit}</span>
                        of
                        <span className="font-medium">
                          {userList.totalRecords}
                        </span>
                        results
                      </p>
                    </div>

                    <a
                      href="#"
                      onClick={() => {
                        page < userList.totalPages
                          ? setPage(++page)
                          : setPage(userList.totalPages);
                      }}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
            {AlertComponent}
          </>
        )}
      </motion.div>
    </>
  );
}

const UserRow = ({
  user,
  mapIds,
  checkFn,
  setSwitch,
  showAlert,
  singleDeletedLoader,
  setSingleDeletedLoader,
}: {
  user: any;
  mapIds: any;
  checkFn: any;
  setSwitch: any;
  showAlert: any;
  singleDeletedLoader: any;
  setSingleDeletedLoader: any;
}) => {
  const [blobImg, setBlobImg] = React.useState<string | undefined>(undefined);
  const [userData, setUser] = useState<any>([]);

  React.useEffect(() => {
    const fetchBlobImg = async () => {
      try {
        const image = await helpers.reqAllUserImg(user.avatar);
        setBlobImg(image);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlobImg();
  }, [user.avatar]);

  useEffect(() => {
    adminAuth
      .getAllActiveDeposit()
      .then((res: any) => {
        setUser([...res?.data]);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, [user?.id]);

  const deleteSingleUser = function (id: string) {
    const confirmThis = confirm("Do you want to delete User with this ID " + id);
    if(!confirmThis) return;
    setSingleDeletedLoader(true);
    adminAuth
      .deleteSingleUser(id)
      .then((res: any) => {
        setSingleDeletedLoader(false);
        showAlert("success", res.data);
      })
      .catch((err: any) => {
        setSingleDeletedLoader(false);
        showAlert("error", err.response.data?.name.description);
      });
  };

  return (
    <>
      <td className="w-30">
        <div className="ml-3">
          <input
            checked={mapIds[user.uuid]}
            data-check={user.uuid}
            onChange={(ev) => checkFn(ev, user.uuid)}
            type="checkbox"
            className="p-3"
            name="check_single"
            id={`check_single_${user.uuid}`}
          />
        </div>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-4 w-fit">
          <div className="relative rounded-full w-[50px] h-[50px] overflow-hidden">
            {userData?.map(({ investmementCompleted, clientId }: any) => {
              if (clientId === user.uuid) {
                return (
                  <div className="absolute right-2 z-10 bottom-5 mr-3">
                    <div
                      className={`absolute animate-ping w-[15px] h-[15px] rounded-3xl ${
                        !investmementCompleted
                          ? `bg-emerald-300`
                          : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute top-1 left-[3px] w-[7.5px] h-[7.5px] rounded-3xl ${
                        !investmementCompleted
                          ? `bg-emerald-800`
                          : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                );
              }
            })}
            <img
              src={blobImg || "/avatar-1.png"}
              className="object-cover w-full h-full"
              alt="username"
            />
          </div>
          <div className="">
            <h3 className="font-semibold">{user.fullName}</h3>
            <h4 className="text-[#212121cc]">{user.email}</h4>
          </div>
        </div>
      </td>
      <td className="p-4">
        <div
          className={`
              border-[1px] 
              w-fit p-1 rounded-3xl
              ${
                !user.isVerified
                  ? "border-[#d1b7b7] bg-red-100 text-red-700"
                  : user.isKyc !== "APPROVED" || !user.isWalletConnect
                  ? "border-[#e2cfc5] bg-orange-100 text-orange-700"
                  : "border-[#bdddbd] bg-green-100 text-emerald-700"
              }
              `}
        >
          {!user.isVerified && "Email / "}
          {user.isKyc !== "APPROVED" && "Kyc /"}
          {!user.isWalletConnect && "Wallet"}
          {user.isVerified &&
            user.isKyc === "APPROVED" &&
            user.isWalletConnect &&
            "Verified"}
        </div>
      </td>

      <td className="p-4">
        <div className="flex justify-between w-[200px]">
          <p>{user.isAdmin ? "Admin" : "Client"}</p>
          <button
            onClick={setSwitch.bind(null, user.uuid)}
            className="appearance-none border-none text-purple-800 outline-none"
          >
            View
          </button>

          <button
            onClick={deleteSingleUser.bind(null, user.uuid)}
            className="appearance-none border-none text-red-800 font-semibold outline-none"
          >
            {singleDeletedLoader ? "Deleting User" : "Delete User"}
          </button>
        </div>
      </td>
    </>
  );
};
