import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import Client, { ClientInterface } from '../models/Users/users';
import ApiError from './ApiError';
import httpStatus from 'http-status';
import crypto from 'node:crypto'
type countryType = {
  "name": string,
  "dial_code": string,
  "code": string
}
const country:countryType[] = require('../services/country')


interface helpersInterface {
    generateInvoiceId(): unknown;
    countryDialCode: (iso3: string) => void;
    createKeyToken: (user: any, conf: any, id: string) => Promise<any>;
    generateRefreshToken: (accessToken: any, req: any) => Promise<{ accessToken: string; } | undefined>;
    comparePassword(oldPassword: string, password: any): unknown;
    toJsonString: (obj?: any, str?: string | undefined) => any;
    generateToken: (createData: ClientInterface<string>, id: string, email: string) => Promise<{ accessToken: string; } | undefined>;
    filterObjectData: (createData: ClientInterface<string>, access?:any, refresh?: any) => any;
    hashPassword: (password: string) => Promise<string>;

}

let helpers = {} as helpersInterface;

helpers.hashPassword = async function(password:string) {
    const saltRounds = 8;
    return await bcrypt.hash(password, saltRounds)
}

helpers.generateToken = async function(createData, id:string, email:string) {
    try {
        const payload = {id, email}
        
        if(!id || !email) throw new ApiError(`something wrong with ${id} or ${email}`, httpStatus.BAD_REQUEST)
        // const privateKey = await fs.readFileSync(path.join(path.resolve(__dirname, "../.."), "/cert/key.pem"));
        var token:any = await jwt.sign(payload, config.JWT_SECRETKEY, {expiresIn: config.JWT_EXPIRES_IN});
        if(token){
            token = {accessToken: token};
            const convertToObj = !createData.tokens ? JSON.stringify([token]) : JSON.stringify([...JSON.parse(createData.tokens), token])
            createData.tokens = convertToObj;
            createData.token = JSON.stringify(token)
            return token;
        }
    } catch (error:any) {
        console.log(error)
        throw new Error(error)
    }
}

helpers.filterObjectData = function(createData:ClientInterface<string>, access:any, refresh:any) {
    return {
        fullName: createData.fullName,
        userName: createData.userName,
        country: createData.country,
        email: createData.email,
        phoneNumber: createData.phoneNumber,
        referral: createData.referral,        
        avatar: createData.avatar,
        isVerified: createData.isVerified,
        blacklisted: createData.isBlacklisted,
        accessTokens: access?.accessToken,
        refreshToken: refresh?.refreshToken,
        currency: createData.currency,
        isAdmin: createData.isAdmin
    }
}


helpers.comparePassword = async function(oldPassword, newPassword) {
    try {
        const compare = await bcrypt.compare(newPassword, oldPassword);
        return compare;
    } catch (error) {
        throw new ApiError("Error with comparing password", httpStatus.BAD_REQUEST, error)
    }
}


helpers.generateRefreshToken = async function({accessToken}, req) {
    // verify token
    const decoded:{id: string, email: string} = await jwt.verify(accessToken, config.JWT_SECRETKEY) as any;
    console.log(decoded.id, req.id)
    if(decoded.id === req.id) {
        const data:ClientInterface<string> = await Client.findOne({where: {uuid: decoded.id}}) as any;
        if(!data) throw new ApiError(`Can't grant request of unauthenticated user`, httpStatus.NOT_FOUND);
        // get fresh token
        const freshtoken = this.generateToken(data, data.uuid, data.email);
        console.log(freshtoken)
        // Permission granted: Log that accessToken out.
        let convertToJson:any = JSON.parse(data.tokens);
        convertToJson.filter((findAccessToken: {accessToken: string}, i:number) => {
            if(findAccessToken === accessToken){
                convertToJson.splice(i, 1);
                convertToJson = JSON.stringify(convertToJson);
            }
        })
        // Update changes.
        Client.update({tokens: convertToJson}, {where: {uuid: data.uuid}});

        return freshtoken;
    }
}


helpers.createKeyToken = async function(user,conf, id:string) {
    let token = await crypto.createHash("SHA256").update(conf.JWT_SECRETKEY + (Date.now())).digest("hex")
    if(id){
        await Client.update({oneTimeKeyToken: token}, {where: {uuid: id}})
    }
    return token;
}

helpers.countryDialCode = function(iso3:string) {
    return new Promise((resolve, reject) => {
        country.forEach(({code, dial_code, name}) => {
            if(code === iso3) return resolve({code,dial_code,name});
        });
        reject(null);
    })
}

helpers.generateInvoiceId = function() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const length = 8;
    let invoiceId = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      invoiceId += characters[randomIndex];
    }
  
    return invoiceId;
  }
  
export default helpers;