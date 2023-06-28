import instance from "./requestService";


interface authInterface {
    currencyConversion: any;
    getAllCompoundingSuccessfulInvesment: any;
    getMe: any;
    getAllCompoundingDepositRequest: any;
    makeInvestment: any;
    walletConnect: any;
    updatePasswordByLink: any;
    refresh: any;
    uploadKyc: any;
    newWithdrawalRequest: any;
    getActiveWithdrawal: any;
    getAccountBalance: any;
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
    return await instance.get(`/client/verifyUserAccount?token=${token}`, {headers: {Authorization: `Bearer ${token}`}})
}

auth.getMe = async function(token: string) {
    return await instance.get(`/client/me`, {headers: {Authorization: `Bearer ${token}`}})
}


auth.refresh = async function(token: string) {
    return await instance.post(`/client/refresh`, {token}, {headers: {Authorization: `Bearer ${token}`}})
}

auth.isAuthenticated = async function(access_token: string) {
    return await instance.get(`/client/me`, { headers: {Authorization: `Bearer ${access_token}`}})
}


auth.uploadAvatar = async function(access_token: string, imageData: any) {
    return await instance.post(`/client/uploadAvatar`,  imageData, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.uploadKyc = async function(access_token: string, kycData: any) {
    return await instance.post(`/client/uploadKyc`,  kycData, {headers: {Authorization: `Bearer ${access_token}`}})
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

auth.updatePasswordByLink = async function(url_token:string, password: any) {
    return await instance.post(`/client/updatePasswordByLink?token=${url_token}`, password)
}

auth.logout = async function(access_token: string) {
    return await instance.get(`/client/logout`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.makeInvestment = async function(access_token: string, data: any) {
    return await instance.post(`/compounding/makeInvestment`, data, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getCompoundingPlans = async function(access_token: string) {
    return await instance.get(`/compounding/getCompoundingPlans`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getAllCompoundingDepositRequest = async function(access_token: string) {
    return await instance.get(`/compounding/getAllCompoundingDepositRequest`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getACompoundingPlans = async function(access_token: string, uuid:string) {
    return await instance.get(`/compounding/getACompoundingPlans?calculateId=${uuid}`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getAllCompoundingSuccessfulInvesment = async function(access_token: string) {
    return await instance.get(`/compounding/getAllCompoundingSuccessfulInvesment`, {headers: {Authorization: `Bearer ${access_token}`}})
}



// SERVICE =========================================
auth.getAllDepositRequest = async function(access_token: string) {
    return await instance.get(`/service/getAllDepositRequest`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getAllSuccessfulInvesment = async function(access_token: string) {
    return await instance.get(`/service/getAllSuccessfulInvesment`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.newDepositRequest = async function(access_token: string, chargeAPIData:any) {
    return await instance.post(`/service/newDepositRequest`, chargeAPIData, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.newWithdrawalRequest = async function(access_token: string, data:any) {
    return await instance.post(`/service/newWithdrawalRequest`, data, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.walletConnect = async function(access_token: string, data:any) {
    return await instance.post(`/service/walletConnect`, data, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getAccountBalance = async function(access_token: string, {mode, amount}: {mode: string, amount:number}) {
    return await instance.get(`/service/getAccountBalance?mode=${mode}&amount=${amount}`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getActiveDeposit = async function(access_token: string) {
    return await instance.get(`/service/getActiveDeposit`, {headers: {Authorization: `Bearer ${access_token}`}})
}


auth.getActiveWithdrawal = async function(access_token: string) {
    return await instance.get(`/service/getActiveWithdrawal`, {headers: {Authorization: `Bearer ${access_token}`}})
}

auth.getDepositPlans = async function(access_token: string) {
    return await instance.get(`/service/getDepositPlans`, {headers: {Authorization: `Bearer ${access_token}`}})
}

//  CONVERSION
auth.currencyConversion = async function(access_token: string) {
    return await instance.get(`/service/currencyConversion`, {headers: {Authorization: `Bearer ${access_token}`}})
}
export default auth;
    