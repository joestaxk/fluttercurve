import { Sequelize } from 'sequelize'
import config from "../config/config"
import ADMIN_CONTROLLER from '../controllers/adminController/user';

export const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASS, {
    host: 'localhost',
    port: config.DB_PORT,
    dialect: 'mysql'
})

async function doThisFirst() {
    try {
        ADMIN_CONTROLLER.RegisterAdmin();
        //build deposit plans
    } catch (error) {
        console.log(`Coming from doThisFirst function:-`, error)
    }

}

async function authenticate(){
    try {
       await sequelize.authenticate();
       await sequelize.sync()
       console.log("Connection has been established successfully");
       await doThisFirst();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default authenticate;
