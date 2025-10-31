"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Resend } = require("resend");
const { RESEND_API_KEY } = require("../constants/env");
const resend = new Resend(RESEND_API_KEY);
module.exports = resend;
//# sourceMappingURL=resend.js.map