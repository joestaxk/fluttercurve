/**
  Api handler class
**/


export default class ApiError extends Error {
    public name: string;
    public httpCode: number|string;
    public description: string;
    public isOperational: string

   constructor(name?:any, httpCode?:any, description?:any, isOperational?: any) {
       super(description);

       this.name = name;
       this.httpCode = httpCode;
       this.description = description;
       this.isOperational = isOperational;

       Error.captureStackTrace(this, ApiError);
   }
}
