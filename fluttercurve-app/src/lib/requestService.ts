import axios from "axios";
import helpers from "../helpers";



// ENV FILES
//global
export const MAIN_URL = "https://fluttercurve.com";
export const MAIN_APP_URL = "https://app.fluttercurve.com";

// // prod
export const BASE_URI = "https://api.fluttercurve.com/v1";
export const PUBLIC_PATH = "https://api.fluttercurve.com"

// // dev
// export const BASE_URI = "http://localhost:3000/v1";
// export const PUBLIC_PATH = "http://localhost:3000"

const instance = axios.create({
    baseURL: BASE_URI,
});


// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    console.log(error.response)
    if (error.response && error.response.data && 
        (error.response.data.name === "TokenExpiredError" ||
         error.response.data.name ===  "JsonWebTokenError" || error.response.data.name === "Unauthorized user")) {
        helpers.forceLogoutUser().catch((err:any) => console.log(err))
    }
    
    return Promise.reject(error);
});
export default instance;
