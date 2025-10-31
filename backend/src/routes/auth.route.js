"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("express");
const { registerHandler, loginHandler, refreshHandler, logoutHandler, verifyEmailHandler, sendPasswordResetHanlder, resetPasswordHandler } = require('../controllers/auth.controller');
const authRoutes = Router();
// prefix: /auth
authRoutes.post('/register', registerHandler);
authRoutes.post('/login', loginHandler);
authRoutes.get('/refresh', refreshHandler);
authRoutes.get('/logout', logoutHandler);
authRoutes.get('/email/verify/:code', verifyEmailHandler);
authRoutes.post('/password/forgot', sendPasswordResetHanlder);
authRoutes.post('/password/reset', resetPasswordHandler);
module.exports = authRoutes;
//# sourceMappingURL=auth.route.js.map