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
const APP_ORIGIN = getEnv("APP_ORIGIN")


module.exports = { MONGO_URI, PORT, NODE_ENV, APP_ORIGIN };