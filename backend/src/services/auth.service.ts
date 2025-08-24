const { VerificationCodeType } = require("../constants/VerificationCodeTypes");

const UserModel = require('../models/user.model'); 
const VerificationCodeModel = require('../models/verificationCode.model'); 
const { oneYearFromNow } = require('../utils/date'); 
const SessionModel = require('../models/session.model');
const { JWT_REFRESH_SECRET, JWT_SECRET } = require("../constants/env"); 
const { CONFLICT, UNAUTHORIZED } = require('../constants/http'); 
const { appAssert } = require('../utils/appAssert'); 

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

    // create verification code 
    const verificationCode = await VerificationCodeModel.create({
        userId: user._id, 
        type: VerificationCodeType.EmailVerification, 
        expiresAt: oneYearFromNow()
    })

    // send verification email 

    // create session 
    const session = await SessionModel.create({
        userId: user._id, 
        userAgent: data.userAgent, 
    })

    // sign access token & refresh token 
    const refreshToken = jwt.sign(
        { sessionId: session._id }, 
        JWT_REFRESH_SECRET, 
        {
            audience: ["user"], 
            expiresIn: "30d"
        }
    )

    const accessToken = jwt.sign(
        { 
            userId: user._id,
            sessionId: session._id 
        }, 
        JWT_SECRET, 
        {
            audience: ["user"], 
            expiresIn: "15m"
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
    password: string 
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
    const refreshToken = jwt.sign(
        sessionInfo, 
        JWT_REFRESH_SECRET, 
        {
            audience: ["user"], 
            expiresIn: "30d"
        }
    )

    const accessToken = jwt.sign(
        { 
            ...sessionInfo,
            userId: user._id,
        }, 
        JWT_SECRET, 
        {
            audience: ["user"], 
            expiresIn: "15m"
        }
    ); 

    // return user & tokens 
    return {
        user: user.omitPassword(), 
        accessToken, 
        refreshToken, 
    }; 
};

module.exports = createAccount;