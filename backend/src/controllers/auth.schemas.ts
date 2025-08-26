import z = require("zod");

const emailSchema = z.string().email().min(1).max(255); 
const passwordSchema = z.string().min(6).max(255); 

const loginSchema = z
    .object({
        email: emailSchema, 
        password: passwordSchema,
        userAgent: z.string().optional(), 
    })

const registerSchema = loginSchema
    .extend({
        confirmPassword: z.string().min(6).max(255)
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Password do not match", 
        path: ["confirmPassword"], 
    }); 

const verificationCodeSchema = z.string().min(1).max(24); 

module.exports = { registerSchema, loginSchema, verificationCodeSchema }; 