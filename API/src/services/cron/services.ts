import { Op } from "sequelize";
import userDeposit from "../../models/Users/deposit";
import compoundingDeposit from "../../models/mode/compoundingDeposit";
import Coinbase from "../userServices/coinbase";
import queueEmail from "../../models/services/queueEmail";
import send_mail, { EmailTemplate } from "../email-service";
import handleServices from "../userServices/handleServices";
import handleCompoundingServices from "../userServices/handleCompoundingService";
import Client from "../../models/Users/users";
import templates from "../../utils/emailTemplates";
import config from "../../config/config";
import fs from 'fs'
import path from "path";
import axios from "axios";

interface cronServiceInterface {
    fixerData: () => Promise<void>;
    deliveryMailBoy: () => Promise<void>;
    monthlyEarning: () => Promise<void>;
    dailyEarning: () => Promise<void>;
    mailBoy: () => Promise<void>;
    depositCompoundingService: () => Promise<void>;
    depositService: () => Promise<void>;
}


var cronService = {} as cronServiceInterface;


cronService.depositService = async function() {
    try {
        const deposit: any[] = await userDeposit.findAll({where: {status: {[Op.notIn]: ["SUCCESSFUL", "EXPIRED"]}}});
        console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥')
        if(!deposit.length) {
          return console.log("Keep waiting for Task For Deposit service 🚻🚻🚻🚻🚻🚻🚻 ")
        }
        for(let i = 0; i < deposit.length; ++i) {
            Coinbase.updateById(userDeposit, deposit[i].chargeID, "normal", function(err) {
                console.log(err, "error occured during cron")
            })
        }
    } catch (error) {
        throw error
    }
}


cronService.mailBoy = async function() {
    try {
        const mails: any[] = await queueEmail.findAll({where: {completed: false, priority: "HIGH"}});
        if(!mails.length) return console.log("Keep waiting for Task For Queued mails 🚻🚻🚻🚻🚻🚻🚻")
        for(let i = 0; i < mails.length; ++i) {
            // send mail straigh ahead.
            const  {clientId, header, username, recipient, message} = mails[i];
            const createTemp = EmailTemplate({
                user: username,
                template: message
            });

            send_mail(header,createTemp, recipient, async function(done, err) {
                if(err) {
                    //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
                    return;
                }

                queueEmail.destroy({where: {clientId}}).then(() => console.log('Mail sent and offloaded'))
            })
        }
    } catch (error) {
        throw error
    }
}

cronService.deliveryMailBoy = async function() {
    try {
        const mails: any = await queueEmail.findOne({where: {completed: false, priority: "LOW"}});
        if(!mails) return console.log("Keep waiting for Task For Queued mails 🚻🚻🚻🚻🚻🚻🚻")
        const {header, message} = mails;
        const clients = await Client.findAll({where: {isVerified: true, owner: false, isAdmin: false}})
        for(let i = 0; i < clients.length; ++i) {
            // send mail straigh ahead.
            const  {email, userName, uuid}:any = clients[i];
            const createTemp = EmailTemplate({
                user: userName,
                template: message
            });

            send_mail(header,createTemp, email, async function(done, err) {
                if(err) {
                    //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
                    // if there's an error keep it for mail boy
                    templates.createSimpleMailTemp([
                        {
                            type: "p",
                            msg: message
                        },
                        {
                            type: "a",
                            link: config.APP_URI,
                            value: "Login Now"
                        }
                    ], email, userName, header, uuid)
                    return;
                }

            })
        }
        queueEmail.destroy({where: {clientId: "GENERAL_ID"}}).then(() => console.log('Mail sent and offloaded'))
    } catch (error) {
        throw error
    }
}



cronService.depositCompoundingService = async function() {
    try {
        const deposit: any[] = await compoundingDeposit.findAll({where: {status: {[Op.notIn]: ["SUCCESSFUL", "EXPIRED"]}}});
        if(!deposit.length) {
          return console.log("Keep waiting for Task For deposit compounding service 🚻🚻🚻🚻🚻🚻🚻")
        }
        for(let i = 0; i < deposit.length; ++i) {
            Coinbase.updateById(compoundingDeposit, deposit[i].chargeID, "compounding", function(err) {
                console.log(err, "error occured during cron")
            })
        }
    } catch (error) {
        throw error
    }
}



// daily.

// FOR NORMAL DEPOSIT.
cronService.dailyEarning = async function() {
    try {
        const deposit: any[] = await userDeposit.findAll({where: {investmentCompleted: false, status: "SUCCESSFUL"}});
        if(!deposit.length) {
          return console.log("Keep waiting for Task for daily earning🚻🚻🚻🚻🚻🚻🚻")
        }

        for(let i = 0; i < deposit.length; ++i) {
            handleServices.updateEarning(deposit[i])
        }
    } catch (error) {
        throw error
    }
}

// FOR COMPOUNDING MODE
cronService.monthlyEarning = async function() {
    try {
        const deposit: any[] = await compoundingDeposit.findAll({where: {investmentCompleted: false}});
        if(!deposit.length) {
          return console.log("Keep waiting for Task for monthly earning 🚻🚻🚻🚻🚻🚻🚻")
        }

        for(let i = 0; i < deposit.length; ++i) {
            handleCompoundingServices.updateEarning(deposit[i])
        }
    } catch (error) {
        throw error
    }
}

cronService.fixerData = async function() {
    try {
        // make request to the fixer api.
        const {data} = await axios.get(`http://data.fixer.io/api/latest?access_key=${config.FIXER_API}& base = USD`)
        console.log(data)
        // save the data to a file.
        if(!data.suceess) return;
        const filePath = path.join(__dirname, "../../fixer.json");
        const dataAsStr = JSON.stringify(data.rates, null, 2)
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if(err) {
                // write the file
                fs.writeFile(filePath, dataAsStr, (err) => {
                    if (err) {
                        console.error('Error creating file:', err);
                    } else {
                        console.log('File created successfully.');
                    }
                })
            }else {
                fs.writeFile(filePath, dataAsStr, (err) => {
                    if (err) {
                        console.error('Error creating file:', err);
                    } else {
                        console.log('File created successfully.');
                    }
                })
            }
        })
    } catch (error) {
        console.log(error)
        // throw error
    }
}
export default cronService;