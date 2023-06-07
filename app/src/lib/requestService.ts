import axios from "axios";
import helpers from "@/helpers";

const instance = axios.create({
    baseURL: process.env.BASE_URI,
});


// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, function (error) {
    if (error.response && error.response.data && 
        (error.response.data.name === "TokenExpiredError" ||
         error.response.data.name ===  "JsonWebTokenError")) {
        helpers.forceLogoutUser().catch((err:any) => console.log(err))
    }
    
    return Promise.reject(error);
});
export default instance;