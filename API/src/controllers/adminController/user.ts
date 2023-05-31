import httpStatus from "http-status";
import config from "../../config/config"
import Client from "../../models/Users/users";
import ApiError from "../../utils/ApiError";

export default class ADMIN_CONTROLLER {
    static async RegisterAdmin() {
        const getDATA = config.ADMIN;
        try {
            const isAdmin = await Client.findOne({where: {username: getDATA.userName}})
            if(!isAdmin) {
                // create one
                const iamadmin = await Client.create(getDATA);
                iamadmin.save();
            }
        } catch (error) {
           throw new ApiError("Admin error", httpStatus.BAD_REQUEST, error);
        }
    }
}
