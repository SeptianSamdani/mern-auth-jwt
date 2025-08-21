import type http = require("../constants/http");
const AppErrorCode = require('../constants/appErrorCode'); 

type AppErrorCodeType = typeof AppErrorCode[keyof typeof AppErrorCode]

class AppError extends Error {
    constructor(
        public statusCode: http.HttpStatusCode, 
        public message: string, 
        public errorCode?: AppErrorCodeType
    ) {
        super(message)
    }
}

new AppError(
    200, 
    'msg', 
    AppErrorCode.InvalidAccessToken
)

module.exports = AppError; 