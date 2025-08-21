const VerificationCodeType = {
  EmailVerification: "email_verification",
  PasswordReset: "password_reset",
} as const; 

module.exports = { VerificationCodeType };