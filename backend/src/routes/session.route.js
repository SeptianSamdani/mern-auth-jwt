"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("express");
const sessionRoutes = Router();
const { getSessionsHandler, deleteSessionHandler } = require('../controllers/session.controller');
// prefix: /sessions
sessionRoutes.get("/", getSessionsHandler);
sessionRoutes.delete("/:id", deleteSessionHandler);
module.exports = sessionRoutes;
//# sourceMappingURL=session.route.js.map