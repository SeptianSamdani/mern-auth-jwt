// auth.service.ts
const { VerificationCodeType } = require("../constants/VerificationCodeTypes");

const UserModel = require("../models/user.model");
const VerificationCodeModel = require("../models/verificationCode.model");
const { oneYearFromNow, ONE_DAY_MS, thirtyDaysFromNow } = require("../utils/date");
const SessionModel = require("../models/session.model");
const { CONFLICT, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../constants/http");
const { appAssert } = require("../utils/appAssert");
import type { RefreshTokenPayload } from "../utils/jwt";

const { refreshTokenSignOptions, signToken, verifyToken } = require("../utils/jwt");

import jwt = require("jsonwebtoken"); 

type CreateAccountParams = {
    email: string, 
    password: string, 
    userAgent?: string,
}

const createAccount = async (data:CreateAccountParams ) => {
    // verify existing user doesn't exist 
    const existingUser = await UserModel.exists({
        email: data.email
    })

    appAssert(!existingUser, CONFLICT, "Email already in use!")

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
    })

    // send verification email 

    // create session 
    const session = await SessionModel.create({
        userId: userId, 
        userAgent: data.userAgent, 
    })

    // sign access token & refresh token 
    const refreshToken = signToken(
        { sessionId: session._id }, 
        refreshTokenSignOptions
    )

    const accessToken = signToken(
        { 
            userId: userId,
            sessionId: session._id 
        }
    )

    // return user & tokens 
    return {
        user: user.omitPassword(), 
        accessToken, 
        refreshToken
    }
}

type LoginParams = {
    email: string; 
    password: string; 
    userAgent?: string; 
}

const loginUser = async ({email, password, userAgent}:LoginParams ) => {
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
    }

    // sign access token & refresh token 
    const refreshToken = signToken(
        sessionInfo, refreshTokenSignOptions
    )

    const accessToken = signToken(
        { 
            ...sessionInfo,
            userId: user._id,
        }, 
    )

    // return user & tokens 
    return {
        user: user.omitPassword(), 
        accessToken, 
        refreshToken, 
    }; 
};

const verifyTokenTyped = verifyToken as <TPayload extends object>(
    token: string,
    options: { secret: string }
) => { payload?: TPayload; error?: string };

const refreshUserAccessToken = async (refreshToken: string) => {
    const { payload } = verifyTokenTyped<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
    });
    appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

    const session = await SessionModel.findById(payload?.sessionId);
    const now = Date.now();
    appAssert(
        session && session.expiresAt.getTime() > now,
        UNAUTHORIZED,
        "Session expired"
    );

    // refresh the session if it expires in the next 24hrs
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
    if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
    }

    const newRefreshToken = sessionNeedsRefresh
    ? signToken(
        { sessionId: session._id },
        refreshTokenSignOptions
        )
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

const verifyEmail = async (code: string) => {
    // get the verification code 
    const validCode = await VerificationCodeModel.findOne({
        _id: code, 
        type: VerificationCodeType.EmailVerification, 
        expiresAt: { $gt: new Date() }, 
    })

    appAssert(validCode, NOT_FOUND, "Invalid or expired verification code");

    // update user verified to true 
    const updatedUser = await UserModel.findByIdAndUpdate(
        validCode.userId, 
        {
            verified: true, 
        }, 
        {
            new: true
        }
    ); 
    appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email."); 
    
    // delete the verification code 
    await validCode.deleteOne(); 

    // return user 
    return {
        user: updatedUser.omitPassword()
    }

}

module.exports = { createAccount, loginUser, refreshUserAccessToken, verifyEmail };