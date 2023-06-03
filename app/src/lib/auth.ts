import { user } from "@/context/auth-context";
import instance from "./requestService";


interface authInterface {
    logout: (access_token: string) => Promise<Response>;
    updatePassword: (access_token: string, passwords: any) => Promise<Response>;
    updateUserInfo: (access_token: string, userInfo: any) => Promise<Response>;
    getAllSuccessfulInvesment: (access_token: string) => Promise<Response>;
    uploadAvatar: (access_token: string, imageData: any) => Promise<Response>;
    getACompoundingPlans: (access_token: string, uuid: string) => Promise<Response>;
    getCompoundingPlans: (access_token: string) => Promise<Response>;
    getDepositPlans: (access_token: string) => Promise<Response>;
    getActiveDeposit: (access_token: string) => Promise<Response>;
    getRefferedUser: (access_token: string) => Promise<Response>;
    isAuthenticated: (access_token: string) => Promise<Response>;
    checkVerifedUser: (token: string) => Promise<Response>;
    getAllDepositRequest: (token: string) => Promise<Response>;
    newDepositRequest: (token: string, chargeData: any) => Promise<Response>;
}
var auth = {} as authInterface;

auth.checkVerifedUser = async function(token: string) {
    return await instance.get(`/client/verifyUserAccount?token=${token}`)
}

auth.isAuthenticated = async function(access_token: string) {
    console.log(`${process.env.BASE_URI}/client/me`)
    return await fetch(`${process.env.BASE_URI}/client/me`, {method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}


auth.uploadAvatar = async function(access_token: string, imageData: any) {
    return await instance.post(`/client/uploadAvatar`,  imageData, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getRefferedUser = async function(access_token: string) {
    return await instance.get(`/client/getReferredUser`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.updateUserInfo = async function(access_token: string, userInfo: any) {
    return await instance.post(`/client/updateUserInfo`, userInfo, {headers: {Authorization: `Bearer ${access_token}`}})
}


auth.updatePassword = async function(access_token: string, passwords: any) {
    return await instance.post(`/client/updatePassword`, passwords, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.logout = async function(access_token: string) {
    return await instance.post(`/client/logout`, {headers: {Authorization: `Bearer ${access_token}`}})
}


auth.getActiveDeposit = async function(access_token: string) {
    return await instance.get(`/service/getActiveDeposit`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getDepositPlans = async function(access_token: string) {
    return await instance.get(`/service/getDepositPlans`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getCompoundingPlans = async function(access_token: string) {
    return await instance.get(`/compounding/getCompoundingPlans`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getACompoundingPlans = async function(access_token: string, uuid:string) {
    return await instance.get(`/compounding/getACompoundingPlans?calculateId=${uuid}`, {headers: {Authorization: `Bearer ${access_token}`}})
}


auth.getAllDepositRequest = async function(access_token: string) {
    return await instance.get(`/service/getAllDepositRequest`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getAllSuccessfulInvesment = async function(access_token: string) {
    return await instance.get(`/service/getAllSuccessfulInvesment`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.newDepositRequest = async function(access_token: string, chargeAPIData:any) {
    return await instance.post(`/service/newDepositRequest`, chargeAPIData, {headers: {Authorization: `Bearer ${access_token}`}})
}
export default auth;