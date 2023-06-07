import Router from  'express'

const router = Router.Router();
// Declare route
// const authAdmin = require("./auth/admin")

// USER - [CLIENT, ADMIN]
// const AdminUser = require("./users/admin")

// Define default paths
const definePath = [
 {
     path: "/client/auth",
     route: require("./auth/user")
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
]


definePath.forEach(({path, route}) => {
    router.use(path, route)
})

export default router

