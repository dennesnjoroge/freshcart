import { mailer } from "./config/resend.js";
import type {
  SendVerificationEmailParams,
  ForgotPasswordParams,
} from "./types.js";

class MailService {
  sendVerificationEmail = async (params: SendVerificationEmailParams) => {
    const { firstName, email, verificationLink } = params;
    await mailer({
      from: "Freshcart <noreply@mail.loft.co.ke>",
      to: email,
      subject: "Verify your email address",
      html: `
    <p>Hello ${firstName},
    <br />
    Click the link below to verify your email address:
    <br />
    <a href="${verificationLink}">Verification link</a>
    <br />
    This link will expire in 30 minutes.
    <br />
    <br />
     You received this email to let you know about important activity related to your Freshcart account and services.
    <br />
    &copy; ${new Date().getFullYear()} Freshcart
    </p>
    `,
    });
  };

  sendWelcomeEmail = async (email: string, firstName: string) => {
    await mailer({
      from: "Freshcart <noreply@mail.loft.co.ke>",
      to: email,
      subject: "Your email has been verified",
      html: `
    
    <p>
  Hello ${firstName},
  <br /><br />

Your email address has been successfully verified. <br /><br />

Your Freshcart account is now ready to use. You can sign in to access deals and special offers. <br /><br />

If you did not perform this verification, please contact us immediately. <br /><br />

You received this email to let you know about important activity related to your Freshcart account and services. <br /><br />

© ${new Date().getFullYear()} Freshcart

</p>

    `,
    });
  };

  sendForgotPasswordEmail = async (params: ForgotPasswordParams) => {
    const { firstName, email, resetLink } = params;
    await mailer({
      from: "Freshcart <noreply@mail.loft.co.ke>",
      to: email,
      subject: "Reset your password",
      html: `
    
    <p>Hello ${firstName}, 
    <br />
    We received a request to reset the password for your Freshcart account.
    <br />
    Reset your password using the link below:
    <br />
    <a href="${resetLink}">Reset link</a>
    <br />
    This link will expire in 30 minutes.
    <br />
    If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
    <br />
    For your security, never share this link with anyone.
    <br />
    <br />
    You received this email to let you know about important activity related to your Freshcart account and services.
    <br />
    &copy; ${new Date().getFullYear()} Freshcart
    </p>
    `,
    });
  };

  sendPasswordResetEmail = async (firstName: string, email: string) => {
    await mailer({
      from: "Freshcart <noreply@mail.loft.co.ke>",
      to: email,
      subject: "Your Freshcart password was reset",
      html: `
    <p>
    Hello, ${firstName},
    <br />
    Your Freshcart account password was successfully reset.
    <br />
    If you made this change, no further action is required.
    <br />
    If you did not reset your password, change your current password immediately to secure your account.
    <br />
    <br />
    You received this email to let you know about important activity related to your Freshcart account and services.
    <br />
    &copy; ${new Date().getFullYear()} Freshcart
    </p>
    `,
    });
  };
}

export const mailService = new MailService();
