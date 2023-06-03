var coinbase = require('coinbase-commerce-node');
import config from "../../config/config";
import userDeposit from "../../models/Users/deposit";
import { userAccountInterface } from "../../models/Users/userAccount";
import axios from "axios"
  
export interface chargeInterface<T> {
    description: T;
    metadata: {
        customer_id: T;
        customer_name: T;
    };
    name: T;
    payments?: any[];
    pricing_type: 'fixed_price' | 'no_price';
    local_price: {
    amount: T;
    currency: 'USD' | 'GBP';
};
}

interface listChargesInterface<T> {
    id: T;
    name: T;
    pricing: {
    };
    timeline: [{
    status: 'NEW' | 'PENDING' | 'SUCCESSFUL';
    time: T;
    }];
    metadata: {
    customer_id: T;
    customer_name: T;
    };
    created_at: T;
    description: T;
    expires_at: T;
    hosted_url: T;
}

export default class Coinbase {
    #API_KEY: string = config.COINBASE_APIKEY;
    #instance() {
    const Client = coinbase.Client;
    Client.init((new Coinbase()).#API_KEY);
        return {
            Charge: coinbase.resources.Charge,
            CheckOut: new (coinbase.resources.Checkout)
        };
    }

static async createCharge(data: chargeInterface<string>) {
    try {
        const { Charge } = (new Coinbase()).#instance();
       
        const createChargeObj = new Charge(data);

        const response = await createChargeObj.save();
        return createChargeObj;
    } catch (error) {
        throw error;
    }
}

static async updateById(chargeID: string, cb:(arg0:any) => void) {
    if(!chargeID) return false;
    try {
            const { Charge, CheckOut } = (new Coinbase()).#instance();
            // retrieve data
            Charge.retrieve(chargeID, function (error:any, response:any) {
                if(error) return cb(error); // return error if any
                // check last status
                console.log(response)
                const checkStatus = response.timeline[response.timeline.length -1];
                // update or delete data
                switch (checkStatus.status.toUpperCase()) {
                    case "EXPIRED":
                        /// if data expired update
                        // let config = {
                        //     method: 'delete',
                        //     url: `https://api.commerce.coinbase.com/checkouts/${chargeID}`,
                        //     headers: { 
                        //       'Content-Type': 'application/json', 
                        //       'Accept': 'application/json',
                        //       'X-CC-Version': '2018-03-22',
                        //       'X-CC-Api-Key': (new Coinbase()).#API_KEY
                        //     }
                        //   };
                          
                        //   console.log(config)
                        //   axios(config)
                        //   .then((response) => {
                        //     console.log(response.data)
                            userDeposit.destroy({where: {chargeID}}).catch((err) => cb(err))
                            console.log(chargeID, "Deleted.")
                        //   })
                        //   .catch((error) => {
                        //     // cb(error);
                        //   });
                        break;

                        case "PENDING":
                            userDeposit.update({status: checkStatus.status}, {where: {chargeID}}).catch((err) => cb(err))
                        break;

                        case "COMPLETED":
                            userDeposit.update({status: "SUCCESSFUL"}, {where: {chargeID}}).catch((err) => cb(err))
                        break;

                        default:
                           userDeposit.update({status: checkStatus.status}, {where: {chargeID}}).catch((err) => cb(err))
                        break;
                }
              });
              console.log("🦾🦾🦾 Task Completed 🚀🚀🚀🚀🚀🚀")
        } catch (error) {
            throw error;
        }
    }
}
