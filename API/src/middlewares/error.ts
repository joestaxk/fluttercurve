const errorConverter = (error:any, req:Request, res:Request, next:any) => {
    console.log(error)
}


const errorHandler = (error:any, req:Request, res:Response, next:any) => {
   console.log(error);
}

export { errorHandler, errorConverter }

