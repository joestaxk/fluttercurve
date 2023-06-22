import express from 'express'
require('dotenv').config()
import compression from 'compression'
import helmet from "helmet"
import cors from "cors"
import httpStatus  from "http-status"
import Routes from "./routes/v1"
import limiter from "./middlewares/rate-limiter"
import ApiError from "./utils/ApiError"
import config from "./config/config"
import bodyParser from 'body-parser'
import requestIp from 'request-ip'

// initialize express app
const app = express();

// gzip compression
app.use(compression())

// secure http headers
app.use(helmet())

// parse JSON body req
app.use(express.json());

// body parser
app.use(bodyParser.json())

// parse urlencoded request body
app.use(express.urlencoded({extended: true}));

// cross-origin
const corsOptions = {
   	methods: ["GET", "POST", "PUT", "DELETE"],
	origin: config.validCors,
	optionSuccessStatus: 200,
	headers: ["Content-Type", "Authorization", "xat"],
	// credentials: true, 
	maxAge: 3600,
	preflightContinue: true, 
}

app.use(cors(corsOptions))
app.use(requestIp.mw())

// app.use(cors())
app.options("*", cors(corsOptions));

// app.use((req, res, next) => {
// 	res.header('Access-Control-Allow-Origin', 'http://localhost:3002/');
// 	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
// 	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
// 	next();
// });

// limit number of request per timing to api route.
if(config.NODE_ENV === "production") {
    app.use("/v1", limiter);
}

// when parent url requestss
app.get('/', async (req:any,res:any,next: any) => {
   res.status(200).send("Please request our api at /v1")
})

// v1 api routes
app.use("/v1", Routes);

app.use('/', express.static('public/'));
// app.use('/private', UserAuth, express.static('public/private/'));

// send back a 404 error for any unknown api request
app.use((req:any, res:any, next: any) => {
	throw new ApiError(httpStatus.NOT_FOUND, "Link not found");
});


// convert error to ApiError, if needed
//app.use(errorConverter);

// handle error
//app.use(errorHandler);

// export app
export default app;

