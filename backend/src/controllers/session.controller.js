"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const z = require("zod");
const catchErrors = require('../utils/catchErrors');
const SessionModel = require('../models/session.model');
const { appAssert } = require("../utils/appAssert");
const { NOT_FOUND } = require("../constants/http");
const getSessionsHandler = catchErrors(async (req, res) => {
    const sessions = await SessionModel.find({
        userId: req.userId, expiresAt: { $gt: new Date() },
    }, {
        _id: 1,
        userAgent: 1,
        createdAt: 1
    }, {
        sort: { createdAt: -1 }
    });
    return res.status(200).json(sessions.map((session) => ({
        ...session.toObject(),
        ...(session.id === req.sessionId && {
            isCurrent: true,
        })
    })));
});
const deleteSessionHandler = catchErrors(async (req, res) => {
    const sessionId = z.string().parse(req.params.id);
    const deleted = await SessionModel.findOneAndDelete({
        _id: sessionId,
        userId: req.userId
    });
    appAssert(deleted, NOT_FOUND, "Session not found!");
    return res.status(200).json({
        message: "Session deleted successfully!"
    });
});
module.exports = { getSessionsHandler, deleteSessionHandler };
//# sourceMappingURL=session.controller.js.map