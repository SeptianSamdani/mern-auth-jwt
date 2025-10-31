import Router = require("express");
const sessionRoutes = Router(); 

const { getSessionsHandler, deleteSessionHandler } = require('../controllers/session.controller');

// prefix: /sessions
sessionRoutes.get("/", getSessionsHandler); 
sessionRoutes.delete("/:id", deleteSessionHandler);

module.exports = sessionRoutes;