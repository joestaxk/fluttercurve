import instance from "./requestService";


interface authInterface {
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
const BASE_URL    = "http://localhost:3000/v1/";
export const PUBLIC_PATH = "http://localhost:3000/"

auth.checkVerifedUser = async function(token: string) {
    return await fetch(`${BASE_URL}client/verifyUserAccount?token=${token}`, { method: "GET" })
}

auth.isAuthenticated = async function(access_token: string) {
    return await fetch(`${BASE_URL}client/me`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}


auth.uploadAvatar = async function(access_token: string, imageData: any) {
    return await fetch(`${BASE_URL}client/uploadAvatar`, { method: "POST", body: imageData,  headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getRefferedUser = async function(access_token: string) {
    return await fetch(`${BASE_URL}client/getReferredUser`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getActiveDeposit = async function(access_token: string) {
    return await fetch(`${BASE_URL}service/getActiveDeposit`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getDepositPlans = async function(access_token: string) {
    return await fetch(`${BASE_URL}service/getDepositPlans`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getCompoundingPlans = async function(access_token: string) {
    return await fetch(`${BASE_URL}compounding/getCompoundingPlans`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getACompoundingPlans = async function(access_token: string, uuid:string) {
    return await fetch(`${BASE_URL}compounding/getACompoundingPlans?calculateId=${uuid}`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}


auth.getAllDepositRequest = async function(access_token: string) {
    return await fetch(`${BASE_URL}service/getAllDepositRequest`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getAllSuccessfulInvesment = async function(access_token: string) {
    return await fetch(`${BASE_URL}service/getAllSuccessfulInvesment`, { method: "GET", headers: {Authorization: `Bearer ${access_token}`}})
}

auth.newDepositRequest = async function(access_token: string, chargeAPIData:any) {
    return await instance.post(`/service/newDepositRequest`, chargeAPIData, {headers: {Authorization: `Bearer ${access_token}`}})
}
export default auth;