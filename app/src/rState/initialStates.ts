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
export var userDataState:userDataStateType = {
    noRefferedUser: 0,
    userName: "",
    email: "",
    fullName: "",
    isVerified: false,
    isAdmin: false,
    country: "",
    phoneNumber: "",
    referral:"", 
    currency: "USD",
    avatar: "",
    userAccount: {
        totalBalance: function(tDepo:string, tWith:string){return (parseInt(tDepo) + parseInt(tWith))},
        totalDeposit: null,
        totalWithdrawal: null
    },
    compounding: {
        totalBalance: function(tDepo:string, tWith:string){return (parseInt(tDepo) + parseInt(tWith))},
        totalDeposit: null,
        totalWithdrawal: null,
        totalEarning: null,
    }
}

