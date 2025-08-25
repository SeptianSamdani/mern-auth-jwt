const { VerificationCodeType } = require("../constants/VerificationCodeTypes");

const UserModel = require('../models/user.model'); 
const VerificationCodeModel = require('../models/verificationCode.model'); 
const { oneYearFromNow } = require('../utils/date'); 
const SessionModel = require('../models/session.model');
const { JWT_REFRESH_SECRET, JWT_SECRET } = require("../constants/env");
const { CONFLICT, UNAUTHORIZED } = require('../constants/http'); 
const { appAssert } = require('../utils/appAssert'); 
const { signToken, refreshTokenSignOptions } = require('../utils/jwt'); 

import jwt = require('jsonwebtoken'); 

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

module.exports = createAccount;