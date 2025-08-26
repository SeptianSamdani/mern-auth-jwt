import type { Request, Response } from "express";
import z = require("zod");

const catchErrors = require('../utils/catchErrors'); 
const { createAccount, loginUser, refreshUserAccessToken, verifyEmail } = require('../services/auth.service'); 
const { CREATED, OK, UNAUTHORIZED } = require('../constants/http'); 
const { setAuthCookies, clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions } = require('../utils/cookies');
const { loginSchema, registerSchema, verificationCodeSchema } = require('./auth.schemas'); 
const { verifyToken, accessTokenPayload } = require('../utils/jwt'); 
const SessionModel = require('../models/session.model'); 
const { appAssert } = require('../utils/appAssert'); 

const registerHandler = catchErrors(async (req: Request, res: Response) => {
    // validate request
    const request = registerSchema.parse({
        ...req.body, 
        userAgent: req.headers['user-agent'] as string | undefined,
    }); 
    // call service 
    const { user, accessToken, refreshToken } = await createAccount(request); 

    // return response
    return setAuthCookies({res, accessToken, refreshToken })
    .status(CREATED)
    .json(user); 
}); 

const loginHandler = catchErrors(async (req: Request, res: Response) => {
    const request = loginSchema.parse({
        ...req.body, 
        userAgent: req.headers['user-agent'],
    }); 

    const { 
        accessToken, refreshToken 
    } = await loginUser(request); 

    return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
        message: "Login Successfull!", 
    }); 
}); 

const logoutHandler = catchErrors(async (req: Request, res: Response) => {
    const accessToken = req.cookies.accessToken as string | undefined; 
    const { payload } = verifyToken(accessToken); 

    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }

    return clearAuthCookies(res).
    status(OK).json({
        message: "Logout Successfull", 
    }); 
}); 

const refreshHandler = catchErrors(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string | undefined; 
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token!")

    const { accessToken, newRefreshToken } = await refreshUserAccessToken(
        refreshToken
    ); 

    if (newRefreshToken) {
        res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions()); 
    }

    return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
        message: "Access token refreshed!"
    }); 
}); 

const verifyEmailHandler = catchErrors(async (req: Request, res: Response) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code); 

    await verifyEmail(verificationCode); 

    return res.status(OK).json({
        message: "Email was successfully verified."
    }); 
}); 

module.exports = { registerHandler, loginHandler, logoutHandler, refreshHandler, verifyEmailHandler };