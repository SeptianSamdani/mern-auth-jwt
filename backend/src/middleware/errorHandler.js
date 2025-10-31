"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const z = require("zod");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require('../constants/http');
const AppError = require('../utils/AppError');
const { REQUEST_PATH, clearAuthCookies } = require('../utils/cookies');
const handleZodError = (res, error) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join('.'),
        message: error.message,
    }));
    return res.status(BAD_REQUEST).json({
        message: error.message,
        errors
    });
};
const handleAppError = (res, error) => {
    return res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    });
};
const errorHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error);
    if (req.path === REQUEST_PATH) {
        clearAuthCookies(res);
    }
    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }
    if (error instanceof AppError) {
        return handleAppError(res, error);
    }
    return res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};
module.exports = errorHandler;
//# sourceMappingURL=errorHandler.js.map