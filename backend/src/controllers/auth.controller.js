"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const z = require("zod");
const catchErrors = require('../utils/catchErrors');
const { createAccount, loginUser, refreshUserAccessToken, verifyEmail, sendPasswordResetEmail, resetPassword } = require('../services/auth.service');
const { CREATED, OK, UNAUTHORIZED } = require('../constants/http');
const { setAuthCookies, clearAuthCookies, getAccessTokenCookieOptions, getRefreshTokenCookieOptions } = require('../utils/cookies');
const { loginSchema, registerSchema, verificationCodeSchema, emailSchema, resetPasswordSchema } = require('./auth.schemas');
const { verifyToken, accessTokenPayload } = require('../utils/jwt');
const SessionModel = require('../models/session.model');
const { appAssert } = require('../utils/appAssert');
const registerHandler = catchErrors(async (req, res) => {
    // validate request
    const request = registerSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });
    // call service 
    const { user, accessToken, refreshToken } = await createAccount(request);
    // return response
    return setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json(user);
});
const loginHandler = catchErrors(async (req, res) => {
    const request = loginSchema.parse({
        ...req.body,
        userAgent: req.headers['user-agent'],
    });
    const { accessToken, refreshToken } = await loginUser(request);
    return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
        message: "Login Successfull!",
    });
});
const logoutHandler = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const { payload } = verifyToken(accessToken);
    if (payload) {
        await SessionModel.findByIdAndDelete(payload.sessionId);
    }
    return clearAuthCookies(res).
        status(OK).json({
        message: "Logout Successfull",
    });
});
const refreshHandler = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token!");
    const { accessToken, newRefreshToken } = await refreshUserAccessToken(refreshToken);
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
const verifyEmailHandler = catchErrors(async (req, res) => {
    const verificationCode = verificationCodeSchema.parse(req.params.code);
    await verifyEmail(verificationCode);
    return res.status(OK).json({
        message: "Email was successfully verified."
    });
});
const sendPasswordResetHanlder = catchErrors(async (req, res) => {
    const email = emailSchema.parse(req.body.email);
    // call the service
    await sendPasswordResetEmail(email);
    return res.status(OK).json({
        message: "Password reset email send."
    });
});
const resetPasswordHandler = catchErrors(async (req, res) => {
    const request = resetPasswordSchema.parse(req.body);
    await resetPassword(request);
    return clearAuthCookies(res).status(OK).json({
        message: "Password reset successful. Please login with your new password."
    });
});
module.exports = { registerHandler, loginHandler, logoutHandler, refreshHandler, verifyEmailHandler, sendPasswordResetHanlder, resetPasswordHandler };
//# sourceMappingURL=auth.controller.js.map