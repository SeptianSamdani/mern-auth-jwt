import bcrypt = require("bcrypt"); 

const hashValue = async (value: string, saltRounds?: number) => 
    bcrypt.hash(value, saltRounds || 10); 

const compareValue = async (value: string, hashedValue: string) => 
    bcrypt.compare(value, hashedValue).catch(() => false); 

module.exports = { hashValue, compareValue }; 