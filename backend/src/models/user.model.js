"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const { hashValue, compareValue } = require('../utils/bcrypt');
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
}, {
    timestamps: true
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await hashValue(this.password);
    next();
});
userSchema.methods.comparePassword = async function (val) {
    return compareValue(val, this.password);
};
userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
//# sourceMappingURL=user.model.js.map