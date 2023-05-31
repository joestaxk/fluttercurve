"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Declare route
// const authAdmin = require("./auth/admin")
// USER - [CLIENT, ADMIN]
// const AdminUser = require("./users/admin")
// Define default paths
const definePath = [
    {
        path: "/client/auth",
        route: require("./auth/client")
    },
    {
        path: "/client",
        route: require("./users/client")
    },
    {
        path: "/service",
        route: require("./service")
    },
    {
        path: "/compounding",
        route: require("./mode")
    }
    //  {
    //     path: "/admin/auth",
    //     route: authAdmin
    //  },
    //  {
    //     path: "/errander",
    //     route: AdminUser
    //  },
];
definePath.forEach(({ path, route }) => {
    router.use(path, route);
});
exports.default = router;
