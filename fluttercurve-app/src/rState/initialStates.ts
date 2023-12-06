export type userDataStateType = {
    noRefferedUser: number,
    userName: string,
    fullName: string,
    email: string,
    isVerified: boolean,
    isKyc: "APPROVED"|"DECLINED",
    isAdmin: boolean,
    currency: "USD"|"GDP",
    country: "",
    phoneNumber: "",
    referral:"",     
    avatar :"",
    investedAmt: number,
    progressAmt: number,
    userAccount: {
        totalDeposit: any
        totalWithdrawal: any,
        totalEarning: any,
    },
    userCompounding: {
        totalDeposit: any
        totalWithdrawal: any,
        totalEarning: any,
    }
}