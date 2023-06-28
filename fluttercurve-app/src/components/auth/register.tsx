import { useEffect, useRef, useState } from "react";
import style from "./auth.module.css";
import ButtonSpinner from "../utils/buttonSpinner";
import { useCookies } from "react-cookie";
import instance from "../../lib/requestService";
import { Link, useParams } from "react-router-dom";
import useAlert from "../../hooks/alert";

export default function Register() {
  const router = useParams()
  const [msgDesc, setMsgDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [, setCookie] = useCookies([] as any);
  const [validation, setValidation] = useState({
    agree: { status: false, msg: "Please Agree to our Terms!" },
    cpassword: { status: false, msg: "Please Confirm password!" },
    fullname: { status: false, msg: "Enter your fullname ex. john doe" },
  });
  const {AlertComponent, showAlert} = useAlert()

  const [viewPwd, setViewPwd] = useState({
    cpass: false,
    pass: false,
  });
  const [currency, setcurrency] = useState([]);

  useEffect(() => {
      instance.get("/service/getCurrencies").then((res) => {
         setcurrency(res.data)
      }).catch((err:any) => {
          showAlert('error', err.response.data)
      })
  }, [])

  async function handleRegister(ev: any) {
    ev.preventDefault();
    const targ = ev.target;

    const data = {
      fullName: targ.fullname.value,
      userName: targ.username.value,
      email: targ.email.value,
      phoneNumber: targ.phone.value,
      annualIncome: targ.annual.value,
      currency: targ.currency.value,
      country: targ.country.value,
      referral: targ.referral.value,
      password: targ.password.value,
      cpassword: targ.cpassword.value,
      agree: targ.agree.checked,
    };

    if (!/[a-z]\s+([a-z])/i.test(data.fullName)) {
      setMsgDesc(validation.fullname.msg);
      setValidation({
        ...validation,
        fullname: { ...validation.fullname, status: true },
      });
      setErr(true);
      return;
    } else if (data.password !== data.cpassword) {
      setValidation({
        ...validation,
        cpassword: { ...validation.cpassword, status: true },
      });
      setErr(true);
      setMsgDesc(validation.cpassword.msg);
      return;
    } else if (!data.agree) {
      setMsgDesc(validation.agree.msg);
      setValidation({
        ...validation,
        agree: { ...validation.agree, status: true },
      });
      setErr(true);
      return;
    } else {
      setMsgDesc("");
      setErr(false);
      setValidation({
        agree: { ...validation.agree, status: false },
        cpassword: { ...validation.cpassword, status: false },
        fullname: { ...validation.fullname, status: false },
      });
    }

    // pass successful.
    delete data.agree;
    delete data.cpassword;

    //  set loading
    setLoading(true);
    try {
      const res = await instance.post("/client/auth/register", data);
      setErr(false);
      setMsgDesc(res.data.message);
      showAlert("success", res.data.message)
      setCookie("xat", res.data.data.accessToken, { path: "/" });
      // Do some pop-up modal for redirecting
      setTimeout(() => {
        location.reload();
      }, 1500);
    } catch (error: any) {
      setLoading(false);
      if (error.response.data.description) {
        setErr(true);
        setMsgDesc(error.response.data.description);
      }else{
        showAlert("error", error.response.data.message)
      }
    }
  }
  return (
    <main className="w-full h-full flex justify-center p-3">
      <div className="md:w-[600px] w-full min-h-auto rounded-xl md:p-8 p-4 bg-white">
        <div className="">
          <div className="">
            <h1 className="text-[#514AB1] text-3xl font-bold mb-1">
              Get Started
            </h1>
            <p className="xxl:text-xl md:text-lg text-sm text-[#1f3446d9]">
              Open account for free and start investing now!
            </p>
          </div>
          <form method="POST" onSubmit={handleRegister} className="mt-10">
            <p className={`${err ? "text-[red]" : "text-[green]"}  my-2`}>
              {msgDesc}
            </p>
            <div
              className={`bg-[#f4f4f4] md:text-lg text-sm rounded-md transition-all duration-300 ${
                validation.fullname.status ? "border-[1px] border-[red]" : ""
              }`}
            >
              <input
                className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none lowercase"
                name="fullname"
                type="text"
                placeholder="Your Fullname *"
                required
              />
            </div>

            <div className="bg-[#f4f4f4] rounded-md mt-3 md:text-lg text-sm">
              <input
                className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none lowercase"
                name="username"
                pattern="[a-zA-Z]*(\d|[a-zA-Z]){4,8}$"
                title="4 to 8 lowercase letters"
                type="text"
                placeholder="Your Username *"
                required
              />
            </div>

            <div className="w-full flex gap-2 mt-3 md:text-lg text-sm">
              <div className="w-1/2 bg-[#f4f4f4] rounded-md">
                <input
                  className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none"
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                />
              </div>

              <div className="w-1/2 bg-[#f4f4f4] rounded-md md:text-lg text-sm">
                <input
                  className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none"
                  type="tel"
                  name="phone"
                  pattern="[0-9]{10,}"
                  title="Enter phone number. 10 digit long"
                  placeholder="Phone Number *"
                  required
                />
              </div>
            </div>

            <div className="border-[1px] border-[#ccc] my-3">
              <Select className="w-full md:text-lg text-sm" />
            </div>

            <div className="flex my-3 items-center gap-2">
              <div className="border-[1px] border-[#ccc]">
                <select
                  className="w-full p-3 bg-transparent md:text-lg text-sm"
                  name="currency"
                  required
                >
                  {
                    currency.length ? 
                     currency.map(({id, currency}:any) => (
                        <option key={id} value={currency}>{currency}</option>
                     )) : <option value=''>Currency Loading...</option>
                  }

                </select>
              </div>

              <div className="bg-[#f4f4f4] rounded-md w-full md:text-lg text-sm">
                <input
                  className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none"
                  min={1}
                  title="Your Annual Income can't be zero"
                  name="annual"
                  type="number"
                  placeholder="Annual Income *"
                  required
                />
              </div>
            </div>

            <div className="bg-[#f4f4f4] rounded-md mt-3 w-full md:text-lg text-sm">
              <input
                className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none"
                defaultValue={router.ref as string}
                name="referral"
                type="text"
                autoComplete="off"
                placeholder="Referral Username (Optional)"
              />
            </div>

            {/* PASSWORDS */}
            <div className="w-full flex gap-2 mt-3 md:text-lg text-sm ">
              <div className="w-1/2 bg-[#f4f4f4] rounded-md relative">
                <input
                  className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none"
                  type={viewPwd.pass ? "text" : "password"}
                  name="password"
                  placeholder="Password *"
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setViewPwd((PREV) => {
                      return { ...PREV, pass: !viewPwd.pass };
                    })
                  }
                  className="appearance-none border-none absolute right-2 top-3"
                >
                  {!viewPwd.pass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 12 12"
                    >
                      <path
                        fill="#212121cc"
                        d="M1.974 6.659a.5.5 0 0 1-.948-.317c-.01.03 0-.001 0-.001a1.633 1.633 0 0 1 .062-.162c.04-.095.099-.226.18-.381c.165-.31.422-.723.801-1.136C2.834 3.827 4.087 3 6 3c1.913 0 3.166.827 3.931 1.662a5.479 5.479 0 0 1 .98 1.517l.046.113c.003.008.013.06.023.11L11 6.5s.084.333-.342.474a.5.5 0 0 1-.632-.314v-.003l-.006-.016a3.678 3.678 0 0 0-.172-.376a4.477 4.477 0 0 0-.654-.927C8.584 4.673 7.587 4 6 4s-2.584.673-3.194 1.338a4.477 4.477 0 0 0-.795 1.225a2.209 2.209 0 0 0-.03.078l-.007.018ZM6 5a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM5 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Z"
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
                        stroke="#212121cc"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M6.873 17.129c-1.845-1.31-3.305-3.014-4.13-4.09a1.693 1.693 0 0 1 0-2.077C4.236 9.013 7.818 5 12 5c1.876 0 3.63.807 5.13 1.874" />
                        <path d="M14.13 9.887a3 3 0 1 0-4.243 4.242M4 20L20 4M10 18.704A7.124 7.124 0 0 0 12 19c4.182 0 7.764-4.013 9.257-5.962a1.694 1.694 0 0 0-.001-2.078A22.939 22.939 0 0 0 19.57 9" />
                      </g>
                    </svg>
                  )}
                </button>
              </div>

              <div
                className={`w-1/2 bg-[#f4f4f4] relative rounded-md transition-all duration-300 ${
                  validation.cpassword.status
                    ? "border-[1px] border-[red]"
                    : "border-none"
                }`}
              >
                <input
                  className="bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none"
                  type={viewPwd.cpass ? "text" : "password"}
                  name="cpassword"
                  placeholder="Confirm Password *"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setViewPwd((PREV) => {
                      return { ...PREV, cpass: !viewPwd.cpass };
                    })
                  }
                  className="appearance-none border-none absolute right-2 top-3"
                >
                  {!viewPwd.cpass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 12 12"
                    >
                      <path
                        fill="#212121cc"
                        d="M1.974 6.659a.5.5 0 0 1-.948-.317c-.01.03 0-.001 0-.001a1.633 1.633 0 0 1 .062-.162c.04-.095.099-.226.18-.381c.165-.31.422-.723.801-1.136C2.834 3.827 4.087 3 6 3c1.913 0 3.166.827 3.931 1.662a5.479 5.479 0 0 1 .98 1.517l.046.113c.003.008.013.06.023.11L11 6.5s.084.333-.342.474a.5.5 0 0 1-.632-.314v-.003l-.006-.016a3.678 3.678 0 0 0-.172-.376a4.477 4.477 0 0 0-.654-.927C8.584 4.673 7.587 4 6 4s-2.584.673-3.194 1.338a4.477 4.477 0 0 0-.795 1.225a2.209 2.209 0 0 0-.03.078l-.007.018ZM6 5a2 2 0 1 0 0 4a2 2 0 0 0 0-4ZM5 7a1 1 0 1 1 2 0a1 1 0 0 1-2 0Z"
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
                        stroke="#212121cc"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      >
                        <path d="M6.873 17.129c-1.845-1.31-3.305-3.014-4.13-4.09a1.693 1.693 0 0 1 0-2.077C4.236 9.013 7.818 5 12 5c1.876 0 3.63.807 5.13 1.874" />
                        <path d="M14.13 9.887a3 3 0 1 0-4.243 4.242M4 20L20 4M10 18.704A7.124 7.124 0 0 0 12 19c4.182 0 7.764-4.013 9.257-5.962a1.694 1.694 0 0 0-.001-2.078A22.939 22.939 0 0 0 19.57 9" />
                      </g>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="w-full flex justify-center mt-3 md:text-lg text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="radio"
                  className="mr-3"
                  name="agree"
                />
                <label
                  htmlFor="radio"
                  className={`font-bold text-[#1f3446d9] transition-all duration-300 ${
                    validation.agree.status
                      ? "border-b-[2px] border-dotted border-[red]"
                      : ""
                  }`}
                >
                  I agree to the Terms & Conditions of service.
                </label>
              </div>
            </div>
            <div className="w-full mt-4 flex justify-center">
              <button
                type="submit"
                className="bg-gradient-to-tl from-[#A33E94] to-[#514AB1] h-[50px] disabled:opacity-50  w-full flex justify-center items-center shadow-md text-white font-bold rounded-md"
                value="create account"
                disabled={loading}
              >
                {loading ? <ButtonSpinner /> : "create account"}
              </button>
            </div>
          </form>

          <div className="mt-4">
            <div className={style.or}>
              <span className="p-3 font-bold text-[#242424cc]">Or</span>
            </div>
          </div>

          <div className="flex md:gap-0 gap-1 mt-3 text-[#1f3446d9] justify-center md:text-lg text-sm">
            <p>Already have an account?</p>
            <Link
              to={"/login"}
              className="ml-1 font-bold text-[#514AB1]"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
      {AlertComponent}
    </main>
  );
}

