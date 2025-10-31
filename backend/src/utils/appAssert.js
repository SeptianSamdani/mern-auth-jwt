"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { HttpStatusCode } = require('../constants/http');
const assert = require("node:assert");
const AppErrorCode = require('../constants/appErrorCode');
const AppError = require('./AppError');
const appAssert = (condition, httpStatusCode, message, appErrorCode) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));
module.exports = { appAssert };
//# sourceMappingURL=appAssert.js.map