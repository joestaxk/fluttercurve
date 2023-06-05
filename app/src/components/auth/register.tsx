"use client";
import React, { useState } from 'react'
import style from "./auth.module.css"
import Link from 'next/link'
import {useSearchParams} from 'next/navigation';
import reqService from '@/lib/requestService'
import instance from '@/lib/requestService';
import Buttonloader from '../utils/btnChartLoader';
import ButtonSpinner from '../utils/buttonSpinner';
import { useCookies } from 'react-cookie';

export default function RegisterComponent() {
  const router = useSearchParams();
  const [msgDesc, setMsgDesc] = useState("");
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(false);
  const [cookies, setCookie] = useCookies([] as any);
  const [validation, setValidation] = useState({agree: {status:false, msg: "Please Agree to our Terms!"}, cpassword:  {status:false, msg: "Please Confirm password!"}, fullname:  {status:false, msg: "Enter your fullname ex. john doe"}});

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
    agree: targ.agree.checked
   }

   if(!/[a-z]\s+([a-z])/.test(data.fullName)){
    setMsgDesc(validation.fullname.msg)
    setValidation({...validation, fullname: {...validation.fullname, status: true}})
    setErr(true)
    return;
   }else if(data.password !== data.cpassword) {
    setValidation({...validation, cpassword: {...validation.cpassword, status: true}})
    setErr(true)
    setMsgDesc(validation.cpassword.msg)
    return;
   }else if(!data.agree){
    setMsgDesc(validation.agree.msg)
    setValidation({...validation, agree: {...validation.agree, status: true}})
    setErr(true)
    return;
   }else {
    setMsgDesc("")
    setErr(false)
    setValidation({
      agree: {...validation.agree, status: false},
      cpassword: {...validation.cpassword, status: false}, 
      fullname: {...validation.fullname, status: false}
    })
   }

   // pass successful.
   delete data.agree;
   delete data.cpassword;

   //  set loading
   setLoading(true)
   try {
      const res = await instance.post('/client/auth/register', data);
      setErr(false);
      setMsgDesc(res.data.message)
      setCookie('x-access-token', res.data.data.accessToken, {path: "/",})
      // Do some pop-up modal for redirecting
      setTimeout(() => {location.reload()}, 1500)
   } catch (error:any) {
      setLoading(false)
      if(error.response.data.description) {
        setErr(true)
        setMsgDesc(error.response.data.description)
      }
   }
  }
  return (
    <main className='w-full h-full flex justify-center p-3'>
      <div className='md:w-[600px] w-full min-h-auto rounded-xl md:p-8 p-4 bg-white'>
        <div className="">
          <div className="">
            <h1 className='text-[#33406a] text-3xl font-bold mb-1'>Get Started</h1>
            <p className='text-xl text-[#55658a]'>Open account for free and start investing now!</p>
          </div>
          <form method="POST" onSubmit={handleRegister} className='mt-10'>
            <p className={`${err ? 'text-[red]' : 'text-[green]'}  my-2`}>{msgDesc}</p>
            <div className={`bg-[#f4f4f4] rounded-md transition-all duration-300 ${validation.fullname.status ? 'border-[1px] border-[red]' : ''}`}>
              <input  className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' name="fullname" type="text" placeholder="Your Fullname *" required/>
            </div>

            <div className='bg-[#f4f4f4] rounded-md mt-3'>
              <input  className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' name='username' pattern="[a-z]*(\d|[a-z]){4,8}$" title="4 to 8 lowercase letters" type="text" placeholder="Your Username *" required/>
            </div>

            <div className='w-full flex gap-2 mt-3'>
              <div className='w-1/2 bg-[#f4f4f4] rounded-md'>
                <input  className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="email" name='email' placeholder="Email Address *" required/>
              </div>


              <div className='w-1/2 bg-[#f4f4f4] rounded-md'>
                <input  className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="tel" name='phone' pattern='[0-9]{10,10}' title='Enter phone number. 10 digit long' placeholder="Phone Number *" required/>
              </div>
            </div>

            <div className='border-[1px] border-[#ccc] my-3'>
              <Select className='w-full' />
            </div>

            <div className="flex my-3 items-center gap-2">
              <div className="border-[1px] border-[#ccc]">
                <select className="w-full p-3 bg-transparent" name="currency" required>
                  <option value="GBP">£</option>
                  <option value="USD">$</option>
                </select>
              </div>

              <div className='bg-[#f4f4f4] rounded-md w-full'>
                <input className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' min={1} title="Your Annual Income can't be zero" name='annual' type="number" placeholder="Annual Income *" required/>
              </div>
            </div>


            <div className='bg-[#f4f4f4] rounded-md mt-3 w-full'>
                <input className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' defaultValue={router?.get('ref') as string}  name='referral' type="text" autoComplete='off' placeholder="Referral Username (Optional)"/>
            </div>

            {/* PASSWORDS */}
            <div className='w-full flex gap-2 mt-3'>
              <div className='w-1/2 bg-[#f4f4f4] rounded-md'>
                <input className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="password" name='password' placeholder="Password *" autoComplete='off' required/>
              </div>


              <div className={`w-1/2 bg-[#f4f4f4] rounded-md transition-all duration-300 ${validation.cpassword.status ? 'border-[1px] border-[red]' : 'border-none'}`}>
                <input  className='bg-transparent font-medium text-[#526288] w-full p-3 border-0 outline-none' type="password" name='cpassword' placeholder="Confirm Password *" required/>
              </div>
            </div>

            <div className="w-full flex justify-center mt-3">
              <div className="flex items-center">
                <input type="checkbox" id='radio' className='mr-3' name="agree" />
                <label htmlFor='radio' className={`font-bold text-[#242424cc] transition-all duration-300 ${validation.agree.status ? 'border-b-[2px] border-dotted border-[red]' : ''}`} >I agree to the Terms & Conditions of service.</label>
              </div>
            </div>
            <div className="w-full mt-4 flex justify-center">
              <button type="submit" className='bg-[#007bff] h-[50px] disabled:opacity-50 w-full shadow-md text-white font-bold rounded-md' value="create account" disabled={loading}>{loading ? <ButtonSpinner /> : "create account"}</button>
            </div>
          </form>

          <div className="mt-4">
            <div className={style.or}><span className='p-3 font-bold text-[#242424cc]'>Or</span></div>
          </div>

          <div className="flex mt-3 justify-center text-lg">
            <p>Already have an account?</p>
            <Link href={"/login"} className='ml-1 font-bold text-[rgb(12,108,242)]'>Login</Link>
          </div>
        </div>
      </div>
    </main>
  )
}


