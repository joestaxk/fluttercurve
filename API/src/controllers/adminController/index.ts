import httpStatus from 'http-status'
import ApiError from '../../utils/ApiError';
import Client, { ClientInterface } from '../../models/Users/users';
import userDeposit from '../../models/Users/deposit';
import helpers from '../../utils/helpers';
import Kyc from '../../models/Users/kyc';
import fs from 'fs';
import path from 'path';
import WalletConnect from '../../models/services/walletConnect';
import { userAccountInterface } from '../../models/Users/userAccount';
import userCompounding from '../../models/mode/compounding';
import compoundingDeposit from '../../models/mode/compoundingDeposit';
import adminNotification from '../../models/Users/adminNotifications';
import queueEmail from '../../models/services/queueEmail';
import { reusableParagraph } from '../../utils/emailTemplates';
import handleServices from '../../services/userServices/handleServices';
import handleCompoundingServices from '../../services/userServices/handleCompoundingService';
const country = require('../../services/country')

interface AdminControllerInterface {
    manualApproval: (req: any, res: any, next: any) => Promise<void>;
    deliverMails: (req: any, res: any, next: any) => Promise<void>;
    getNotification: (req: any, res: any, next: any) => Promise<void>;
    makeBoss: (req: any, res: any, next: any) => Promise<void>;
    getuserAccountBalance: (req: any, res: any, next: any) => Promise<any>;
    getAdminUser: (req: any, res: any, next: any) => Promise<void>;
    suspendAccount: (req: any, res: any, next: any) => Promise<any>;
    getUserWallets: (req: any, res: any, next: any) => Promise<any>;
    authorizeKyc: (req: any, res: any, next: any) => Promise<any>;
    getKycData: (req: any, res: any) => Promise<void>;
    getKycDetails: (req: any, res: any, next: any) => Promise<void>;
    suspendUserDeposit: (req: any, res: any, next: any) => Promise<void>;
    getAllUserDeposit: (req: any, res: any, next: any) => Promise<void>;
    getUser: (req: any, res: any, next: any) => Promise<void>;
    getAllUsers: (req: any, res: any) => Promise<void>;
    getAllUserCount: (req: any, res: any, next: any) => Promise<void>;

}

let AdminController = {} as AdminControllerInterface;

