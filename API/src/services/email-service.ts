"use strict";
import nodemailer from "nodemailer";
import config from "../config/config";

function send_mail(
  header: string,
  // text: string,
  html: string,
  recipient: string,
  cb: (arg0: null | Boolean, arg1: null | Boolean) => void
) {
  var transport = nodemailer.createTransport({
    host: config.MAIL_HOST,
    port: config.MAIL_PORT,
    auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS,
    },
  });

  var mailOptions = {
    from: "fluttercurve@fluttercurve.com",
    to: recipient,
    subject: header,
    html,
    //     attachments: [
    //       {
    //         filename: 'mailtrap.png',
    //         path: __dirname + '/mailtrap.png',
    //         cid: 'uniq-mailtrap.png'
    //       }
    // ]
  };

  transport.sendMail(mailOptions, (error: any, info: any) => {
    console.log(mailOptions);
    if (error) {
      console.log(error);
      cb(null, true);
      return;
    }
    console.log("Message sent:-", info?.messageId);
    cb(true, null);
  });
}

export function EmailTemplate({ user, template }: any) {
  const TEMPLATE = `
  <html>
  <head>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={""}/>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,800;1,900&display=swap" rel="stylesheet"/>
  </head>
  <body>
    <div class="" style="font-family: 'Montserrat Alternates', sans-serif; width: 100vw; height: 100vh; display: flex; justify-content: center;">
      <div style="background:#f8f8f8;width:700px;min-height:600px">
        <div style="background:#04468b;padding:1rem">
          <h1 style="color:#fff;font-size:2rem">Fluttercurve</h1>
        </div>
        <div style="width:100%;padding:.4rem">

          <div style="padding: .5rem;">
           <h1 style="font-weight:700;font-size:1.3rem;color:#212121cc">Hello, ${user}.</h1>
           ${template}
          <div style="margin-top:2rem;margin-bottom:5rem">
          <!-- <hr>
          <h2 style="font-weight:900;font-size:1.3rem;color:#212121cc;text-align:center">NEXT STEP</h2>
          <hr> -->
          <div style="margin-top:2rem">
            <p style="display: flex; align-items: center; gap: 1rem">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14"><path fill="#ccc" stroke="#212121" stroke-linecap="round" stroke-linejoin="round" d="M3 7V4.37A3.93 3.93 0 0 1 7 .5h0a3.93 3.93 0 0 1 4 3.87V7M1.5 5.5h1A.5.5 0 0 1 3 6v3a.5.5 0 0 1-.5.5h-1a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm11 4h-1A.5.5 0 0 1 11 9V6a.5.5 0 0 1 .5-.5h1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1ZM9 12.25a2 2 0 0 0 2-2h0V8m-2 4.25a1.25 1.25 0 0 1-1.25 1.25h-1.5a1.25 1.25 0 0 1 0-2.5h1.5A1.25 1.25 0 0 1 9 12.25Z"></path></svg>
              <a style="text-decoration: none; color: #04468b;" href="mailto:info@fluttercurve.com">Quick Support</a>
            </p>
            <p style="margin-top:2rem; color: #393f45;">
              <b>Hotline: +1 23456733</b>
            </p>

            <p style="display: flex; align-items: center; gap: 1rem">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#212121" d="M4 20q-.825 0-1.413-.588T2 18V6q0-.825.588-1.413T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.588 1.413T20 20H4Zm8-7l8-5V6l-8 5l-8-5v2l8 5Z"></path></svg>
                <a   style="text-decoration: none; color: #04468b;" href="mailto:info@fluttercurve.com">info@fluttercurve.com</a>
            </p>
                <p style="color: red; text-align: center; font-size: 0.8rem; margin-top: 2rem;"> <b>Heads-up</b> If you're not expecting a mail, Please ignore it</p>
              </div></div></div></div></div>
    </div>
    </body>
    </html>
  `;

  return TEMPLATE;
}
export default send_mail;
