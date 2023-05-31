var coinbase = require('coinbase-commerce-node');
import config from "../../config/config";
import { userAccountInterface } from "../../models/Users/userAccount";

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
            Charge: coinbase.resources.Charge
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

static async getAllChargeById(user: string) {
    if(!user) return;
    try {
            const { Charge } = (new Coinbase()).#instance();
            const fetchAllData: listChargesInterface<string>[] = await (await Charge.all({}));
            let usefulData:any = [];

            fetchAllData.forEach(({ id, name, timeline, metadata, created_at, description, expires_at, hosted_url }) => {
                if (metadata.customer_id === user) {
                    usefulData.push({
                        id,
                        name,
                        status: timeline[timeline.length -1],
                        metadata: metadata.customer_name,
                        created_at,
                        description,
                        expires_at,
                        hosted_url
                    });
                }
            });

            return usefulData;
        } catch (error) {
            throw error;
        }
    }
}
