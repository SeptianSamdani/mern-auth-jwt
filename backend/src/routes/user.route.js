"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Router } = require('express');
const { getUserHandler } = require('../controllers/user.controller');
const userRoutes = Router();
// prefix: /user
userRoutes.get("/", getUserHandler);
module.exports = userRoutes;
//# sourceMappingURL=user.route.js.map