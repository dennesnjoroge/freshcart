export interface SendVerificationEmailParams {
  firstName: string;
  email: string;
  verificationLink: string;
}

export interface ForgotPasswordParams {
  firstName: string;
  email: string;
  resetLink: string;
}
