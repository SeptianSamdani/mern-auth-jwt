import type { Response, ErrorRequestHandler } from "express";
import type e = require("express");
import z = require("zod");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require('../constants/http')


const handleZodError = (res: Response, error: z.ZodError ) => {
    const errors = error.issues.map((err) => ({
        path: err.path.join('.'), 
        message: error.message,
    })); 

    return res.status(BAD_REQUEST).json({
        message: error.message, 
        errors
    }); 
}; 

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(`PATH: ${req.path}`, error); 

    if (error instanceof z.ZodError) {
        return handleZodError(res, error); 
    }

    return res.status(INTERNAL_SERVER_ERROR).send("Internal server error"); 
}

module.exports = errorHandler; 