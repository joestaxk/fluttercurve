import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../config/config";

import ClientModel, { ClientInterface } from "../models/Users/users";
import ApiError from "../utils/ApiError"

// Client Authorization Handler
const UserAuth = async function(req: any,res:any,next:any) {
    const bearerToken:string = req.headers['authorization']?.replace("Bearer ", "");
  // DO SOME JWT VERIFICATION
 try {
     if(bearerToken) {
         const decoded:{id: string, email: string, exp:number} = await jwt.verify(bearerToken, config.JWT_SECRETKEY) as any;
         
         //check user
         const ifUserExist:ClientInterface<string> = await ClientModel.findOne({where: {uuid: decoded.id} }) as any;

         if(!ifUserExist) {
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "We couldn't find user")
         }

         const currentTimestamp: number = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds

        // Calculate the remaining time until expiration in minutes
        const remainingMinutes: number = Math.floor((decoded.exp - currentTimestamp) / 60);

        // if (remainingMinutes <= 20) {
        //     console.log('Token is expiring within the next 20 minutes.');
        //     //  send off refresh token
        // } else {
        //     console.log('Token is still valid or has more than 20 minutes remaining until expiration.');
        // }

        //  // check if token is registered
        const convertToJson = JSON.parse(ifUserExist.tokens);
        if(!convertToJson.length) {
            throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Account has been logged out")
        }
  

        const srch = convertToJson.filter((accessToken:any) => bearerToken === accessToken.accessToken);
        
        if(!srch || !srch.length) {
            throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Account has been logged out")
        }


         // if user isBlacklisted
         if(ifUserExist.isBlacklisted){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Sorry this Account has been susended")
         }

         if(!ifUserExist.isVerified){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Unverified account, You are not meant to be here")
         }

         req.id = ifUserExist.uuid;
         req.userName = ifUserExist.userName
         req.email = ifUserExist.email
         next()
     }else {
         throw new ApiError("Unauthorization user", httpStatus.UNAUTHORIZED, "no bearer token")
     }
 } catch (error:any) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}




// Client Authorization Handler
const AdminAuth = async function(req: any,res:any,next:any) {
    const bearerToken:string = req.headers['authorization']?.replace("Bearer ", "");
  // DO SOME JWT VERIFICATION
 try {
     if(bearerToken) {
         const decoded:{id: string, email: string, exp:number} = await jwt.verify(bearerToken, config.JWT_SECRETKEY) as any;
         
         //check user
         const ifUserExist:ClientInterface<string> = await ClientModel.findOne({where: {uuid: decoded.id} }) as any;

         if(!ifUserExist) {
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "We couldn't find user")
         }

         const currentTimestamp: number = Math.floor(Date.now() / 1000); // Get the current timestamp in seconds

        // Calculate the remaining time until expiration in minutes
        const remainingMinutes: number = Math.floor((decoded.exp - currentTimestamp) / 60);

        // if (remainingMinutes <= 20) {
        //     console.log('Token is expiring within the next 20 minutes.');
        //     //  send off refresh token
        // } else {
        //     console.log('Token is still valid or has more than 20 minutes remaining until expiration.');
        // }

        // check if token is registered
        const convertToJson = JSON.parse(ifUserExist.tokens);
        if(!convertToJson.length) {
            throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Account has been logged out")
        }
  

        const srch = convertToJson.filter((accessToken:any) => bearerToken === accessToken.accessToken);
        
        if(!srch || !srch.length) {
            throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Account has been logged out")
        }


         // if user isBlacklisted
         if(ifUserExist.isBlacklisted){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Sorry this Account has been susended")
         }

         if(!ifUserExist.isAdmin){
             throw new ApiError("Unauthorized user", httpStatus.UNAUTHORIZED, "Unverified account, You are not meant to be here")
         }

         req.id = ifUserExist.uuid;
         next()
     }else {
         throw new ApiError("Unauthorization user", httpStatus.UNAUTHORIZED, "no bearer token")
     }
 } catch (error:any) {
        console.log(error)
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}


export {UserAuth, AdminAuth};

