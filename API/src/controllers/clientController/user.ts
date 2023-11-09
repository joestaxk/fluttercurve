import httpStatus from 'http-status'
import ApiError from '../../utils/ApiError';
import Client, { ClientInterface } from '../../models/Users/users';
import helpers from '../../utils/helpers';
import Referral from '../../models/Users/referrals';
import Kyc from '../../models/Users/kyc';
import path from 'path'
import fs from 'fs'

interface userControllerInterface {
    getUserKyc: (req: any, res: any, next: any) => Promise<void>;
    getProfile: (req: any, res: any) => Promise<void>;
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
        const me: ClientInterface<string> = await Client.findOne({where: {uuid: req.id},  include:['Referrals', 'userAccount', 'userCompounding']}) as any
        res.send({
            ...helpers.filterObjectData(me), 
            noRefferedUser: me.Referrals?.length, 
            userAccount: me.userAccount,
            userCompounding: me.userCompounding
        })
    } catch (error) {
        console.log(error)
       res.status(httpStatus.BAD_REQUEST).status(httpStatus.BAD_REQUEST).send(error)
    }
}

userController.getProfile = async function(req:any, res:any) {
    const filename = req.params.filename;
	// Construct the path to the image file
	const imagePath = path.join('./public/private/users', filename)
	// Check if the image file exists
	if (fs.existsSync(imagePath)) {
        // Read the image file as a buffer
          const imageBuffer = fs.readFileSync(imagePath);

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
      // Add more cases for other supported image file types if needed
      default:
        return 'application/octet-stream'; // Fallback to a generic binary content type
    }
  }

userController.getReferredUser = async function(req:any, res:any) {
    try {
        const {data}:any = await Referral.findAll({where: {ClientUuid: req.id}});
        if(!data) return res.status(404).send(null)
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
    const { password} = req.body;
    try {
        if(!password || password.length < 5) throw new ApiError("Invalid password", httpStatus.NOT_ACCEPTABLE, "Weak Password")

        if(!token) throw new ApiError("Invalid link", httpStatus.NOT_ACCEPTABLE, "Invalid forget password link");

        const findToken:ClientInterface<string> = await Client.findOne({where: {oneTimeKeyToken: token}}) as any;

        if(!findToken) throw new ApiError("User not found", httpStatus.NOT_FOUND, "User is not found");

        const hashPassword = await helpers.hashPassword(password);
        const update = await Client.update({password: hashPassword, oneTimeKeyToken: null}, {where: {uuid: findToken.uuid}});

        if(!update[0]) throw new ApiError("Update Err", httpStatus.BAD_REQUEST, "Can't Update Reuest at the moment.")
        res.send({message: "Password changed. Login now."}) 
    } catch (error) {
        console.log(error)
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


userController.getUserKyc = async function(req,res,next) {
    try {
        const getKyc:any = await Kyc.findOne({where: {clientID: req.id}}) // useful later below
        res.send(getKyc.isKyc)
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

userController.setupKyc = async function (req, res, next) {
    const files = req.files;
    const body = req.body;

    const stage = body.stage;
      
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

    const checkIfExist= await Kyc.findOne({where: {clientID: req.id}}) // useful later below
    if(stage === "1") {
        // Validate request body fields
        if (!fileData.passport || !body.fullName || !body.dob || !body.nationality) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }
        const bodyData = {
            passport: fileData.passport,
            fullName: body.fullName,
            dob: body.dob,
            nationality: body.nationality,
        };
        if(!checkIfExist)  {
            Kyc.create({
                passport: fileData.passport,
                fullName: bodyData.fullName,
                dob: bodyData.dob,
                nationality: bodyData.nationality,
                clientID: req.id,
                userId: req.primaryKey
            }).then(() => {
                // KYC data saved successfully
                return res.status(200).json({ message: 'Personal Information Updated' });
            })
            .catch((error) => {
                console.log(error)
                // Error occurred while saving KYC data
                res.status(500).json({ error: 'Failed to save KYC data' });
            });
        }else {
                Kyc.update({
                    passport: fileData.passport,
                    fullName: bodyData.fullName,
                    dob: bodyData.dob,
                    nationality: bodyData.nationality,
                    isKyc: "PENDING",
                    clientID: req.id
                }, {where: {clientID: req.id}}).then(() => {
                    // KYC data saved successfully
                    return res.status(200).json({ message: 'Personal Information Updated' });
                })
                .catch((error) => {
                    console.log(error)
                    // Error occurred while saving KYC data
                    res.status(500).json({ error: 'Failed to save KYC data' });
                });
        }
    }else if(stage === "2" && checkIfExist) {
         // Ensure all required files are present
        if (!body.idType || !fileData.frontID || !fileData.backID ) {
            return res.status(400).json({ error: 'Missing required files.' });
        }
        Kyc.update({
            idType: body.idType,
            frontID: fileData.frontID,
            backID: fileData.backID,
        }, {where: {clientID: req.id}}).then(() => {
            return res.status(200).json({ message: 'Identification Submitted & Updated' });
        }).catch((err) => {
            res.status(500).json({ error: 'Failed to save KYC data' });
        })
    }else if(stage === "3" && checkIfExist) {
        // Ensure all required files are present
        if (!fileData.livevideo) {
            return res.status(400).json({ error: 'Missing required files.' });
        }

        Kyc.update({
            livevideo: fileData.livevideo,
        }, {where: {clientID: req.id}}).then(() => {
            return res.status(200).json({ message: 'Facial Identity Updated' });
        }).catch((err) => {
            res.status(500).json({ error: 'Failed to save KYC data' });
        })
    }
};
export default userController;
