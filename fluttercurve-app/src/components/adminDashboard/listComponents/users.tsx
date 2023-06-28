import { useContext, useEffect, useState } from "react";
import { CreateUserIDContext } from "../listData";
import adminAuth from "../../../lib/adminAuth";
import helpers from "../../../helpers";
import moment from "moment";

export default function Users() {
  const [data, setData] = useState<any>({});
  const [showAcct, setAcct] = useState<boolean>(false);
  const [acctBal, setAcctBal] = useState<number|undefined>(undefined);
  const context = useContext(CreateUserIDContext);
  const [blobImg, setBlobImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function getUser() {
      try {
        const { data } = await adminAuth.getUser(context.ID);
        context.updateUser(data);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, [context.ID]);

  useEffect(() => {
    setData(context.user);
    const fetchBlobImg = async () => {
      try {
        const image = await helpers.reqAllUserImg(context.user.avatar);
        setBlobImg(image);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlobImg();
  }, [context.user]);

  function getAcctBal() {
    setAcct(!showAcct)
    adminAuth.getuserAccountBalance(context.ID).then(({data}:any) => {
      setAcctBal(data.bal)
    }).catch((err:any) => {
      console.log(err)
    })
  }

  return (
    <div className="">
        <div className="border-[1px] border-gray-200 rounded-xl mt-2">
          <div className="bg-gray-100 p-3 font-medium flex justify-between">
            <span>User's Information</span>
            <div className="flex items-center">
              <div className="flex gap-2 mr-5" title="Account Balance">
                <button onClick={getAcctBal}>
                  {!showAcct ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 256 256"
                    >
                      <path
                        fill="currentColor"
                        d="M53.92 34.62a8 8 0 1 0-11.84 10.76l19.24 21.17C25 88.84 9.38 123.2 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208a127.11 127.11 0 0 0 52.07-10.83l22 24.21a8 8 0 1 0 11.84-10.76Zm47.33 75.84l41.67 45.85a32 32 0 0 1-41.67-45.85ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.16 133.16 0 0 1 25 128c4.69-8.79 19.66-33.39 47.35-49.38l18 19.75a48 48 0 0 0 63.66 70l14.73 16.2A112 112 0 0 1 128 192Zm6-95.43a8 8 0 0 1 3-15.72a48.16 48.16 0 0 1 38.77 42.64a8 8 0 0 1-7.22 8.71a6.39 6.39 0 0 1-.75 0a8 8 0 0 1-8-7.26A32.09 32.09 0 0 0 134 96.57Zm113.28 34.69c-.42.94-10.55 23.37-33.36 43.8a8 8 0 1 1-10.67-11.92a132.77 132.77 0 0 0 27.8-35.14a133.15 133.15 0 0 0-23.12-30.77C185.67 75.19 158.78 64 128 64a118.37 118.37 0 0 0-19.36 1.57A8 8 0 1 1 106 49.79A134 134 0 0 1 128 48c34.88 0 66.57 13.26 91.66 38.35c18.83 18.83 27.3 37.62 27.65 38.41a8 8 0 0 1 0 6.5Z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
                        <path d="M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6" />
                      </g>
                    </svg>
                  )}
                </button>
                <div className="font-semibold text-sm">{showAcct ? helpers.currencyFormatLong(acctBal as number, data?.currency) : "*****"}</div>
              </div>
              <div className="" title="Email Verification">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill={data?.isVerified ? "green" : "red"}
                    d="m20 8l-8 5l-8-5V6l8 5l8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
                  />
                </svg>
              </div>

              <div className="" title="Wallet Connect">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <g
                    fill="none"
                    stroke={data?.isWalletConnect ? "green" : "red"}
                    strokeWidth="1.5"
                  >
                    <path d="M19 20H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z" />
                    <path
                      fill="#212121cc"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 14a.5.5 0 1 1 0-1a.5.5 0 0 1 0 1Z"
                    />
                    <path d="M18 7V5.603a2 2 0 0 0-2.515-1.932l-11 2.933A2 2 0 0 0 3 8.537V9" />
                  </g>
                </svg>
              </div>

              <div className="" title="Kyc">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="none"
                    stroke={data?.isKyc === "APPROVED" ? "green" : "red"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.723 18.756h12.555v10.206H17.723z"
                  />
                  <path
                    fill="none"
                    stroke={data?.isKyc === "APPROVED" ? "green" : "red"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M24 43.5c4.09-.891 15.875-8.424 15.875-17.86V7.74S35.34 4.5 24 4.5S8.125 7.74 8.125 7.74v17.9C8.125 35.076 19.91 42.61 24 43.5Z"
                  />
                  <path
                    fill="none"
                    stroke={data?.isKyc === "APPROVED" ? "green" : "red"}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.01 18.756v-1.64a3.99 3.99 0 0 1 7.98 0v1.64"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 p-4">
            <div className="flex item-center  gap-3">
              <div className="">
                <img
                  src={blobImg || "/avatar-1.png"}
                  alt="user"
                  width={50}
                  height={50}
                  className="border-[1px] border-gray-200 object-cover w-[50px] h-[50px] rounded-full"
                />
              </div>
              <div className="h-full">
                <h3>{data?.fullName}</h3>
                <p className="text-gray-500">{data?.email}</p>
              </div>
            </div>

            <div className="flex gap-5 flex-wrap">
              <div className="border-[1px] border-gray-200 flex ">
                <div className="bg-gray-100 h-[60px] flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#212121cc"
                      d="M24.005 15.5a6 6 0 1 0 0 12a6 6 0 0 0 0-12Zm-3.5 6a3.5 3.5 0 1 1 7 0a3.5 3.5 0 0 1-7 0ZM37 32L26.912 42.71a4 4 0 0 1-5.824 0L11 32h.038l-.017-.02l-.021-.025A16.922 16.922 0 0 1 7 21c0-9.389 7.611-17 17-17s17 7.611 17 17a16.922 16.922 0 0 1-4 10.955l-.021.025l-.017.02H37Zm-1.943-1.619A14.433 14.433 0 0 0 38.5 21c0-8.008-6.492-14.5-14.5-14.5S9.5 12.992 9.5 21a14.43 14.43 0 0 0 3.443 9.381l.308.363l9.657 10.251a1.5 1.5 0 0 0 2.184 0l9.657-10.251l.308-.363Z"
                    />
                  </svg>
                </div>
                <div className="h-[60px] w-[80px] ml-2 p-1">
                  <h4 className="font-medium">Country</h4>
                  <p className="text-slate-600">{context.user?.country}</p>
                </div>
              </div>

              <div className="border-[1px] border-gray-200 flex min-w-auto">
                <div className="bg-gray-100 h-[60px] flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                  >
                    <g fill="#212121cc">
                      <path d="M22 12A10.002 10.002 0 0 0 12 2v2a8.003 8.003 0 0 1 7.391 4.938A8 8 0 0 1 20 12h2ZM2 10V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a8 8 0 0 0 8 8v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-5C7.373 22 2 16.627 2 10Z" />
                      <path d="M17.543 9.704A5.99 5.99 0 0 1 18 12h-1.8A4.199 4.199 0 0 0 12 7.8V6a6 6 0 0 1 5.543 3.704Z" />
                    </g>
                  </svg>
                </div>
                <div className="h-[60px] min-w-[80px] ml-2 p-1">
                  <h4 className="font-medium">Phone Number</h4>
                  <p className="text-slate-600">{data?.phoneNumber}</p>
                </div>
              </div>

              <div className="border-[1px] border-gray-200 flex min-w-auto">
                <div className="bg-gray-100 h-[60px] flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#212121cc"
                      d="M7 10a2 2 0 1 0 0 4a2 2 0 0 0 0-4Z"
                    />
                    <path
                      fill="#212121cc"
                      fillRule="evenodd"
                      d="M7 6.25a5.75 5.75 0 1 0 5.05 8.5h3.2V17c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-2.25H22a.75.75 0 0 0 .75-.75v-3A1.75 1.75 0 0 0 21 9.25h-8.95a5.749 5.749 0 0 0-5.05-3ZM2.75 12a4.25 4.25 0 0 1 8.147-1.7a.75.75 0 0 0 .687.45H21a.25.25 0 0 1 .25.25v2.25H19.5a.75.75 0 0 0-.75.75v2.25h-2V14a.75.75 0 0 0-.75-.75h-4.416a.75.75 0 0 0-.687.45A4.251 4.251 0 0 1 2.75 12Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="h-[60px] min-w-[80px] ml-2 p-1">
                  <h4 className="font-medium">Last Login</h4>
                  <p className="text-slate-600">
                    {moment(data?.updateTimestamp).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
