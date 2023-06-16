import Dashboard from "../../../../components/adminDashboard/Dashboard";
import { Select } from "../../../../components/auth/register";

import { userDataStateType } from "../../../../rState/initialStates";
import { motion } from "framer-motion";
import { useCookies } from "react-cookie";
import withAdminDashboard from "../../../../hocs/withAdminDashboard ";
import useAlert from "../../../../hooks/alert";
import ButtonSpinner from "../../../../components/utils/buttonSpinner";
import auth from "../../../../lib/auth";
import { useContext, useState } from "react";
import { ProfileContext } from "../../../../context/profile-context";
import { MAIN_APP_URL } from "../../../../lib/requestService";
import { Link } from "react-router-dom";

function Page({state}:{state: userDataStateType}) {
  const [cookies] = useCookies();
  const {profileDataContext, updateProfileContext}: any = useContext(ProfileContext)
  const [validate, setValidate] = useState({
    passwordErr: {status: false, msg: ""},
  })
  const [loading, setLoading] = useState({
    loadingForm1: false,
    loadingForm2: false,
    loadingPics: false,
  })
  const { AlertComponent, showAlert } = useAlert();


  // HANDLE AVATAR HERE
  async function handleAvatarUpload(ev:any) {
     const fileData = ev.target.files;
     if(!fileData[0].type.startsWith("image/")) return;

     const imgBlob  = URL.createObjectURL(fileData[0]);
     // load image
     setLoading((prev) => { return {...prev, loadingPics: true}})
     // upload data to  server.
     const formData = new FormData();
      formData.append('avatar', fileData[0]);
      auth.uploadAvatar(cookies['xat'], formData).then((res:any) => {
        showAlert("success", res.data.message)
        updateProfileContext(imgBlob) as any
          setLoading((prev) => { return {...prev, loadingPics: false}})
      }).catch((err) => {
        // updateProfileContext(null)
          setLoading((prev) => { return {...prev, loadingPics: false}})
        console.log(err)
      })
  }

  const copyToClipboard = (text:string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy text to clipboard:', error);
      });
  }

  async function handlePersonalUpdate(ev:any) {
    ev.preventDefault()
    const tar = ev.target;

    const data = {
      fullName: tar.fullName.value,
      country: tar.country.value,
      email: tar.email.value,
      userName: tar.userName.value,
      phoneNumber: tar.phoneNumber.value
    }

    setLoading((prev) => { return {...prev, loadingForm1: true}})
    try {
      const res:any = await auth.updateUserInfo(cookies['xat'], data);
      showAlert("success", res.data)
    setLoading((prev) => { return {...prev, loadingForm1: false}})
    } catch (error:any) {
      setLoading((prev) => { return {...prev, loadingForm1: false}})
      showAlert("error", error.response.data.name)
      console.log(error)
    }
  }

  async function handlePasswordUpdate(ev:any) {
    ev.preventDefault();
    const tar = ev.target;
    const data = {
      oldPassword: tar.oldPassword.value,
      newPassword: tar.newPassword.value,
      confirmPassword: tar.confirmPassword.value,
    }
    
    if(data.newPassword !== data.confirmPassword) {
      // throw error
      return setValidate((prev) => {return {...prev, passwordErr: {status: true, msg: "Password don't match."}}})
    }else {
      setValidate((prev) => {return {...prev, passwordErr: {status: true, msg: ""}}})
    }

    // make backend response
    setLoading((prev) => { return {...prev, loadingForm2: true}})
    try {
      const res: any = await auth.updatePassword(cookies['xat'], {oldPassword: data.oldPassword,  newPassword: data.newPassword});
      console.log(res)
      showAlert("success", res.data)
      setLoading((prev) => { return {...prev, loadingForm2: false}})
    } catch (error:any) {
      showAlert("error", error.response.data.name)
      setLoading((prev) => { return {...prev, loadingForm2: false}})
      console.log(error.response)
    }
  }
  
  return (
    <main>
      <Dashboard state={state}>
        <div className="mt-4">
          <h1 className="text-3xl n:text-4xl text-white font-medium">My Account</h1>
            <div className="flex items-center mt-3">
              <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">Home</h2>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#e0e0e0" d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6l-6 6Z"/></svg>
              </span>
            <h2 className="text-xl n:text-2xl  text-[#ccc] font-medium">My Account</h2>
            </div>
        </div>
      </Dashboard>

      <motion.div
        initial={{ opacity: 0}}
        animate={{ opacity:1, y: -90}}
        transition={{ delay: 1.2, stiffness: ""}}
       className="flex justify-center flex-wrap w-full translate-y-[-50%] p-5">
        <div className="bg-white md:w-[65%] w-full shadow rounded-lg min-h-[150px] md:p-4 p-1 flex md:items-center flex-col md:flex-row justify-center  md:gap-0 gap-4 md:justify-between">
        <div className="flex flex-col items-center justify-center">
            <div className="w-[80px] group h-[80px] rounded-full overflow-hidden relative">
              <img src={profileDataContext || "/avatar-1.png"} className="bg-no-repeat bg-center bg-cover w-full h-full object-cover" width={50} height={50} alt={state.userName}  crossOrigin="anonymous"/>
                {loading.loadingPics && <div className="absolute inset-0 flex justify-center bg-[#00000081] w-full h-full"><ButtonSpinner /></div>}
                <label  htmlFor="avatar" className="bg-[#2121217f] transition-all duration-500 delay-200 ease-linear group-hover:bg-[#212121ce] cursor-pointer group-hover:w-full group-hover:h-full w-fit h-fit rounded-tl-lg rounded-bl-lg p-1 absolute group-hover:right-0 group-hover:bottom-0 group-hover:flex justify-center items-center">
                <input type="file" className="hidden" name="avatar" accept="image/*" onChange={handleAvatarUpload} id="avatar" />
                  <span className="text-white text-[1rem]">Edit</span>
                </label>
            </div>
            <label htmlFor="avatar" className="font-medium text-[#373737] whitespace-nowrap">Change Avatar</label>
          </div>

          

          <div className="">
            <div className="">
              <h4 className="font-bold text-[#212121]">Referral Code:</h4>
              <Link target="_blank" to={`${MAIN_APP_URL}/register?ref=${state.userName}`}  className="text-[#373737] border-b-2 border-dotted border-[#31313187] hover:border-[#31313]">{MAIN_APP_URL}/register?ref={state.userName}</Link>
              <p className="text-[#212121cc]">Paste code in Referral field</p>
              <button onClick={() => {
                copyToClipboard(`${MAIN_APP_URL}/register?ref=${state.userName}`)
                showAlert("success", "Copied link!")
                }} className="flex w-fit bg-gradient-to-tl from-[#1F3446] to-[#1B2238] p-3 mt-3 gap-2 transition hover:shadow-2xl shadow-[#212121dd] duration-200 text-white rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M15.24 2h-3.894c-1.764 0-3.162 0-4.255.148c-1.126.152-2.037.472-2.755 1.193c-.719.721-1.038 1.636-1.189 2.766C3 7.205 3 8.608 3 10.379v5.838c0 1.508.92 2.8 2.227 3.342c-.067-.91-.067-2.185-.067-3.247v-5.01c0-1.281 0-2.386.118-3.27c.127-.948.413-1.856 1.147-2.593c.734-.737 1.639-1.024 2.583-1.152c.88-.118 1.98-.118 3.257-.118h3.07c1.276 0 2.374 0 3.255.118A3.601 3.601 0 0 0 15.24 2Z"/><path d="M6.6 11.397c0-2.726 0-4.089.844-4.936c.843-.847 2.2-.847 4.916-.847h2.88c2.715 0 4.073 0 4.917.847c.843.847.843 2.21.843 4.936v4.82c0 2.726 0 4.089-.843 4.936c-.844.847-2.202.847-4.917.847h-2.88c-2.715 0-4.073 0-4.916-.847c-.844-.847-.844-2.21-.844-4.936v-4.82Z"/></g></svg>
                <span>Referral Code</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>


      <div className="flex xl:items-start xl:flex-row flex-col items-center xl:justify-center gap-5 mb-4 p-4 md:p-0">
        <div className="xl:w-[40%] n:w-[65%] md:w-[80%] w-full min-h-[300px] p-5 rounded-md border-[1px] border-[#cccc] bg-white">
          <form action="" onSubmit={handlePersonalUpdate}>
            <div className="mb-4">
              <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="fullname">Full Name</label>
              <div className="border-[1px] border-[#cccc] focus-within:border-[2px] ">
                <input type="text" id="fullname" name="fullName" title="fullName is required" defaultValue={state?.fullName} className="outline-none appearance-none w-full p-3" required/>
              </div>
            </div>
    

            <div className="flex gap-3 mb-4">
              <div className="w-1/2">
                <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="country">Your Country</label>
                <div className="border-[1px] border-[#cccc] relative focus-within:border-[2px]">
                  <Select selectedCountry={state?.country} className="p-4 w-full"/>
                </div>
              </div>

              <div className="w-1/2">
                <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="Phone">Phone Number</label>
                <div  className="border-[1px] border-[#cccc] focus-within:border-[2px  ]">
                  <input type="text" defaultValue={state?.phoneNumber} title="phoneNumber required" name="phoneNumber" id="Phone" className="outline-none appearance-none w-full p-3" required/>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="w-1/2">
                <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="email">Email Address</label>
                <div className="border-[1px] border-[#cccc] focus-within:border-[2px  ]">
                  <input type="email" id="email" defaultValue={state?.email} name="email"  className="outline-none appearance-none w-full p-3" required/>
                </div>
              </div>

              <div className="w-1/2">
                <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="Username">Username</label>
                <div className="border-[1px] border-[#cccc] focus-within:border-[2px  ]">
                  <input type="text" id="Username"  name="userName" defaultValue={state?.userName} title="username is required." className="outline-none appearance-none w-full p-3" required/>
                </div>
              </div>
            </div>

            <div className="w-full">
              <button  type="submit" className=" bg-gradient-to-tl from-[#1F3446] to-[#1B2238] transition-all duration-500 disabled:bg-[#242424cf] rounded-md flex gap-2 p-4 text-[#fff] font-bold" disabled={loading.loadingForm1}>
                {
                  loading.loadingForm1 && <ButtonSpinner />
                }
                <span className="whitespace-nowrap">Update Account</span>
              </button>
            </div>
          </form>
        </div>

        <div className="xl:w-[40%] n:w-[65%] md:w-[80%] w-full min-h-[300px] p-5 rounded-md border-[1px] border-[#cccc] bg-white">
          <p className="text-[red]">{validate.passwordErr.status ? validate.passwordErr.msg : ""}</p>
          <form action="" onSubmit={handlePasswordUpdate}>
            <div className="mb-4">
              <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="oldPass">Old Password</label>
              <div className="text-[#3e4a67] border-[1px] border-[#cccc]">
                <input type="password" id="oldPass" name="oldPassword" placeholder="**********" className="outline-none appearance-none w-full p-3" required/>
              </div>
            </div>

            <div className="flex  gap-3 md:flex-row flex-col mb-4">
              <div className="md:w-1/2 w-full">
                <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="password">New Password</label>
                <div className="text-[#3e4a67] border-[1px] border-[#cccc]">
                  <input type="password" id="password" title="Password is required" name="newPassword" className="outline-none appearance-none w-full p-3" autoComplete="off" required/>
                </div>
              </div>
                
              <div className="md:w-1/2 w-full">
                <label className="font-bold text-[#324a67] mb-1 text-[.9rem] md:text-base " htmlFor="cpass">Confirm Password</label>
                <div className="text-[#3e4a67] border-[1px] border-[#cccc]">
                  <input type="password" id="cpass" name="confirmPassword" title="Confirm Password is required"  className="outline-none appearance-none w-full p-3" autoComplete="off" required/>
                </div>
              </div>
            </div>


            <button  type="submit" className="bg-[#d20e0e] disabled:bg-[#d20e0ea8] transition-all duration-500 rounded-md flex gap-2 p-4 text-[#fff] font-bold" disabled={loading.loadingForm2}>
                {
                  loading.loadingForm2 && <ButtonSpinner />
                }
               <span className="whitespace-nowrap">Change Password</span>
              </button>
          </form>
        </div>
      </div>
      {AlertComponent}
    </main>
  )
}

const ProfileWithAuth = withAdminDashboard(Page)
export default ProfileWithAuth