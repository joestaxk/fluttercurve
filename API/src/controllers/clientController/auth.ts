import httpStatus  from 'http-status'
import ApiError  from '../../utils/ApiError'
import Client, { ClientInterface } from '../../models/Users/users';
import helpers from '../../utils/helpers';
import send_mail, { EmailTemplate } from '../../services/email-service';
import config from '../../config/config';
import Referral from '../../models/Users/referrals';

interface authControllerInterface {
    getCountryCode(arg0: string, getCountryCode: any): unknown;
    forgetPassword: (req: any, res: any, next: any) => Promise<void>;
    login: (req: any, res: any, next: any) => Promise<void>;
    register: (req: any, res: any, next: any) => Promise<void>;
}

let authController = {} as authControllerInterface;


authController.register = async function(req, res, next) {
    const {
        fullName,
        userName,
        email,
        phoneNumber,
        country,
        currency,
        annualIncome,
        referral,
        password
    } = req.body

    try {
        // sanitize req body.
        const emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        if (!fullName || !userName || !emailReg.test(email) || phoneNumber.length < 10 || !currency || !country || !password || !annualIncome) {
            throw new ApiError("WRONG CREDENTIALS", httpStatus.NOT_ACCEPTABLE, "Wrong credentials!")
        }

        // futher validations
        // password -- what are we validating in password?
        // if email already exist?
        const ifExist = await Client.findOne({where: {email}});

        if (ifExist) {
            throw new ApiError("AVOID DUPLICATE", httpStatus.NOT_ACCEPTABLE, "Email already exists")
        }

        // if user already exist?
        const ifUsername = await Client.findOne({where: {userName}});

        if (ifUsername) {
            throw new ApiError("AVOID DUPLICATE", httpStatus.NOT_ACCEPTABLE, "Username already exists")
        }
        
        // Referral bonus
        let createRef = false;
        let ifReferrerExist:ClientInterface<string>;
        if(referral){
            ifReferrerExist= await Client.findOne({where: {userName: referral}}) as any;
            // EXIT THAT USER
            if(!ifReferrerExist) throw new ApiError("Refferal issues", httpStatus.BAD_REQUEST, "Wrong referrer credentials, continue without a referral!")
            if(!ifReferrerExist.isVerified) throw new ApiError("Refferal issues", httpStatus.BAD_REQUEST, "Unverified referrer, continue without a referral !")
            if(ifReferrerExist.isBlacklisted) throw new ApiError("Refferal issues", httpStatus.BAD_REQUEST, "Referrer has been blacklisted, continue without a referral!")
            createRef = true;
        }


        const createData:any = await Client.build({
            fullName,
            userName,
            email,
            phoneNumber,
            country,
            annualIncome,
            currency,
            referral,
            password,
        })


        const access = await helpers.generateToken(createData, createData.uuid, createData.email)
        
        // verify email - TEST PURPOSE HERE
        const template = `
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:2rem">Welcome to <b>Flutter curve</b> and thanks for signing up! You're one step closer to earning.</p>
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:4rem">This process is just a simple verification process where you get to click the link below to verify you as the owner.</p>
           <a href="${config.APP_NAME}/verification?token=${createData.uuid}">
            <button style="display:flex;align-items:center;gap:1;margin-top:2rem;background:#000;border-radius:1rem;color:#fff;padding:.8rem">
                <span>Verify My Account!</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#f8f8f8" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L764.736 512L452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L508.736 512L196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg></button>
            </a>
        `

        const htmlMarkup = EmailTemplate({user: createData.userName, template})

       // Send using cb
       send_mail("Verification Link sent", htmlMarkup, email, async function(done, err) {
            if(err) {
                //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
                return res.status(httpStatus.BAD_REQUEST).send({message: "Couldn't send Verification mail. check network connection"})
            }
            
            if(createRef) {
                await Referral.create({
                    ClientId: ifReferrerExist.id,
                    ClientUuid: ifReferrerExist.uuid,
                    userId: createData.uuid,
                    userName: createData.userName,
                    avatar: createData.avatar,
                })
            }

            await createData.save();
            res.status(httpStatus.CREATED).send({ message: "Verification link has been sent to your mailbox.", data: access})
        })

    } catch (error:any) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }

}


