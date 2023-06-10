import axios from "axios";
import helpers from "../helpers";

const adminInstance = axios.create({
    baseURL: process.env.BASE_URI,
});


// Add a response interceptor
adminInstance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    console.log(error)
    if (error.response && error.response.data && 
        (error.response.data.name === "TokenExpiredError" ||
         error.response.data.name ===  "JsonWebTokenError")) {
        helpers.forceLogoutUser().catch((err:any) => console.log(err))
    }
    
    return Promise.reject(error);
});
export default adminInstance;