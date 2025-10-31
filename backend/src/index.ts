import "dotenv/config";
import express = require('express');
import type { Request, Response, NextFunction } from "express";
import cors = require('cors');
import cookieParser = require("cookie-parser");
const { PORT, NODE_ENV, APP_ORIGIN }  = require('../src/constants/env');
const errorHandler = require('../src/middleware/errorHandler');
const catchErrors = require('../src/utils/catchErrors');
const { OK } = require('../src/constants/http');

const authRoutes = require('../src/routes/auth.route'); 
const userRoutes = require('../src/routes/user.route');
const sessionRoutes = require('../src/routes/session.route'); 

const connectDB = require('../src/config/database');
const authenticate = require('../src/middleware/authenticate');


const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(
    cors({
        origin: APP_ORIGIN, 
        credentials: true
    })
); 
app.use(cookieParser()); 

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.status(OK).json({
        message: "it's work", 
    }); 
}); 

app.use('/auth', authRoutes); 

// Authenticated routes
app.use('/user', authenticate, userRoutes); 
app.use('/sessions', authenticate, sessionRoutes); 

app.use(errorHandler); 

app.listen(PORT, async () => {
    console.log(`Server is running on PORT ${PORT} in ${NODE_ENV}`); 
    await connectDB(); 
});