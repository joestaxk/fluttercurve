import helpers from "../helpers";
import instance from "./requestService";


interface adminAuthInterface {
    makeBoss: any;
    getuserAccountBalance: any;
    getAdminUser: any;
    suspendAccount: any;
    getUserWallets: any;
    authorizeKyc: any;
    getKycDetails: any;
    suspendUserDeposit: any;
    getAllUserDeposit: any;
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

adminAuth.getUser = async (id:string) => await instance.post(`/admin/getUser`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getAllUserDeposit = async (id:string) => await instance.post(`/admin/getAllUserDeposit`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.suspendUserDeposit = async (id:string, investmentCompleted: boolean) => await instance.post(`/admin/suspendUserDeposit`, {chargeID:id, investmentCompleted}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getKycDetails = async (id:string) => await instance.post(`/admin/getKycDetails`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.authorizeKyc = async (id:string, isKyc:string) => await instance.post(`/admin/authorizeKyc`, {id, isKyc}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getUserWallets = async (id:string) => await instance.post(`/admin/getUserWallets`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.suspendAccount = async (id:string, suspend:boolean) => await instance.post(`/admin/suspendAccount`, {id, suspend}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.makeBoss = async (id:string, admin: boolean) => await instance.post(`/admin/makeBoss`, {id, admin}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})
adminAuth.getuserAccountBalance = async (id:string) => await instance.post(`/admin/getuserAccountBalance`, {id}, {headers: {Authorization: `Bearer ${helpers.getCookie('xat')}`}})



export default adminAuth