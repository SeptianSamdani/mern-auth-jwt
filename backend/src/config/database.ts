import mongoose = require("mongoose")
const { MONGO_URI } = require("../constants/env");

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI); 
        console.log("Connect to Database")
    } catch (error) {
        console.log(`Cannot connect to database : `, error); 
        process.exit(1); 
    }
}

module.exports = connectDB; 