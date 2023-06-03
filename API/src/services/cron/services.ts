import userDeposit from "../../models/Users/deposit";
import Coinbase from "../userServices/coinbase";

interface cronServiceInterface {
    depositService: () => Promise<void>;
}


var cronService = {} as cronServiceInterface;




cronService.depositService = async function() {
    try {
        const deposit: any[] = await userDeposit.findAll({where: {status: "NEW"}});
        if(!deposit.length) {
          return console.log("Keep waiting for Task 🚻🚻🚻🚻🚻🚻🚻")
        }
        for(let i = 0; i < deposit.length; ++i) {
            Coinbase.updateById(deposit[i].chargeID, function(err) {
                console.log(err, "error occured during cron")
            })
        }
    } catch (error) {
        throw error
    }
}



export default cronService;