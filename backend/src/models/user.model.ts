import mongoose = require("mongoose");


interface UserDocument extends mongoose.Document {
    email: string;
    password: string; 
    createdAt: Date; 
    updatedAt: Date;
}

