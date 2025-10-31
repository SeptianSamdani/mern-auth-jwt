import type { Request, Response } from "express";

const UserModel = require('../models/user.model');
const catchErrors = require('../utils/catchErrors'); 
const { appAssert } = require("../utils/appAssert");
const { NOT_FOUND, OK } = require("../constants/http");

const getUserHandler = catchErrors(
    async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.userId); 
        appAssert(
            user, 
            NOT_FOUND, 
            "User not found!"
        ); 
        return res.status(OK).json(user.omitPassword()); 
    }
); 

module.exports = getUserHandler; 