export function Select({ className, selectedCountry}: { className: string, selectedCountry?: string }) {
  const refSelect:{current: any} = useRef(null);
  useEffect(() => {
    if(typeof refSelect.current === undefined) return;

    const selectOptions = refSelect.current.querySelectorAll("option");
    selectOptions.forEach((el:HTMLOptionElement) => el.value === selectedCountry ? el.setAttribute("selected", "true") : "")
  }, [refSelect.current])
  return (
    <select
      ref={refSelect}
      className={`${className} p-4 bg-transparent w-full`}
      name="country"
      autoComplete="yes"
      required
    >
      <option defaultValue="">{"Selected a country..."}</option>
      <option defaultValue="AF">Afghanistan (AF)</option>
      <option defaultValue="AL">Albania (AL)</option>
      <option defaultValue="DZ">Algeria (DZ)</option>
      <option defaultValue="AS">American Samoa (AS)</option>
      <option defaultValue="AD">Andorra (AD)</option>
      <option defaultValue="AO">Angola (AO)</option>
      <option defaultValue="AI">Anguilla (AI)</option>
      <option defaultValue="AQ">Antarctica (AQ)</option>
      <option defaultValue="AG">Antigua and Barbuda (AG)</option>
      <option defaultValue="AR">Argentina (AR)</option>
      <option defaultValue="AM">Armenia (AM)</option>
      <option defaultValue="AW">Aruba (AW)</option>
      <option defaultValue="AU">Australia (AU)</option>
      <option defaultValue="AT">Austria (AT)</option>
      <option defaultValue="AZ">Azerbaijan (AZ)</option>
      <option defaultValue="BS">Bahamas (BS)</option>
      <option defaultValue="BH">Bahrain (BH)</option>
      <option defaultValue="BD">Bangladesh (BD)</option>
      <option defaultValue="BB">Barbados (BB)</option>
      <option defaultValue="BY">Belarus (BY)</option>
      <option defaultValue="BE">Belgium (BE)</option>
      <option defaultValue="BZ">Belize (BZ)</option>
      <option defaultValue="BJ">Benin (BJ)</option>
      <option defaultValue="BM">Bermuda (BM)</option>
      <option defaultValue="BT">Bhutan (BT)</option>
      <option defaultValue="BO">Bolivia (BO)</option>
      <option defaultValue="BA">Bosnia and Herzegovina (BA)</option>
      <option defaultValue="BW">Botswana (BW)</option>
      <option defaultValue="BV">Bouvet Island (BV)</option>
      <option defaultValue="BR">Brazil (BR)</option>
      <option defaultValue="IO">British Indian Ocean Territory (IO)</option>
      <option defaultValue="BN">Brunei Darussalam (BN)</option>
      <option defaultValue="BG">Bulgaria (BG)</option>
      <option defaultValue="BF">Burkina Faso (BF)</option>
      <option defaultValue="BI">Burundi (BI)</option>
      <option defaultValue="KH">Cambodia (KH)</option>
      <option defaultValue="CM">Cameroon (CM)</option>
      <option defaultValue="CA">Canada (CA)</option>
      <option defaultValue="CV">Cape Verde (CV)</option>
      <option defaultValue="KY">Cayman Islands (KY)</option>
      <option defaultValue="CF">Central African Republic (CF)</option>
      <option defaultValue="TD">Chad (TD)</option>
      <option defaultValue="CL">Chile (CL)</option>
      <option defaultValue="CN">China (CN)</option>
      <option defaultValue="CX">Christmas Island (CX)</option>
      <option defaultValue="CC">Cocos (Keeling) Islands (CC)</option>
      <option defaultValue="CO">Colombia (CO)</option>
      <option defaultValue="KM">Comoros (KM)</option>
      <option defaultValue="CG">Congo (CG)</option>
      <option defaultValue="CD">Congo, the Democratic Republic of the (CD)</option>
      <option defaultValue="CK">Cook Islands (CK)</option>
      <option defaultValue="CR">Costa Rica (CR)</option>
      <option defaultValue="CI">Cote D'Ivoire (CI)</option>
      <option defaultValue="HR">Croatia (HR)</option>
      <option defaultValue="CU">Cuba (CU)</option>
      <option defaultValue="CY">Cyprus (CY)</option>
      <option defaultValue="CZ">Czech Republic (CZ)</option>
      <option defaultValue="DK">Denmark (DK)</option>
      <option defaultValue="DJ">Djibouti (DJ)</option>
      <option defaultValue="DM">Dominica (DM)</option>
      <option defaultValue="DO">Dominican Republic (DO)</option>
      <option defaultValue="EC">Ecuador (EC)</option>
      <option defaultValue="EG">Egypt (EG)</option>
      <option defaultValue="SV">El Salvador (SV)</option>
      <option defaultValue="GQ">Equatorial Guinea (GQ)</option>
      <option defaultValue="ER">Eritrea (ER)</option>
      <option defaultValue="EE">Estonia (EE)</option>
      <option defaultValue="ET">Ethiopia (ET)</option>
      <option defaultValue="FK">Falkland Islands (Malvinas) (FK)</option>
      <option defaultValue="FO">Faroe Islands (FO)</option>
      <option defaultValue="FJ">Fiji (FJ)</option>
      <option defaultValue="FI">Finland (FI)</option>
      <option defaultValue="FR">France (FR)</option>
      <option defaultValue="GF">French Guiana (GF)</option>
      <option defaultValue="PF">French Polynesia (PF)</option>
      <option defaultValue="TF">French Southern Territories (TF)</option>
      <option defaultValue="GA">Gabon (GA)</option>
      <option defaultValue="GM">Gambia (GM)</option>
      <option defaultValue="GE">Georgia (GE)</option>
      <option defaultValue="DE">Germany (DE)</option>
      <option defaultValue="GH">Ghana (GH)</option>
      <option defaultValue="GI">Gibraltar (GI)</option>
      <option defaultValue="GR">Greece (GR)</option>
      <option defaultValue="GL">Greenland (GL)</option>
      <option defaultValue="GD">Grenada (GD)</option>
      <option defaultValue="GP">Guadeloupe (GP)</option>
      <option defaultValue="GU">Guam (GU)</option>
      <option defaultValue="GT">Guatemala (GT)</option>
      <option defaultValue="GN">Guinea (GN)</option>
      <option defaultValue="GW">Guinea-Bissau (GW)</option>
      <option defaultValue="GY">Guyana (GY)</option>
      <option defaultValue="HT">Haiti (HT)</option>
      <option defaultValue="HM">Heard Island and Mcdonald Islands (HM)</option>
      <option defaultValue="VA">Holy See (Vatican City State) (VA)</option>
      <option defaultValue="HN">Honduras (HN)</option>
      <option defaultValue="HK">Hong Kong (HK)</option>
      <option defaultValue="HU">Hungary (HU)</option>
      <option defaultValue="IS">Iceland (IS)</option>
      <option defaultValue="IN">India (IN)</option>
      <option defaultValue="ID">Indonesia (ID)</option>
      <option defaultValue="IR">Iran, Islamic Republic of (IR)</option>
      <option defaultValue="IQ">Iraq (IQ)</option>
      <option defaultValue="IE">Ireland (IE)</option>
      <option defaultValue="IL">Israel (IL)</option>
      <option defaultValue="IT">Italy (IT)</option>
      <option defaultValue="JM">Jamaica (JM)</option>
      <option defaultValue="JP">Japan (JP)</option>
      <option defaultValue="JO">Jordan (JO)</option>
      <option defaultValue="KZ">Kazakhstan (KZ)</option>
      <option defaultValue="KE">Kenya (KE)</option>
      <option defaultValue="KI">Kiribati (KI)</option>
      <option defaultValue="KP">
        Korea, Democratic People&apos;s Republic of (KP)
      </option>
      <option defaultValue="KR">Korea, Republic of (KR)</option>
      <option defaultValue="KW">Kuwait (KW)</option>
      <option defaultValue="KG">Kyrgyzstan (KG)</option>
      <option defaultValue="LA">Lao People&apos;s Democratic Republic (LA)</option>
      <option defaultValue="LV">Latvia (LV)</option>
      <option defaultValue="LB">Lebanon (LB)</option>
      <option defaultValue="LS">Lesotho (LS)</option>
      <option defaultValue="LR">Liberia (LR)</option>
      <option defaultValue="LY">Libyan Arab Jamahiriya (LY)</option>
      <option defaultValue="LI">Liechtenstein (LI)</option>
      <option defaultValue="LT">Lithuania (LT)</option>
      <option defaultValue="LU">Luxembourg (LU)</option>
      <option defaultValue="MO">Macao (MO)</option>
      <option defaultValue="MK">
        Macedonia, the Former Yugoslav Republic of (MK)
      </option>
      <option defaultValue="MG">Madagascar (MG)</option>
      <option defaultValue="MW">Malawi (MW)</option>
      <option defaultValue="MY">Malaysia (MY)</option>
      <option defaultValue="MV">Maldives (MV)</option>
      <option defaultValue="ML">Mali (ML)</option>
      <option defaultValue="MT">Malta (MT)</option>
      <option defaultValue="MH">Marshall Islands (MH)</option>
      <option defaultValue="MQ">Martinique (MQ)</option>
      <option defaultValue="MR">Mauritania (MR)</option>
      <option defaultValue="MU">Mauritius (MU)</option>
      <option defaultValue="YT">Mayotte (YT)</option>
      <option defaultValue="MX">Mexico (MX)</option>
      <option defaultValue="FM">Micronesia, Federated States of (FM)</option>
      <option defaultValue="MD">Moldova, Republic of (MD)</option>
      <option defaultValue="MC">Monaco (MC)</option>
      <option defaultValue="MN">Mongolia (MN)</option>
      <option defaultValue="MS">Montserrat (MS)</option>
      <option defaultValue="MA">Morocco (MA)</option>
      <option defaultValue="MZ">Mozambique (MZ)</option>
      <option defaultValue="MM">Myanmar (MM)</option>
      <option defaultValue="NA">Namibia (NA)</option>
      <option defaultValue="NR">Nauru (NR)</option>
      <option defaultValue="NP">Nepal (NP)</option>
      <option defaultValue="NL">Netherlands (NL)</option>
      <option defaultValue="AN">Netherlands Antilles (AN)</option>
      <option defaultValue="NC">New Caledonia (NC)</option>
      <option defaultValue="NZ">New Zealand (NZ)</option>
      <option defaultValue="NI">Nicaragua (NI)</option>
      <option defaultValue="NE">Niger (NE)</option>
      <option defaultValue="NG">Nigeria (NG)</option>
      <option defaultValue="NU">Niue (NU)</option>
      <option defaultValue="NF">Norfolk Island (NF)</option>
      <option defaultValue="MP">Northern Mariana Islands (MP)</option>
      <option defaultValue="NO">Norway (NO)</option>
      <option defaultValue="OM">Oman (OM)</option>
      <option defaultValue="PK">Pakistan (PK)</option>
      <option defaultValue="PW">Palau (PW)</option>
      <option defaultValue="PS">Palestinian Territory, Occupied (PS)</option>
      <option defaultValue="PA">Panama (PA)</option>
      <option defaultValue="PG">Papua New Guinea (PG)</option>
      <option defaultValue="PY">Paraguay (PY)</option>
      <option defaultValue="PE">Peru (PE)</option>
      <option defaultValue="PH">Philippines (PH)</option>
      <option defaultValue="PN">Pitcairn (PN)</option>
      <option defaultValue="PL">Poland (PL)</option>
      <option defaultValue="PT">Portugal (PT)</option>
      <option defaultValue="PR">Puerto Rico (PR)</option>
      <option defaultValue="QA">Qatar (QA)</option>
      <option defaultValue="RE">Reunion (RE)</option>
      <option defaultValue="RO">Romania (RO)</option>
      <option defaultValue="RU">Russian Federation (RU)</option>
      <option defaultValue="RW">Rwanda (RW)</option>
      <option defaultValue="SH">Saint Helena (SH)</option>
      <option defaultValue="KN">Saint Kitts and Nevis (KN)</option>
      <option defaultValue="LC">Saint Lucia (LC)</option>
      <option defaultValue="PM">Saint Pierre and Miquelon (PM)</option>
      <option defaultValue="VC">Saint Vincent and the Grenadines (VC)</option>
      <option defaultValue="WS">Samoa (WS)</option>
      <option defaultValue="SM">San Marino (SM)</option>
      <option defaultValue="ST">Sao Tome and Principe (ST)</option>
      <option defaultValue="SA">Saudi Arabia (SA)</option>
      <option defaultValue="SN">Senegal (SN)</option>
      <option defaultValue="CS">Serbia and Montenegro (CS)</option>
      <option defaultValue="SC">Seychelles (SC)</option>
      <option defaultValue="SL">Sierra Leone (SL)</option>
      <option defaultValue="SG">Singapore (SG)</option>
      <option defaultValue="SK">Slovakia (SK)</option>
      <option defaultValue="SI">Slovenia (SI)</option>
      <option defaultValue="SB">Solomon Islands (SB)</option>
      <option defaultValue="SO">Somalia (SO)</option>
      <option defaultValue="ZA">South Africa (ZA)</option>
      <option defaultValue="GS">
        South Georgia and the South Sandwich Islands (GS)
      </option>
      <option defaultValue="ES">Spain (ES)</option>
      <option defaultValue="LK">Sri Lanka (LK)</option>
      <option defaultValue="SD">Sudan (SD)</option>
      <option defaultValue="SR">Suriname (SR)</option>
      <option defaultValue="SJ">Svalbard and Jan Mayen (SJ)</option>
      <option defaultValue="SZ">Swaziland (SZ)</option>
      <option defaultValue="SE">Sweden (SE)</option>
      <option defaultValue="CH">Switzerland (CH)</option>
      <option defaultValue="SY">Syrian Arab Republic (SY)</option>
      <option defaultValue="TW">Taiwan, Province of China (TW)</option>
      <option defaultValue="TJ">Tajikistan (TJ)</option>
      <option defaultValue="TZ">Tanzania, United Republic of (TZ)</option>
      <option defaultValue="TH">Thailand (TH)</option>
      <option defaultValue="TL">Timor-Leste (TL)</option>
      <option defaultValue="TG">Togo (TG)</option>
      <option defaultValue="TK">Tokelau (TK)</option>
      <option defaultValue="TO">Tonga (TO)</option>
      <option defaultValue="TT">Trinidad and Tobago (TT)</option>
      <option defaultValue="TN">Tunisia (TN)</option>
      <option defaultValue="TR">Turkey (TR)</option>
      <option defaultValue="TM">Turkmenistan (TM)</option>
      <option defaultValue="TC">Turks and Caicos Islands (TC)</option>
      <option defaultValue="TV">Tuvalu (TV)</option>
      <option defaultValue="UG">Uganda (UG)</option>
      <option defaultValue="UA">Ukraine (UA)</option>
      <option defaultValue="AE">United Arab Emirates (AE)</option>
      <option defaultValue="GB">United Kingdom (GB)</option>
      <option defaultValue="US">United States (US)</option>
      <option defaultValue="UM">United States Minor Outlying Islands (UM)</option>
      <option defaultValue="UY">Uruguay (UY)</option>
      <option defaultValue="UZ">Uzbekistan (UZ)</option>
      <option defaultValue="VU">Vanuatu (VU)</option>
      <option defaultValue="VE">Venezuela (VE)</option>
      <option defaultValue="VN">Viet Nam (VN)</option>
      <option defaultValue="VG">Virgin Islands, British (VG)</option>
      <option defaultValue="VI">Virgin Islands, U.s. (VI)</option>
      <option defaultValue="WF">Wallis and Futuna (WF)</option>
      <option defaultValue="EH">Western Sahara (EH)</option>
      <option defaultValue="YE">Yemen (YE)</option>
      <option defaultValue="ZM">Zambia (ZM)</option>
      <option defaultValue="ZW">Zimbabwe (ZW)</option>
    </select>
  );
}
