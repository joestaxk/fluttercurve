"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = process.env;
const ADMIN_DATA = {
    "fullName": "flutter curve",
    "userName": _.ADMIN_USERNAME,
    "email": _.ADMIN_EMAIL,
    "phoneNumber": "2348000000",
    "country": "US",
    "annualIncome": 1000000,
    "currency": "$",
    "password": _.ADMIN_PASSWORD,
    "isVerified": true,
    "referral": "admin",
    "isAdmin": true,
};
const developmentMode = {
    PORT: _.PORT,
    DB_USER: _.DB_LOCAL_USER,
    DB_PASS: _.DB_LOCAL_PASS,
    DB_NAME: _.DB_NAME,
    MAIL_HOST: _.MAIL_TEST_HOST,
    MAIL_PORT: _.MAIL_TEST_PORT,
    MAIL_USER: _.MAIL_TEST_USER,
    MAIL_PASS: _.MAIL_TEST_PASS
};
const productionMode = {
    PORT: _.PORT,
    DB_USER: _.DB_USER,
    DB_PASS: _.DB_PASS,
    DB_NAME: _.DB_NAME,
    MAIL_HOST: _.MAIL_TEST_HOST,
    MAIL_PORT: _.MAIL_TEST_PORT,
    MAIL_USER: _.MAIL_TEST_USER,
    MAIL_PASS: _.MAIL_TEST_PASS
};
// smth here
//validCors: [/^(http|https):\/\/(localhost:517+\d|127.0.0.1:517+\d)+$/],
exports.default = Object.assign({
    validCors: "*",
    mode: _.NODE_ENV === "production" ? "production" : "development",
    APP_NAME: _.APP_NAME,
    COINBASE_APIKEY: _.COINBASE_API,
    JWT_SECRETKEY: _.JWT_SECRETKEY,
    JWT_EXPIRES_IN: _.JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN: _.JWT_REFRESH_EXPIRES_IN,
    ADMIN: ADMIN_DATA,
}, _.NODE_ENV === "production" ? productionMode : developmentMode);