authController.login = async function(req:any, res:any, next) {
    const { email, password } = req.body;

    let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    
    if (!emailReg.test(email) || !password.length) {
        throw new ApiError("WRONG CREDENTIALS", httpStatus.NOT_ACCEPTABLE, "Wrong credentials")
    }

    try {
        const ifExist:ClientInterface<string> = await Client.findOne({where: {email}, include:['Referrals', 'userAccount', 'Compounding']}) as any;
        if (!ifExist) {
            throw new ApiError("NO ACCOUNT", httpStatus.NOT_ACCEPTABLE, "Account doesn't exist!")
        }

        const oldPassword = ifExist.password;
        if ( !(await helpers.comparePassword(oldPassword, password)) ) {
            throw new ApiError("WRONG PASSWORD", httpStatus.NOT_ACCEPTABLE, "Incorrect credentials")
        }

        // if blacklisted
        if (ifExist.isBlacklisted) {
            throw new ApiError("User Account Suspended", httpStatus.UNAUTHORIZED, "Sorry, this Account has been susended")
        }

        if (!ifExist.isVerified) {
            throw new ApiError("Verify Account", httpStatus.UNAUTHORIZED, "Account is not verified")
        }

        const access = await helpers.generateToken(ifExist, ifExist.uuid, ifExist.email)
        const update = await Client.update({tokens: ifExist.tokens, token: JSON.stringify(access)}, {where: {uuid: ifExist.uuid}});
        if(!update.length) return;

        res.status(httpStatus.OK).send({ message: "You've signed in successfully", userData: {
            ...helpers.filterObjectData(ifExist), 
            noRefferedUser: ifExist.Referrals?.length, 
            userAccount: ifExist.userAccount,
            compounding: ifExist.Compounding
        }, session: access})
    } catch (error) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}


authController.forgetPassword = async function(req, res, next) {
    const {email} = req.body;

    // validate email
        let emailReg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    // if valid
    try {
        if(!emailReg.test(email)){
            throw new ApiError("Invalid Email", httpStatus.NOT_ACCEPTABLE, "Email is not valid")
        }

        const ifExist:ClientInterface<string> = await Client.findOne({ where: {email} }) as any;

        if(!ifExist) {
            throw new ApiError("Not found", httpStatus.NOT_FOUND, "User was not found")
        }

        if (!ifExist.isVerified) {
            throw new ApiError("Verify Account", httpStatus.UNAUTHORIZED, "Account is not verified")
        }
        
        // if blacklisted
        if (ifExist.isBlacklisted) {
            throw new ApiError("User Account Suspended", httpStatus.UNAUTHORIZED, "Sorry this Account has been susended")
        }

        const keyToken = await helpers.createKeyToken(ifExist.uuid)
        console.log(keyToken)
        // SEND MAIL
        const template = `
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:2rem">Welcome to <b>Flutter curve</b>. Seems like you misplaced your old password?</p>
           <p style="font-weight:400;font-size:1rem;color:#212121ccc;margin-top:4rem"> Make sure you're the one that requested for <b>Forgotten Password</b>. Click the link below.</p>
           <a href="${config.APP_NAME}/forget-password?token=${keyToken}" style="text-decoration: none">
            <button style="display:flex;align-items:center;gap:1;margin-top:2rem;background:#000;border-radius:1rem;color:#fff;padding:.8rem">
                <span>Get New Password.</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 1024 1024"><path fill="#f8f8f8" d="M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L764.736 512L452.864 192a30.592 30.592 0 0 1 0-42.688zm-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0a30.592 30.592 0 0 1 0-42.752L508.736 512L196.864 192a30.592 30.592 0 0 1 0-42.688z"></path></svg></button>
            </a>
        `
        const htmlMarkup = EmailTemplate({user: ifExist.userName, template})

        // Send using cb
        send_mail("Change password link sent", htmlMarkup, email, async function(done, err) {
            if(err) {
                //throw new ApiError("Verification error", httpStatus.BAD_REQUEST,"Couldn't send Verification mail. check network connection")
                return res.status(httpStatus.BAD_REQUEST).send({message: "Couldn't send Change of Password link. check network connection"})
            }

            res.status(httpStatus.CREATED).send({ message: "Change of password link sent to mail box"})
        })
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}

export default authController;
