import type { Request, Response } from "express";
import z = require("zod");

const catchErrors = require('../utils/catchErrors'); 
const { createAccount, loginUser } = require('../services/auth.service'); 
const { CREATED, OK } = require('../constants/http'); 
const { setAuthCookies, clearAuthCookies } = require('../utils/cookies');
const { loginSchema, registerSchema } = require('./auth.schemas'); 
const { verifyToken, accessTokenPayload } = require('../utils/jwt'); 
const { SessionModel } = require('../models/session.model'); 

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
        message: "Login Successfull"
    }); 
}); 

const logoutHandler = catchErrors(async (req: Request, res: Response) => {
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

module.exports = { registerHandler, loginHandler, logoutHandler };  