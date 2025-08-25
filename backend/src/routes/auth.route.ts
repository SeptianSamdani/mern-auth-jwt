import Router = require("express");
const { registerHandler, loginHandler } = require('../controllers/auth.controller'); 

const authRoutes = Router(); 

// prefix: /auth
authRoutes.post('/register', registerHandler); 
authRoutes.post('/login', loginHandler); 
authRoutes.post('/logout', loginHandler); 

module.exports = authRoutes; 