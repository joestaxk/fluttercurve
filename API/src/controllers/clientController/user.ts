import httpStatus from 'http-status'
import ApiError from '../../utils/ApiError';
import Client, { ClientInterface } from '../../models/Users/users';
import helpers from '../../utils/helpers';
import userAccount, { userAccountInterface } from '../../models/Users/userAccount';
import Referral from '../../models/Users/referrals';
import Kyc from '../../models/Users/kyc';


interface userControllerInterface {
    getRefreshToken: (req: any, res: any) => Promise<void>;
    setupKyc: (req: any, res: any, next: any) => void;
    updateUserInfo: (req: any, res: any, next: any) => Promise<void>;
    updatePassword: (req: any, res: any, next: any) => Promise<void>;
    uploadAvatar: (req: any, res: any, next: any) => void;
    getReferredUser: (req: any, res: any) => Promise<void>;
    updatePasswordByLink: (req: any, res: any) => Promise<void>;
    verifyUserAccount: (arg0: any, res: any) => void,
    getMe: (arg0: any, res:any) => void,
    logout: (arg0: any, res:any) => void,
}

let userController = {} as userControllerInterface;
 
userController.getRefreshToken =async function(req:any, res:any) {
    try {
        const accessToken = req.body.token;
        if(!accessToken) throw new Error("Logout");
        
        const response = await helpers.generateRefreshToken(accessToken, req);
        
        res.send(response)
    } catch (error) {
         console.log(error)
        res.status(400).send(error)        
    }
}

userController.verifyUserAccount = async function(req:any, res:any) {
    try {
        // get userId
        const id = req.query.token;
        if(!id) throw new ApiError("Missing credentials", httpStatus.BAD_REQUEST, "user ID not found in params");

        // If verified
        let amIverified:ClientInterface<string> = await Client.findOne({where: {uuid: id}}) as any;
        if(amIverified.isVerified) return res.send({message: "Account has already been verified", next: true})

        // update verification on user
        const isVerify = await Client.update({isVerified: true},{ where: {uuid: id}});
        if(!isVerify.length){
            throw new ApiError("NOT FOUND", httpStatus.NOT_FOUND, "Something went wrong with verification. try again!")
        }
        // return error/success report.
         // send off a new refresh token
        const access = await helpers.generateRefreshToken(JSON.parse(amIverified.token), req)
        console.log(access);
         res.status(httpStatus.OK).send({message: "Account has been verified successfully", data: access})
    } catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
    }
}

userController.getMe = async function(req:any, res:any) {
    try {
        const me: ClientInterface<string> = await Client.findOne({where: {uuid: req.id},  include:['Referrals', 'userAccount', 'Compounding']}) as any;
        res.send({
            ...helpers.filterObjectData(me), 
            noRefferedUser: me.Referrals?.length, 
            userAccount: me.userAccount,
            compounding: me.Compounding
        })
    } catch (error) {
        console.log(error)
       res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
    }
}

userController.getReferredUser = async function(req:any, res:any) {
    try {
        const {data}:any = await Referral.findAll({where: {ClientUuid: req.id}});
        const filter = data.map((res:any) => {
            return {
            "firstDeposit": res.firstDeposit,
            "userName": res.userName,
            "avatar": res.avatar,
            "createdAt": (new Date(res.createdAt)).toLocaleString(),
        }})
        res.send(filter)
    } catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
    }
}

userController.logout = async function(req:any, res:any) {
    try {
        // get the device you want to logout.
        const logoutUser:ClientInterface<string> = await Client.findOne({where: {uuid: req.id}}) as any;

        let convertToJson:any = JSON.parse(logoutUser.tokens);
        convertToJson.filter(({accessToken}: {accessToken: string}, i:number) => {
            if(JSON.parse(logoutUser.token).accessToken === accessToken){
                console.log(i)
                convertToJson.splice(i, 1);
                convertToJson = JSON.stringify(convertToJson);
            }
        })
        await Client.update({tokens: convertToJson, token: ""}, {where: {uuid: logoutUser.uuid}});
        res.send({message: "You've been Logged out successfully!"})
    } catch (error) {
        console.log(error)
       res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
    }
}

