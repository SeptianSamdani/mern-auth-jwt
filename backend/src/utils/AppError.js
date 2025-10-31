"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppErrorCode = require('../constants/appErrorCode');
class AppError extends Error {
    constructor(statusCode, message, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
    }
}
new AppError(200, 'msg', AppErrorCode.InvalidAccessToken);
module.exports = AppError;
//# sourceMappingURL=AppError.js.map