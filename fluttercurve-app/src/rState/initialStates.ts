export type userDataStateType = {
    noRefferedUser: number,
    userName: string,
    fullName: string,
    email: string,
    isVerified: boolean,
    isAdmin: boolean,
    currency: "USD"|"GDP",
    country: "",
    phoneNumber: "",
    referral:"",     
    avatar :"",
    userAccount: {
        totalBalance: (tDepo:string, tWith:string) => number,
        totalDeposit: string|null
        totalWithdrawal: string|null
    },
    compounding: {
        totalBalance: (tDepo:string, tWith:string) => number,
        totalDeposit: string|null
        totalWithdrawal: string|null,
        totalEarning: string|null,
    }
}