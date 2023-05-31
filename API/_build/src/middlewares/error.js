"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorConverter = exports.errorHandler = void 0;
const errorConverter = (error, req, res, next) => {
    console.log(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (error, req, res, next) => {
    console.log(error);
};
exports.errorHandler = errorHandler;
