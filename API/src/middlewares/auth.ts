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
         const decoded:{id: string, email: string} = await jwt.verify(bearerToken, config.JWT_SECRETKEY) as any;
         //check user
         const ifUserExist:ClientInterface<string> = await ClientModel.findOne({where: {uuid: decoded.id} }) as any;

         if(!ifUserExist) {
             throw new ApiError("Unauthorized user", httpStatus.NOT_FOUND, "We couldn't find user")
         }

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
         next()
     }else {
         throw new ApiError("Unauthorization user", httpStatus.UNAUTHORIZED, "no bearer token")
     }
 } catch (error) {
    res.status(httpStatus.BAD_REQUEST).send(error)
 }
}


export {UserAuth};

