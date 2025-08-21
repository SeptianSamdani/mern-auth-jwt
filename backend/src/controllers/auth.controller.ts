import type { Request, Response } from "express";
import z = require("zod");

const catchErrors = require('../utils/catchErrors'); 
const createAccount = require('../services/auth.service'); 
const { CREATED } = require('../constants/http'); 
const setAuthCookies = require('../utils/cookies');

const registerSchema = z
    .object({
        email: z.string().email().min(1).max(255), 
        password: z.string().min(6).max(255), 
        confirmPassword: z.string().min(6).max(255), 
        userAgent: z.string().optional(), 
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match", 
        path: ["confirmPassword"], 
    }); 

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

module.exports = registerHandler;