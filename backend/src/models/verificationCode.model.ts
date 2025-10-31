// models/verificationCode.model.ts

import mongoose = require("mongoose");
const { VerificationCodeType } = require('../constants/VerificationCodeTypes');

// derive type dari value object
type VerificationCodeTypeValues = typeof VerificationCodeType[keyof typeof VerificationCodeType];

interface VerificationCodeDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId; 
    type: VerificationCodeTypeValues;
    expiresAt: Date; 
    createdAt: Date; 
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true, 
        index: true, 
    }, 
    type: { type: String, required: true }, 
    createdAt: { type: Date, required: true, default: Date.now }, 
    expiresAt: { type: Date, required: true }
}); 

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
    "VerificationCode", 
    verificationCodeSchema, 
    "verification_codes"
); 

module.exports = VerificationCodeModel; 