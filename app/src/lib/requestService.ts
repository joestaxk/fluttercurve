import axios from "axios";

const instance = axios.create({
    baseURL: process.env.BASE_URI,
});

export default instance;