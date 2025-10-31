"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel = require('../models/user.model');
const catchErrors = require('../utils/catchErrors');
const { appAssert } = require("../utils/appAssert");
const { NOT_FOUND, OK } = require("../constants/http");
const getUserHandler = catchErrors(async (req, res) => {
    const user = await UserModel.findById(req.userId);
    appAssert(user, NOT_FOUND, "User not found!");
    return res.status(OK).json(user.omitPassword());
});
module.exports = getUserHandler;
//# sourceMappingURL=user.controller.js.map