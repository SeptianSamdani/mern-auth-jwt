import mongoose = require("mongoose");

const { thirtyDaysFromNow } = require('../utils/date'); 

interface SessionDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId; 
    userAgent?: string; 
    createdAt: Date; 
    expiresAt: Date; 
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
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

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema); 

module.exports = SessionModel; 