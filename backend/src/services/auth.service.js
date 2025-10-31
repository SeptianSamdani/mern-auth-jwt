"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// auth.service.ts
const { VerificationCodeType } = require("../constants/VerificationCodeTypes");
const UserModel = require("../models/user.model");
const VerificationCodeModel = require("../models/verificationCode.model");
const { oneYearFromNow, ONE_DAY_MS, thirtyDaysFromNow, fiveMinutesAgo, oneHourFromNow } = require("../utils/date");
const SessionModel = require("../models/session.model");
const { CONFLICT, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR, TO_MANY_REQUESTS } = require("../constants/http");
const { appAssert } = require("../utils/appAssert");
const { APP_ORIGIN } = require("../constants/env");
const { refreshTokenSignOptions, signToken, verifyToken } = require("../utils/jwt");
const sendMail = require("../utils/sendMail");
const { getVerifyEmailTemplate, getPasswordResetTemplate } = require("../utils/emailTemplates");
const { hashValue } = require("../utils/bcrypt");
const jwt = require("jsonwebtoken");
const createAccount = async (data) => {
    // verify existing user doesn't exist 
    const existingUser = await UserModel.exists({
        email: data.email
    });
    appAssert(!existingUser, CONFLICT, "Email already in use!");
    // create user
    const user = await UserModel.create({
        email: data.email,
        password: data.password,
    });
    const userId = user._id;
    // create verification code 
    const verificationCode = await VerificationCodeModel.create({
        userId: userId,
        type: VerificationCodeType.EmailVerification,
        expiresAt: oneYearFromNow()
    });
    const url = `${APP_ORIGIN}/email/verify/${verificationCode._id}`;
    // send verification email 
    const { error } = await sendMail({
        to: user.email,
        ...getVerifyEmailTemplate(url)
    });
    if (error) {
        console.log("Error sending verification email: ", error);
    }
    // create session 
    const session = await SessionModel.create({
        userId: userId,
        userAgent: data.userAgent,
    });
    // sign access token & refresh token 
    const refreshToken = signToken({ sessionId: session._id }, refreshTokenSignOptions);
    const accessToken = signToken({
        userId: userId,
        sessionId: session._id
    });
    // return user & tokens 
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken
    };
};
const loginUser = async ({ email, password, userAgent }) => {
    // get user by email
    const user = await UserModel.findOne({ email });
    appAssert(user, UNAUTHORIZED, "Invalid email or password");
    // validate password from the request 
    const isValid = user.comparePassword(password);
    appAssert(isValid, UNAUTHORIZED, "Invalid email or password");
    const userId = user._id;
    // create a session 
    const session = await SessionModel.create({
        userId,
        userAgent
    });
    const sessionInfo = {
        sessionId: session._id,
    };
    // sign access token & refresh token 
    const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);
    const accessToken = signToken({
        ...sessionInfo,
        userId: user._id,
    });
    // return user & tokens 
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};
const verifyTokenTyped = verifyToken;
const refreshUserAccessToken = async (refreshToken) => {
    const { payload } = verifyTokenTyped(refreshToken, {
        secret: refreshTokenSignOptions.secret,
    });
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");
    const session = await SessionModel.findById(payload?.sessionId);
    const now = Date.now();
    appAssert(session && session.expiresAt.getTime() > now, UNAUTHORIZED, "Session expired");
    // refresh the session if it expires in the next 24hrs
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
    if (sessionNeedsRefresh) {
        session.expiresAt = thirtyDaysFromNow();
        await session.save();
    }
    const newRefreshToken = sessionNeedsRefresh
        ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
        : undefined;
    const accessToken = signToken({
        userId: session.userId,
        sessionId: session._id,
    });
    return {
        accessToken,
        newRefreshToken,
    };
};
const verifyEmail = async (code) => {
    // get the verification code 
    const validCode = await VerificationCodeModel.findOne({
        _id: code,
        type: VerificationCodeType.EmailVerification,
        expiresAt: { $gt: new Date() },
    });
    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");
    // update user verified to true 
    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
        verified: true,
    }, {
        new: true
    });
    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email.");
    // delete the verification code 
    await validCode.deleteOne();
    // return user 
    return {
        user: updatedUser.omitPassword()
    };
};
const sendPasswordResetEmail = async (email) => {
    // get the user by email 
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User not found");
    // check email rate limit
    const fiveMinAgo = fiveMinutesAgo();
    const count = await VerificationCodeModel.countDocuments({
        userId: user._id,
        type: VerificationCodeType.PasswordReset,
        createdAt: { $gt: fiveMinAgo },
    });
    appAssert(count <= 1, TO_MANY_REQUESTS, "To many requests. Please try again later.");
    // create verification code 
    const expiresAt = oneHourFromNow();
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id,
        type: VerificationCodeType.PasswordReset,
        expiresAt
    });
    // send verification email 
    const url = `${APP_ORIGIN}/password/reset?code=${verificationCode._id}&exp=${expiresAt.getTime()}`;
    const { data, error } = await sendMail({
        to: user.email,
        ...getPasswordResetTemplate(url)
    });
    appAssert(data?.id, INTERNAL_SERVER_ERROR, error ? `${error?.name} - ${error?.message}` : "Failed to send email");
    // return success 
    return {
        url,
        emailId: data.id,
    };
};
const resetPassword = async ({ password, verificationCode }) => {
    // get verification code
    const validCode = await VerificationCodeModel.findOne({
        _id: verificationCode,
        type: VerificationCodeType.PasswordReset,
        expiresAt: { $gt: new Date() }
    });
    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code.");
    // update users password
    const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
        password: await hashValue(password),
    });
    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password.");
    // delete verification code 
    await validCode.deleteOne();
    // delete all sessions 
    await SessionModel.deleteMany({
        userId: updatedUser._id,
    });
    return {
        user: updatedUser.omitPassword(),
    };
};
module.exports = { createAccount, loginUser, refreshUserAccessToken, verifyEmail, sendPasswordResetEmail };
//# sourceMappingURL=auth.service.js.map