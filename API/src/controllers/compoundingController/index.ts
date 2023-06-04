import httpStatus from "http-status";
import ApiError from "../../utils/ApiError";
import helpers from "../../utils/helpers";
import compoundingPlans from "../../models/mode/compoundingPlans";


interface compoundongControllerInterface {
    getACompoundingPlans: (req: any, res: any, next: any) => Promise<void>;
    getCompoundingPlans: (req: any, res: any, next: any) => Promise<void>;
    makeInvestment: (req: any, res: any, next: any) => Promise<void>;
}

var compoundingController = {} as compoundongControllerInterface;

compoundingController.makeInvestment = async function(req,res,next) {

}


compoundingController.getCompoundingPlans = async function(req,res,next) {
    try {
        // create the first and data for the plans.
        const ifExist = await compoundingPlans.findAll();
        if(ifExist.length) {
          res.send(ifExist) 
        }
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}


compoundingController.getACompoundingPlans = async function(req,res,next) {
    try {
        const uuid = req.query.calculateId;
        console.log(uuid)
        // create the first and data for the plans.
        const ifExist = await compoundingPlans.findOne({where: {uuid}});
        if(ifExist) {
          res.send(ifExist) 
        }
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send(error)
    }
}



export default compoundingController;