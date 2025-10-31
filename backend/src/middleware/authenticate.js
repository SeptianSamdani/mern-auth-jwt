"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { appAssert } = require("../utils/appAssert");
const { UNAUTHORIZED } = require("../constants/http");
const { AppErrorCode } = require("../constants/appErrorCode");
const { verifyToken } = require("../utils/jwt");
const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    appAssert(accessToken, UNAUTHORIZED, "Not Authorized", AppErrorCode.InvalidAccessToken);
    const { error, payload } = verifyToken(accessToken);
    appAssert(payload, UNAUTHORIZED, error === "jwt expired" ? "Token Expired" : "Invalid Access Token");
    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();
};
module.exports = authenticate;
//# sourceMappingURL=authenticate.js.map