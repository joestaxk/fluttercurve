/**
 * @todo
 *  Before i deploy i must change some stting on app uri.
 * for the mail. esp.
 */


interface modeType<T> {
   PORT?:    string|number,
   APP_NAME?: T,
   APP_URI?: T,
   DB_USER?: T,
   DB_PASS?: T,
   DB_NAME?: T,
   DB_PORT?: number,

   NODE_ENV?:  T,
   MAIL_HOST?: T,
   MAIL_PORT?: T,
   MAIL_USER?: T,
   MAIL_PASS?: T 
}

interface x<T> {
    ProcessEnv: T,
    PORT: number|string,
    APP_NAME?: T,
    APP_URI?: T,
    APP_DEV_URI?: T,

    NODE_ENV?: "production"|"development",
    JWT_SECRETKEY: T,
    JWT_EXPIRES_IN: T,
    JWT_REFRESH_EXPIRES_IN: T,
    DB_LOCAL_USER?: T,
    DB_LOCAL_PASS?: T,
    DB_LOCAL_NAME?: T,
    DB_LOCAL_PORT?: T,

    DB_USER?: T,
    DB_PASS?: T,
    DB_NAME?: T,
    DB_PORT?: number,

    MAIL_TEST_HOST?: T,
    MAIL_TEST_PORT?: T,
    MAIL_TEST_USER?: T,
    MAIL_TEST_PASS?: T,

    MAIL_HOST?: T,
    MAIL_PORT?: T,
    MAIL_USER?: T,
    MAIL_PASS?: T,

    ADMIN_USERNAME?: T,
    ADMIN_PASSWORD?:  T,
    ADMIN_EMAIL: T,

    COINBASE_API: T,
    FIXER_API: T
}

const _:x<string> = process.env as any;

const ADMIN_DATA = {
   "fullName": "flutter curve",
   "userName": _.ADMIN_USERNAME,
   "email": _.ADMIN_EMAIL,
   "phoneNumber": "2348000000",
   "country": "US",
   "annualIncome": 1000000,
   "currency": "USD",
   "password": _.ADMIN_PASSWORD,
   "isVerified": true,
   "isKyc": true,
   "isConnectWallet": true,
   "referral": "",
   "isAdmin": true,
   "owner": true,
}

const developmentMode:modeType<any> = {
   PORT: _.PORT,
   APP_NAME: _.APP_NAME,
   APP_URI: _.APP_DEV_URI,
   DB_USER: _.DB_LOCAL_USER,
   DB_PASS: _.DB_LOCAL_PASS,
   DB_NAME: _.DB_LOCAL_NAME,
   DB_PORT: _.DB_LOCAL_PORT as unknown as number,

   MAIL_HOST: _.MAIL_TEST_HOST,
   MAIL_PORT: _.MAIL_TEST_PORT,
   MAIL_USER:  _.MAIL_TEST_USER,
   MAIL_PASS:  _.MAIL_TEST_PASS
}

const productionMode:modeType<string> = {
   PORT: _.PORT,
   APP_NAME: _.APP_NAME,
   APP_URI: _.APP_URI,
   DB_USER: _.DB_USER,
   DB_PASS: _.DB_PASS,
   DB_NAME: _.DB_NAME,
   DB_PORT: _.DB_PORT,

   MAIL_HOST: _.MAIL_HOST,
   MAIL_PORT: _.MAIL_PORT,
   MAIL_USER:  _.MAIL_USER,
   MAIL_PASS:  _.MAIL_PASS
}
// smth here
//validCors: [/^(http|https):\/\/(localhost:517+\d|127.0.0.1:517+\d)+$/],
export default Object.assign({
    validCors:  _.NODE_ENV === "production" ? _.APP_URI : _.APP_DEV_URI,
    mode:  _.NODE_ENV === "production" ? "production" : "development",
    COINBASE_APIKEY: _.COINBASE_API,
    FIXER_API: _.FIXER_API,
    JWT_SECRETKEY: _.JWT_SECRETKEY,
    JWT_EXPIRES_IN: _.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: _.JWT_REFRESH_EXPIRES_IN,
    ADMIN: ADMIN_DATA,
}, _.NODE_ENV === "production" ? productionMode : developmentMode);