export function Select({className}:{className: string}) {
  return (
    <select className={`${className} p-4 bg-transparent`} name="country" autoComplete="yes" required>
      <option value="">Select a country…</option>
      <option value="AF">Afghanistan (AF)</option>
      <option value="AL">Albania (AL)</option>
      <option value="DZ">Algeria (DZ)</option>
      <option value="AS">American Samoa (AS)</option>
      <option value="AD">Andorra (AD)</option>
      <option value="AO">Angola (AO)</option>
      <option value="AI">Anguilla (AI)</option>
      <option value="AQ">Antarctica (AQ)</option>
      <option value="AG">Antigua and Barbuda (AG)</option>
      <option value="AR">Argentina (AR)</option>
      <option value="AM">Armenia (AM)</option>
      <option value="AW">Aruba (AW)</option>
      <option value="AU">Australia (AU)</option>
      <option value="AT">Austria (AT)</option>
      <option value="AZ">Azerbaijan (AZ)</option>
      <option value="BS">Bahamas (BS)</option>
      <option value="BH">Bahrain (BH)</option>
      <option value="BD">Bangladesh (BD)</option>
      <option value="BB">Barbados (BB)</option>
      <option value="BY">Belarus (BY)</option>
      <option value="BE">Belgium (BE)</option>
      <option value="BZ">Belize (BZ)</option>
      <option value="BJ">Benin (BJ)</option>
      <option value="BM">Bermuda (BM)</option>
      <option value="BT">Bhutan (BT)</option>
      <option value="BO">Bolivia (BO)</option>
      <option value="BA">Bosnia and Herzegovina (BA)</option>
      <option value="BW">Botswana (BW)</option>
      <option value="BV">Bouvet Island (BV)</option>
      <option value="BR">Brazil (BR)</option>
      <option value="IO">British Indian Ocean Territory (IO)</option>
      <option value="BN">Brunei Darussalam (BN)</option>
      <option value="BG">Bulgaria (BG)</option>
      <option value="BF">Burkina Faso (BF)</option>
      <option value="BI">Burundi (BI)</option>
      <option value="KH">Cambodia (KH)</option>
      <option value="CM">Cameroon (CM)</option>
      <option value="CA">Canada (CA)</option>
      <option value="CV">Cape Verde (CV)</option>
      <option value="KY">Cayman Islands (KY)</option>
      <option value="CF">Central African Republic (CF)</option>
      <option value="TD">Chad (TD)</option>
      <option value="CL">Chile (CL)</option>
      <option value="CN">China (CN)</option>
      <option value="CX">Christmas Island (CX)</option>
      <option value="CC">Cocos (Keeling) Islands (CC)</option>
      <option value="CO">Colombia (CO)</option>
      <option value="KM">Comoros (KM)</option>
      <option value="CG">Congo (CG)</option>
      <option value="CD">Congo, the Democratic Republic of the (CD)</option>
      <option value="CK">Cook Islands (CK)</option>
      <option value="CR">Costa Rica (CR)</option>
      <option value="CI">Cote D'Ivoire (CI)</option>
      <option value="HR">Croatia (HR)</option>
      <option value="CU">Cuba (CU)</option>
      <option value="CY">Cyprus (CY)</option>
      <option value="CZ">Czech Republic (CZ)</option>
      <option value="DK">Denmark (DK)</option>
      <option value="DJ">Djibouti (DJ)</option>
      <option value="DM">Dominica (DM)</option>
      <option value="DO">Dominican Republic (DO)</option>
      <option value="EC">Ecuador (EC)</option>
      <option value="EG">Egypt (EG)</option>
      <option value="SV">El Salvador (SV)</option>
      <option value="GQ">Equatorial Guinea (GQ)</option>
      <option value="ER">Eritrea (ER)</option>
      <option value="EE">Estonia (EE)</option>
      <option value="ET">Ethiopia (ET)</option>
      <option value="FK">Falkland Islands (Malvinas) (FK)</option>
      <option value="FO">Faroe Islands (FO)</option>
      <option value="FJ">Fiji (FJ)</option>
      <option value="FI">Finland (FI)</option>
      <option value="FR">France (FR)</option>
      <option value="GF">French Guiana (GF)</option>
      <option value="PF">French Polynesia (PF)</option>
      <option value="TF">French Southern Territories (TF)</option>
      <option value="GA">Gabon (GA)</option>
      <option value="GM">Gambia (GM)</option>
      <option value="GE">Georgia (GE)</option>
      <option value="DE">Germany (DE)</option>
      <option value="GH">Ghana (GH)</option>
      <option value="GI">Gibraltar (GI)</option>
      <option value="GR">Greece (GR)</option>
      <option value="GL">Greenland (GL)</option>
      <option value="GD">Grenada (GD)</option>
      <option value="GP">Guadeloupe (GP)</option>
      <option value="GU">Guam (GU)</option>
      <option value="GT">Guatemala (GT)</option>
      <option value="GN">Guinea (GN)</option>
      <option value="GW">Guinea-Bissau (GW)</option>
      <option value="GY">Guyana (GY)</option>
      <option value="HT">Haiti (HT)</option>
      <option value="HM">Heard Island and Mcdonald Islands (HM)</option>
      <option value="VA">Holy See (Vatican City State) (VA)</option>
      <option value="HN">Honduras (HN)</option>
      <option value="HK">Hong Kong (HK)</option>
      <option value="HU">Hungary (HU)</option>
      <option value="IS">Iceland (IS)</option>
      <option value="IN">India (IN)</option>
      <option value="ID">Indonesia (ID)</option>
      <option value="IR">Iran, Islamic Republic of (IR)</option>
      <option value="IQ">Iraq (IQ)</option>
      <option value="IE">Ireland (IE)</option>
      <option value="IL">Israel (IL)</option>
      <option value="IT">Italy (IT)</option>
      <option value="JM">Jamaica (JM)</option>
      <option value="JP">Japan (JP)</option>
      <option value="JO">Jordan (JO)</option>
      <option value="KZ">Kazakhstan (KZ)</option>
      <option value="KE">Kenya (KE)</option>
      <option value="KI">Kiribati (KI)</option>
      <option value="KP">Korea, Democratic People&apos;s Republic of (KP)</option>
      <option value="KR">Korea, Republic of (KR)</option>
      <option value="KW">Kuwait (KW)</option>
      <option value="KG">Kyrgyzstan (KG)</option>
      <option value="LA">Lao People&apos;s Democratic Republic (LA)</option>
      <option value="LV">Latvia (LV)</option>
      <option value="LB">Lebanon (LB)</option>
      <option value="LS">Lesotho (LS)</option>
      <option value="LR">Liberia (LR)</option>
      <option value="LY">Libyan Arab Jamahiriya (LY)</option>
      <option value="LI">Liechtenstein (LI)</option>
      <option value="LT">Lithuania (LT)</option>
      <option value="LU">Luxembourg (LU)</option>
      <option value="MO">Macao (MO)</option>
      <option value="MK">Macedonia, the Former Yugoslav Republic of (MK)</option>
      <option value="MG">Madagascar (MG)</option>
      <option value="MW">Malawi (MW)</option>
      <option value="MY">Malaysia (MY)</option>
      <option value="MV">Maldives (MV)</option>
      <option value="ML">Mali (ML)</option>
      <option value="MT">Malta (MT)</option>
      <option value="MH">Marshall Islands (MH)</option>
      <option value="MQ">Martinique (MQ)</option>
      <option value="MR">Mauritania (MR)</option>
      <option value="MU">Mauritius (MU)</option>
      <option value="YT">Mayotte (YT)</option>
      <option value="MX">Mexico (MX)</option>
      <option value="FM">Micronesia, Federated States of (FM)</option>
      <option value="MD">Moldova, Republic of (MD)</option>
      <option value="MC">Monaco (MC)</option>
      <option value="MN">Mongolia (MN)</option>
      <option value="MS">Montserrat (MS)</option>
      <option value="MA">Morocco (MA)</option>
      <option value="MZ">Mozambique (MZ)</option>
      <option value="MM">Myanmar (MM)</option>
      <option value="NA">Namibia (NA)</option>
      <option value="NR">Nauru (NR)</option>
      <option value="NP">Nepal (NP)</option>
      <option value="NL">Netherlands (NL)</option>
      <option value="AN">Netherlands Antilles (AN)</option>
      <option value="NC">New Caledonia (NC)</option>
      <option value="NZ">New Zealand (NZ)</option>
      <option value="NI">Nicaragua (NI)</option>
      <option value="NE">Niger (NE)</option>
      <option value="NG">Nigeria (NG)</option>
      <option value="NU">Niue (NU)</option>
      <option value="NF">Norfolk Island (NF)</option>
      <option value="MP">Northern Mariana Islands (MP)</option>
      <option value="NO">Norway (NO)</option>
      <option value="OM">Oman (OM)</option>
      <option value="PK">Pakistan (PK)</option>
      <option value="PW">Palau (PW)</option>
      <option value="PS">Palestinian Territory, Occupied (PS)</option>
      <option value="PA">Panama (PA)</option>
      <option value="PG">Papua New Guinea (PG)</option>
      <option value="PY">Paraguay (PY)</option>
      <option value="PE">Peru (PE)</option>
      <option value="PH">Philippines (PH)</option>
      <option value="PN">Pitcairn (PN)</option>
      <option value="PL">Poland (PL)</option>
      <option value="PT">Portugal (PT)</option>
      <option value="PR">Puerto Rico (PR)</option>
      <option value="QA">Qatar (QA)</option>
      <option value="RE">Reunion (RE)</option>
      <option value="RO">Romania (RO)</option>
      <option value="RU">Russian Federation (RU)</option>
      <option value="RW">Rwanda (RW)</option>
      <option value="SH">Saint Helena (SH)</option>
      <option value="KN">Saint Kitts and Nevis (KN)</option>
      <option value="LC">Saint Lucia (LC)</option>
      <option value="PM">Saint Pierre and Miquelon (PM)</option>
      <option value="VC">Saint Vincent and the Grenadines (VC)</option>
      <option value="WS">Samoa (WS)</option>
      <option value="SM">San Marino (SM)</option>
      <option value="ST">Sao Tome and Principe (ST)</option>
      <option value="SA">Saudi Arabia (SA)</option>
      <option value="SN">Senegal (SN)</option>
      <option value="CS">Serbia and Montenegro (CS)</option>
      <option value="SC">Seychelles (SC)</option>
      <option value="SL">Sierra Leone (SL)</option>
      <option value="SG">Singapore (SG)</option>
      <option value="SK">Slovakia (SK)</option>
      <option value="SI">Slovenia (SI)</option>
      <option value="SB">Solomon Islands (SB)</option>
      <option value="SO">Somalia (SO)</option>
      <option value="ZA">South Africa (ZA)</option>
      <option value="GS">South Georgia and the South Sandwich Islands (GS)</option>
      <option value="ES">Spain (ES)</option>
      <option value="LK">Sri Lanka (LK)</option>
      <option value="SD">Sudan (SD)</option>
      <option value="SR">Suriname (SR)</option>
      <option value="SJ">Svalbard and Jan Mayen (SJ)</option>
      <option value="SZ">Swaziland (SZ)</option>
      <option value="SE">Sweden (SE)</option>
      <option value="CH">Switzerland (CH)</option>
      <option value="SY">Syrian Arab Republic (SY)</option>
      <option value="TW">Taiwan, Province of China (TW)</option>
      <option value="TJ">Tajikistan (TJ)</option>
      <option value="TZ">Tanzania, United Republic of (TZ)</option>
      <option value="TH">Thailand (TH)</option>
      <option value="TL">Timor-Leste (TL)</option>
      <option value="TG">Togo (TG)</option>
      <option value="TK">Tokelau (TK)</option>
      <option value="TO">Tonga (TO)</option>
      <option value="TT">Trinidad and Tobago (TT)</option>
      <option value="TN">Tunisia (TN)</option>
      <option value="TR">Turkey (TR)</option>
      <option value="TM">Turkmenistan (TM)</option>
      <option value="TC">Turks and Caicos Islands (TC)</option>
      <option value="TV">Tuvalu (TV)</option>
      <option value="UG">Uganda (UG)</option>
      <option value="UA">Ukraine (UA)</option>
      <option value="AE">United Arab Emirates (AE)</option>
      <option value="GB">United Kingdom (GB)</option>
      <option value="US">United States (US)</option>
      <option value="UM">United States Minor Outlying Islands (UM)</option>
      <option value="UY">Uruguay (UY)</option>
      <option value="UZ">Uzbekistan (UZ)</option>
      <option value="VU">Vanuatu (VU)</option>
      <option value="VE">Venezuela (VE)</option>
      <option value="VN">Viet Nam (VN)</option>
      <option value="VG">Virgin Islands, British (VG)</option>
      <option value="VI">Virgin Islands, U.s. (VI)</option>
      <option value="WF">Wallis and Futuna (WF)</option>
      <option value="EH">Western Sahara (EH)</option>
      <option value="YE">Yemen (YE)</option>
      <option value="ZM">Zambia (ZM)</option>
      <option value="ZW">Zimbabwe (ZW)</option>
    </select>
  )
}