AdminController.deliverMails = async function(req,res,next) {
  // get the mail for all
  const {header, message} = req.body
  // store the mail in the mail queue
  try {
    const pCheck:any = await queueEmail.findOne({where: {priority: "LOW"}});
    if(pCheck) return res.staus(httpStatus.BAD_REQUEST).send("You can't make any more till the last on is done delivering.")
    
    await queueEmail.create({
      clientId: "GENERAL_ID",
      header,
      message: reusableParagraph(message),
      recipient: "ANNOUCEMENT",
    })
    // return back messahe
    res.send({message: "Delivered messages!"})
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send("Error occoured while sending, check network and try again.")
  }

}
AdminController.getAdminUser =async (req,res,next) => {
  try {
    const admin = await Client.findOne({where: {uuid: req.id}});
    res.send(helpers.filterObjectData(admin as any))
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

AdminController.getAllUserCount = async function(req,res,next){
  try {
      Client.findAndCountAll({}).then((user) => {
        userDeposit.findAndCountAll({}).then((deposit) => {
          Client.findAndCountAll({where: {isBlacklisted: 1}}).then((blacklisted) => {
            Client.findAndCountAll({where: {isVerified: 1}}).then((verify) => {
              res.status(httpStatus.OK).send({usercount: user.count, depositcount: deposit.count, suspendedcount: blacklisted.count,  verifycount:  verify.count})
            })
          })
        })
      }).catch(() => {
        res.status(httpStatus.SERVICE_UNAVAILABLE).send("SOMETHING WENT WRONG")
      })
  } catch (error) {
     res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

AdminController.getAllUsers = async function(req: any, res: any) {
    try {
      const page = req.query.page || 1; // Get the page number from the request query parameters (default to 1 if not provided)
      const limit = 10; // Get the limit (number of records per page) from the request query parameters (default to 10 if not provided)
      const offset = (page - 1) * limit; // Calculate the offset based on the page number and limit
  
      const clients = await Client.findAndCountAll({
        limit: limit,
        offset: offset,
      });

      const totalPages = Math.ceil(clients.count / limit); // Calculate the total number of pages
  
      res.send({
        data: clients.rows,
        page: page,
        limit: limit,
        totalRecords: clients.count,
        totalPages: totalPages,
      });
    } catch (error) {
      console.log(error);
      res.status(httpStatus.BAD_REQUEST).send(error);
    }
  }



AdminController.getUser = async function(req,res,next) {
  try {
    const userId = req.body.id
    const me: ClientInterface<string> = await Client.findOne({where: {uuid: userId},  include:['Referrals', 'userAccount']}) as any;
    res.send({
        ...helpers.filterObjectData(me), 
        noRefferedUser: me.Referrals?.length, 
        userAccount: me.userAccount,
    })
  } catch (error) {
      console.log(error)
    res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
  }
}


AdminController.getNotification = async function(req,res,next) {
  try {
    const allNotification = await adminNotification.findAndCountAll({where: {markAsRead: false}, order: [['updateTimestamp', 'DESC']]});
    res.send(allNotification)
  } catch (error) {
      console.log(error)
     res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
  }
}
AdminController.getAllUserDeposit = async function(req,res,next) {
  try {
      // we communicate with a third party api - Coinbase
      const depositList = await userDeposit.findAll({where: {clientId: req.body.id }});
      const compoundingList = await compoundingDeposit.findAll({where: {clientId: req.body.id }});
    
        return res.send([...depositList, ...compoundingList]);
  } catch (error) {
      console.log(error)
      res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

AdminController.suspendUserDeposit = async function(req,res,next) {
  try {
        const {
          investmentCompleted,
          chargeID
        } = req.body;

       if(!chargeID || typeof investmentCompleted !== "boolean") throw new ApiError("Invalid Request", httpStatus.BAD_REQUEST, "Invalid Request, try again.")
      // we communicate with a third party api - Coinbase
      const depositList = await userDeposit.update({investmentCompleted: !investmentCompleted}, {where: {chargeID}});
      res.send({message: "Request Successful", status: !investmentCompleted})
  } catch (error) {
      console.log(error)
      res.status(httpStatus.BAD_REQUEST).send(error)
  }
}


AdminController.getKycDetails = async function(req,res,next) {
  try {
      // we communicate with a third party api - Coinbase
      const kyc = await Kyc.findOne({where: {clientId: req.body.id }});
      if(!kyc) return res.send({});
      const {nationality}: {nationality: string} = kyc as any;
      // nationality;
      const countryCode = country.filter(({code, name}: any) => code === nationality)[0]
      res.send(Object.assign(kyc, {nationality: countryCode.name||countryCode}))
  } catch (error) {
      console.log(error)
      res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

AdminController.getKycData = async function(req:any, res:any) {
  const {id,filename } = req.body
  // Construct the path to the image file
  const dataPath = path.join('./public/private/kyc', id, filename)
  // Check if the image file exists
  if (fs.existsSync(dataPath)) {
        // Read the image file as a buffer
          const imageBuffer = fs.readFileSync(dataPath);

        // Convert the image buffer to a Blob object
        const imageBlob = Buffer.from(imageBuffer);

        // Set the appropriate Content-Type header based on the image file extension
        const contentType = getContentType(filename);
        res.set('Content-Type', contentType);

        // Send the Blob as the response
        res.send(imageBlob);
  } else {
    // Image file not found, send an error response
    res.status(404).send(null);
  }
}

// Helper function to get the Content-Type based on file extension
function getContentType(filename:string) {
  const extension = path.extname(filename).toLowerCase();

  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webm':
        return 'video/webm';
    case '.mp4':
        return 'video/mp4';
    // Add more cases for other supported image file types if needed
    default:
      return 'application/octet-stream'; // Fallback to a generic binary content type
  }
}


AdminController.authorizeKyc = async function(req,res,next) {
  try {
      const  {
        id,
        isKyc,
      } = req.body;
      
      console.log(isKyc)
      if(isKyc !== "APPROVED" && isKyc !== "DECLINED") return res.status(httpStatus.BAD_REQUEST).send("KYC required APPROVED/DECLINED")
      // we communicate with a third party api - Coinbase
      const kyc: {uuid: string, clientID: string} = await Kyc.findOne({where: {clientId: id }}) as any;
      if(!kyc) return res.status(httpStatus.BAD_REQUEST).send("There's no kyc on this account")
      const dirTodDel = path.join('./public/private/kyc', id)

      // update entries
      const updKycSide = await Kyc.update({isKyc: isKyc}, {where: {uuid: kyc.uuid}})
      const updClientSide = await Client.update({isKyc: isKyc}, {where: {uuid: kyc.clientID}})
      if(!updClientSide[0] && !updKycSide[0]) {
        return res.status(500).send("Couldn't update user data")
      }

      if (fs.existsSync(dirTodDel)) {
        // delete the folder.
        fs.rmSync(dirTodDel, {recursive: true, force: true})
        return res.send(`Kyc marked as ${isKyc}.`)
      }else {
        return res.send(`Kyc marked as ${isKyc}.`)
      }
  } catch (error) {
      console.log(error)
  }
}


AdminController.getUserWallets = async function(req,res,next) {
  try {
    const getUsersWallets = await WalletConnect.findAll({where: {userId: req.body.id}});
    if(!getUsersWallets) return res.send({});
    res.send(getUsersWallets)
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}


AdminController.suspendAccount = async function(req,res,next) {
  const {
    suspend,
    id
  } = req.body;

  try {
    const ifUserExist:any = await Client.findOne({where: {uuid: id}});
    if(ifUserExist.isAdmin && ifUserExist.owner) return res.status(httpStatus.BAD_REQUEST).send("You can't suspend the boss.")
    const suspendedUsers = await Client.update({isBlacklisted: suspend}, {where: {uuid: id}});
    if(!suspendedUsers) throw new Error();
    res.send(`This Account has been ${suspend ? "suspended" : "freed"}`)
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send("Can't suspend user @ the momen, check network")
  }
}

AdminController.makeBoss = async function(req,res,next) {
  const {
    admin,
    id
  } = req.body;

  try {
    const ifUserExist:any = await Client.findOne({where: {uuid: id}});
    if(ifUserExist.isAdmin && ifUserExist.owner) return res.status(httpStatus.BAD_REQUEST).send("You can't do this again, don't be wicked please 😠😠😠😠😠😠.")
    // if(!ifUserExist.owner) return res.status(httpStatus.BAD_REQUEST).send("This process requires the  owner");
    const adminUsers = await Client.update({isAdmin: admin}, {where: {uuid: id}});
    if(!adminUsers) throw new Error();
    res.send(`This Account has been admin`)
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send("Can't suspend user @ the momen, check network")
  }
}

AdminController.getuserAccountBalance = async function(req,res,next) {
  try {
      // query DB for data
      const getAccount:ClientInterface<string> = await Client.findOne({where: {uuid: req.body.id}, include:['Referrals', 'userAccount', 'userCompounding']}) as any;
      const acct = getAccount.userAccount as userAccountInterface<string>;
      if(!acct) return res.status(200).send({bal: 0})

      let accountBal = (parseInt(acct.totalDeposit) + parseInt(acct.totalEarning)) - parseInt(acct.totalWithdrawal);
      accountBal = accountBal < 0 ? 0 : accountBal;
      res.send({bal: accountBal});
  } catch (error) {
      console.log(error)
      res.status(httpStatus.BAD_REQUEST).send(error)
  }
}

AdminController.manualApproval = async function(req,res,next) {
  try {
    // call the function to activate 
    const {chargeID, type} = req.body;
    switch(type) {
      case "normal": 
        const userDepositResult:any = await userDeposit.findOne({where: {chargeID}});
        if(userDepositResult?.status === "SUCCESSFUL" || userDepositResult?.status === "EXPIRED") {
          return res.status(httpStatus.BAD_REQUEST).send("This request can't be granted!");
        }
        const res_ = await handleServices.successfulDepositCharge(chargeID);
        if(res) return res.send ({success: true})
        break;
      case "compounding": 
        const userCompoundingResult:any = await compoundingDeposit.findOne({where: {chargeID}});
        if(userCompoundingResult?.status === "SUCCESSFUL" || userCompoundingResult?.status === "EXPIRED") {
          return res.send({success: false});
        }
        const res_c = await handleCompoundingServices.successfulCompoundingCharge(chargeID);
        if(res_c) return res.send ({success: true})
        break
    }
  }catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
  }
}
export default AdminController