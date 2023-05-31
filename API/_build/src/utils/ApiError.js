"use strict";
/**
  Api handler class
**/
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(name, httpCode, description, isOperational) {
        super(description);
        this.name = name;
        this.httpCode = httpCode;
        this.description = description;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, ApiError);
    }
}
exports.default = ApiError;
