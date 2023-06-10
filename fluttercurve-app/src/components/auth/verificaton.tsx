import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Pageloader } from "../utils/buttonSpinner";
import auth from "../../lib/auth";
import { useLoaderData } from "react-router-dom";


export async function loader({request, params}:any) {
  if(!params.token) return request.redirect("/login");
  return params.token
}

export default function Verification(){
  const [cookies, setCookie] = useCookies()
  const token: any = useLoaderData();

  useEffect(() => {
      auth.checkVerifedUser(token).then((res:any) => {
        setCookie("xat", res.data?.accessToken)
        location.href = '/office/dashboard'
      }).catch(err => {
      location.href = "/login"
        console.log(err)
      })
}, [])
    return (
      
    <>
      {
        <main className="bg-authSkin min-h-[100vh] w-full">
              {!cookies['xat'] ? <Pageloader /> : <div className="w-full h-[60vh] flex justify-center items-center">
                  <div className='md:w-[400px] border-[#ccc] border-[1px] w-full min-h-auto rounded-xl md:p-8 p-4 bg-white'>
                    <div className="flex justify-center">
                        <div className="flex justify-center flex-col items-center">
                          <h1 className='text-[#33406a] text-3xl font-bold mb-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path fill="green" d="M512 0C229.232 0 0 229.232 0 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512C1024 229.232 794.784 0 512 0zm0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01zm204.336-636.352L415.935 626.944l-135.28-135.28c-12.496-12.496-32.752-12.496-45.264 0c-12.496 12.496-12.496 32.752 0 45.248l158.384 158.4c12.496 12.48 32.752 12.48 45.264 0c1.44-1.44 2.673-3.009 3.793-4.64l318.784-320.753c12.48-12.496 12.48-32.752 0-45.263c-12.512-12.496-32.768-12.496-45.28 0z"/></svg>
                          </h1>

                          <h2 className="font-semibold text-[#212121cc]">Account has been verified successfully</h2>
                          <small>Redirecting 3s ....</small>
                        </div>
                    </div>
                  </div>
              </div>}
          </main>
      }
    </>
    )
}

