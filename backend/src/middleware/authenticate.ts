import type e = require("express");
const { appAssert } = require("../utils/appAssert");
const { UNAUTHORIZED } = require("../constants/http");
const { AppErrorCode } = require("../constants/appErrorCode");
const { verifyToken } = require("../utils/jwt");

const authenticate: e.RequestHandler = (req, res, next) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    appAssert(
        accessToken, 
        UNAUTHORIZED, 
        "Not Authorized", 
        AppErrorCode.InvalidAccessToken
    );

    const { error, payload } = verifyToken(accessToken); 
    appAssert(
        payload, 
        UNAUTHORIZED, 
        error === "jwt expired" ? "Token Expired" : "Invalid Access Token"
    ); 

    req.userId = payload.userId; 
    req.sessionId = payload.sessionId; 
    next(); 
}

module.exports = authenticate;