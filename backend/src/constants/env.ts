const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue; 

    if (value === undefined) {
        throw new Error(`Missing environment variable ${key}`); 
    }

    return value; 
}

const MONGO_URI = getEnv('MONGO_URI'); 
const PORT = getEnv('PORT', '4004'); 
const NODE_ENV = getEnv("NODE_ENV", 'development'); 
const APP_ORIGIN = getEnv("APP_ORIGIN"); 
const JWT_SECRET = getEnv("JWT_SECRET"); 
const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET"); 
// // const EMAIL_SENDER = getEnv("EMAIL_SENDER"); 
// const RESEND_API_KEY = getEnv("RESEND_API_KEY"); 


module.exports = { MONGO_URI, PORT, NODE_ENV, APP_ORIGIN, JWT_REFRESH_SECRET, JWT_SECRET };