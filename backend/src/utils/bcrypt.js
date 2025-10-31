"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const hashValue = async (value, saltRounds) => bcrypt.hash(value, saltRounds || 10);
const compareValue = async (value, hashedValue) => bcrypt.compare(value, hashedValue).catch(() => false);
module.exports = { hashValue, compareValue };
//# sourceMappingURL=bcrypt.js.map