userController.updatePasswordByLink = async function(req,res) {
    const token = req.query?.token;
    const { newPassword, confirmPassword } = req.body;

    try {
        if(newPassword.length < 8 || confirmPassword !== newPassword) throw new ApiError("Invalid password", httpStatus.NOT_ACCEPTABLE, "Password is not valid, password should be >= 8 and equal")

        if(!token) throw new ApiError("Invalid link", httpStatus.NOT_ACCEPTABLE, "Invalid forget password link");

        const findToken:ClientInterface<string> = await Client.findOne({where: {oneTimeKeyToken: token}}) as any;

        if(!findToken) throw new ApiError("User not found", httpStatus.NOT_FOUND, "User is not found");

        // compare password
       /** if(!(await comparePassword(oldPassword.trim(), findToken.password)))  {
            throw new ApiError("Incorrect password", httpStatus.NOT_ACCEPTABLE, "Password is not wrong")
        } **/


        // update password once every 24hrs
        const updated = await Client.update({password: (await helpers.hashPassword(newPassword))}, { where: {uuid: findToken.uuid}})

        if(updated) res.send({message: "Password has been successfully changed. Go to login"}) 
                //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
    }

}

userController.updateUserInfo = async function(req,res,next) {
    try {
        const  {
            fullName,
            country,
            email,
            userName,
            phoneNumber
        }= req.body;

        const updateReq:number[] = await Client.update({fullName, country, email, userName, phoneNumber}, {where: {uuid: req.id}}) as any;
        
        if(!updateReq[0]) {
            throw new ApiError("Update Err", httpStatus.BAD_REQUEST, "Can't Update Reuest at the moment.")
        }
        res.send("Updated successfully!")
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

userController.updatePassword = async function(req,res,next) {
    try {
        const {
            oldPassword,
            newPassword,
        }  = req.body

        const getUser:ClientInterface<string> = await Client.findOne({where: {uuid: req.id}}) as any;
        console.log(getUser.password);

        if(!getUser) throw new ApiError("User not found", httpStatus.BAD_REQUEST, "Logout immediately");
    
        if(!(await helpers.comparePassword(getUser.password, oldPassword))){
            throw new ApiError("Incorrect password", httpStatus.BAD_REQUEST, "Incorrect password");
        }
        const hashPassword = await helpers.hashPassword(newPassword);
        const update = await Client.update({password: hashPassword}, {where: {uuid: req.id}});

        if(!update[0]) throw new ApiError("Update Err", httpStatus.BAD_REQUEST, "Can't Update Reuest at the moment.")

        res.send("Updated successfully")
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

/////////////////////////////// ------- AVATAR --------------/ \\\
userController.uploadAvatar = async function(req,res,next) {
    const file = req.file;
    try {
        // change the user avatar data
        const user = await Client.update({avatar: file.filename}, {where: {uuid: req.id}})
        // const user = await Client.update({referralImage: file.filename}, {where: {referral: req.id }})
        // update profile globally.
        // referral.
        await Referral.update({avatar: file.filename}, {where: {userId: req.id}})
        // send back warming response.
        if(!user[0]) {
            throw new ApiError("Avatar error", httpStatus.BAD_REQUEST, "Profile won't load")
        }
        res.send({message: "Profile updated successfully."})
    } catch (error) {
        // if any
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error);
    }
}



userController.setupKyc = function (req, res, next) {
    const files = req.files;
    const body = req.body;
  
    // Validate request body fields
    if (!body.fullName || !body.idType || !body.dob || !body.nationality) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
  
    // Prepare body and file data
    const bodyData = {
      fullName: body.fullName,
      idType: body.idType,
      dob: body.dob,
      nationality: body.nationality,
      isKyc: false
    };
  
    const fileData = {
      passport: null,
      frontID: null,
      backID: null,
      livevideo: null
    };
  
    // Map file data based on fieldname
    Object.keys(files).forEach((fieldname) => {
        const fileArray = files[fieldname];
        if (Array.isArray(fileArray) && fileArray.length > 0) {
          const file = fileArray[0];
          console.log(file)
          switch (fieldname) {
            case 'passport':
              fileData.passport = file.filename;
              break;
            case 'frontID':
              fileData.frontID = file.filename;
              break;
            case 'backID':
              fileData.backID = file.filename;
              break;
            case 'livevideo':
              fileData.livevideo = file.filename;
              break;
            default:
              break;
          }
        }
      });

 // Ensure all required files are present
    if (!fileData.frontID || !fileData.backID || !fileData.livevideo) {
        return res.status(400).json({ error: 'Missing required files.' });
    }
    
    // Save the KYC data in the Kyc table
    Kyc.create({
        fullName: bodyData.fullName,
        passport: fileData.passport,
        idType: bodyData.idType,
        frontID: fileData.frontID,
        backID: fileData.backID,
        livevideo: fileData.livevideo,
        dob: bodyData.dob,
        nationality: bodyData.nationality,
        isKyc: bodyData.isKyc,
    })
    .then((kyc) => {
        // KYC data saved successfully
        res.status(200).json({ message: 'KYC data saved successfully' });
    })
    .catch((error) => {
        console.log(error)
        // Error occurred while saving KYC data
        res.status(500).json({ error: 'Failed to save KYC data' });
    });
};
export default userController;
