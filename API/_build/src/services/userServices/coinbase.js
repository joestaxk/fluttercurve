"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Coinbase_instances, _Coinbase_API_KEY, _Coinbase_instance;
Object.defineProperty(exports, "__esModule", { value: true });
var coinbase = require('coinbase-commerce-node');
const config_1 = __importDefault(require("../../config/config"));
const deposit_1 = __importDefault(require("../../models/Users/deposit"));
class Coinbase {
    constructor() {
        _Coinbase_instances.add(this);
        _Coinbase_API_KEY.set(this, config_1.default.COINBASE_APIKEY);
    }
    static createCharge(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Charge } = __classPrivateFieldGet((_a = (new Coinbase())), _Coinbase_instances, "m", _Coinbase_instance).call(_a);
                const createChargeObj = new Charge(data);
                const response = yield createChargeObj.save();
                return createChargeObj;
            }
            catch (error) {
                throw error;
            }
        });
    }
    static updateById(chargeID, cb) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!chargeID)
                return false;
            try {
                const { Charge, CheckOut } = __classPrivateFieldGet((_a = (new Coinbase())), _Coinbase_instances, "m", _Coinbase_instance).call(_a);
                // retrieve data
                Charge.retrieve(chargeID, function (error, response) {
                    if (error)
                        return cb(error); // return error if any
                    // check last status
                    console.log(response);
                    const checkStatus = response.timeline[response.timeline.length - 1];
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
                            deposit_1.default.destroy({ where: { chargeID } }).catch((err) => cb(err));
                            console.log(chargeID, "Deleted.");
                            //   })
                            //   .catch((error) => {
                            //     // cb(error);
                            //   });
                            break;
                        case "PENDING":
                            deposit_1.default.update({ status: checkStatus.status }, { where: { chargeID } }).catch((err) => cb(err));
                            break;
                        case "COMPLETED":
                            deposit_1.default.update({ status: "SUCCESSFUL" }, { where: { chargeID } }).catch((err) => cb(err));
                            break;
                        default:
                            deposit_1.default.update({ status: checkStatus.status }, { where: { chargeID } }).catch((err) => cb(err));
                            break;
                    }
                });
                console.log("🦾🦾🦾 Task Completed 🚀🚀🚀🚀🚀🚀");
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Coinbase;
_Coinbase_API_KEY = new WeakMap(), _Coinbase_instances = new WeakSet(), _Coinbase_instance = function _Coinbase_instance() {
    const Client = coinbase.Client;
    Client.init(__classPrivateFieldGet((new Coinbase()), _Coinbase_API_KEY, "f"));
    return {
        Charge: coinbase.resources.Charge,
        CheckOut: new (coinbase.resources.Checkout)
    };
};
