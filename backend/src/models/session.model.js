"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { thirtyDaysFromNow } = require('../utils/date');
const sessionSchema = new mongoose.Schema({
    userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        index: true,
    },
    userAgent: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    expiresAt: { type: Date,
        default: thirtyDaysFromNow }
});
const SessionModel = mongoose.model("Session", sessionSchema);
module.exports = SessionModel;
//# sourceMappingURL=session.model.js.map