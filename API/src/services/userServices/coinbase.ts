var coinbase = require('coinbase-commerce-node');
import config from "../../config/config";
import handleCompoundingServices from "./handleCompoundingService";
import handleServices from "./handleServices";
  
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

static async updateById(table: any, chargeID: string, type:string, cb:(arg0:any) => void) {
    if(!chargeID) return false;

    try {
             if(type === "normal") {
                return await handleServices.successfulDepositCharge(chargeID)
             }
            await handleCompoundingServices.successfulCompoundingCharge(chargeID)
            // const { Charge, CheckOut } = (new Coinbase()).#instance();
            // // retrieve data
            // Charge.retrieve(chargeID, function (error:any, response:any) {
            //     if(error) return cb(error); // return error if any
            //     // check last status
            //     const checkStatus = response.timeline[response.timeline.length -1];
            //     // update or delete data
            //     switch (checkStatus.status.toUpperCase()) {
            //         case "EXPIRED":
            //                 table.destroy({where: {chargeID}}).catch((err:any) => cb(err))
            //                 console.log(chargeID, "Deleted.")
            //             break;

            //             case "PENDING":
            //                 table.update({status: checkStatus.status}, {where: {chargeID}}).catch((err:any) => cb(err))
            //             break;

            //             case "COMPLETED":
            //                 // QUEUE MAIL.
            //                 handleServices.successfulCharge(chargeID) // for normal deposit
                            // if(type === "normal"){
                            //     return await handleServices.successfulDepositCharge(chargeID)
                            // }
                            // await handleCompoundingServices.successfulCompoundingCharge(chargeID)
            //             break;

            //             default:
            //                table.update({status: checkStatus.status}, {where: {chargeID}}).catch((err:any) => cb(err))
            //             break;
            //     }
            // });
              console.log("🦾🦾🦾 Task Completed 🚀🚀🚀🚀🚀🚀")
        } catch (error) {
            throw error;
        }
    }
}
