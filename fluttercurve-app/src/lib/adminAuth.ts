import helpers from "../helpers";
import instance from "./requestService";


interface adminAuthInterface {
    deleteExisitngPlan: any;
    updateExitingPlan: any;
    createNewPlan: any;
    testRunApiKey: any;
    getCoinBaseApiKey: any;
    createOrUpdateCoinBaseApiKey: any;
    updateOngoingInvestment: any;
    deleteMultipleUsers: any;
    deleteSingleUser: any;
    deleteAllNotification: any;
    getAllUnmarkNotification: any;
    markAllAsRead: any;
    manualApproval: any;
    deliverMails: any;
    getNotification: any;
    makeBoss: any;
    getuserAccountBalance: any;
    getAdminUser: any;
    suspendAccount: any;
    getUserWallets: any;
    authorizeKyc: any;
    getKycDetails: any;
    suspendUserDeposit: any;
    getAllUserDeposit: any;
    getAllActiveDeposit: any;
    getUser: any;
    getAllUser: any;
    getAllUserCount: any;
}


var adminAuth = {} as adminAuthInterface;


/**
 * GET TOTAL COUNTS
 * @method GET
 * Dashboard path
 */

adminAuth.getAllUserCount = async () => await instance.get('/admin/getAllUserCount', {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})

adminAuth.getAllUser = async (page:number) => await instance.get(`/admin/getAllUsers?page=${page}`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})

adminAuth.getAdminUser = async () => await instance.get(`/admin/getAdminUser`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.deliverMails = async (header:string,message:string) => await instance.post(`/admin/deliverMails`, {header,message}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})

adminAuth.getUser = async (id:string) => await instance.post(`/admin/getUser`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getAllUserDeposit = async (id:string) => await instance.post(`/admin/getAllUserDeposit`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getAllActiveDeposit = async () => await instance.get(`/admin/getAllActiveDeposit`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})

// crud operation
adminAuth.createNewPlan = async (reqBody:any) => await instance.post(`/service/createNewPlan`, {...reqBody}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.updateExitingPlan = async (reqBody:any) => await instance.post(`/service/updateExitingPlan`, {...reqBody}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.deleteExisitngPlan = async (id:any) => await instance.post(`/service/deleteExisitngPlan`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})

adminAuth.suspendUserDeposit = async (id:string, investmentCompleted: boolean) => await instance.post(`/admin/suspendUserDeposit`, {chargeID:id, investmentCompleted}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.manualApproval = async (id:string, type: boolean) => await instance.post(`/admin/manualApproval`, {chargeID:id, type}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getKycDetails = async (id:string) => await instance.post(`/admin/getKycDetails`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.authorizeKyc = async (id:string, isKyc:string) => await instance.post(`/admin/authorizeKyc`, {id, isKyc}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getUserWallets = async (id:string) => await instance.post(`/admin/getUserWallets`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.suspendAccount = async (id:string, suspend:boolean) => await instance.post(`/admin/suspendAccount`, {id, suspend}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.makeBoss = async (id:string, admin: boolean) => await instance.post(`/admin/makeBoss`, {id, admin}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getNotification = async () => await instance.get(`/admin/getNotification`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getuserAccountBalance = async (id:string) => await instance.post(`/admin/getuserAccountBalance`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
// @notifications
adminAuth.markAllAsRead = async () => await instance.post(`/admin/markAllAsRead`, {}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getAllUnmarkNotification = async () => await instance.get(`/admin/getAllUnmarkNotification`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.deleteAllNotification = async () => await instance.get(`/admin/deleteAllNotification`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
//@delete user
adminAuth.deleteSingleUser = async (id:string) => await instance.post(`/admin/deleteSingleUser`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.deleteMultipleUsers = async (userIds:string[]) => await instance.post(`/admin/deleteMultipleUsers`, {userIds}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
// @update ongoing investment
adminAuth.updateOngoingInvestment = async (data: any) => await instance.post(`/admin/updateOngoingInvestment`, {data}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
// @post coinbaase api
adminAuth.createOrUpdateCoinBaseApiKey = async (data: any) => await instance.post(`/service/createOrUpdateCoinBaseApiKey`, data, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getCoinBaseApiKey = async () => await instance.get(`/service/getCoinBaseApiKey`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
// test coinbase key
adminAuth.testRunApiKey = async () => await instance.get(`/service/testRunApiKey`, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})



export default adminAuth