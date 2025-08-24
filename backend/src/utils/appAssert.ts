const { HttpStatusCode } = require('../constants/http');
import assert = require("node:assert");
const AppErrorCode = require('../constants/appErrorCode'); 
const AppError = require('./AppError'); 

type AppErrorCode = typeof AppErrorCode[keyof typeof AppErrorCode];
type HttpStatusCode = typeof HttpStatusCode[keyof typeof HttpStatusCode];

type AppAssert = (
    condition: any, 
    httpStatusCode: HttpStatusCode, 
    message: string, 
    appErrorCode?: AppErrorCode
) => asserts condition; 


const appAssert:AppAssert = (
    condition, 
    httpStatusCode, 
    message, 
    appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode))

module.exports = { appAssert }; 