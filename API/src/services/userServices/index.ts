import userAccount from "../../models/Users/userAccount";
import Account from "../../models/Users/userAccount";


interface UserAccountInterface {
    currency: { $: string; "£": string; };
    gatherUserData: (id: string) => Promise<void>;
};

var userAccountSetting = {} as UserAccountInterface;

userAccountSetting.currency = {
    "$": "dollar",
    "£" : "GBP"
}


userAccountSetting.gatherUserData = async function(id: string) {
    let data = {
        balance: 0,
        totalDeposit: 0,
        totalWithdrawal: 0,
        numberOfReferal: 0,
    }

    const userAccModel = userAccount.findOne({where: {userId: id}})
}