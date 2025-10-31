"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const SessionDocument = require("../models/session.model");
const UserDocument = require("../models/user.model");
const { JWT_SECRET, JWT_REFRESH_SECRET } = require("../constants/env");
const defaults = { audience: "user" };
const defaultsVerify = {};
const accessTokenSignOptions = {
    expiresIn: "15m",
    secret: JWT_SECRET,
};
const refreshTokenSignOptions = {
    expiresIn: "30d",
    secret: JWT_REFRESH_SECRET,
};
const signToken = (payload, options) => {
    const { secret, ...signOpts } = options || accessTokenSignOptions;
    return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};
const verifyToken = (token, options) => {
    const { secret = JWT_SECRET, ...verifyOpts } = options || {};
    try {
        const payload = jwt.verify(token, secret, {
            ...defaultsVerify,
            ...verifyOpts,
        });
        return { payload };
    }
    catch (error) {
        return { error: error.message };
    }
};
module.exports = {
    refreshTokenSignOptions,
    signToken,
    verifyToken,
};
//# sourceMappingURL=jwt.js.map