interface VerificationEmailTemplateParams {
  firstName: string;
  verificationLink: string;
}

export const verificationEmailTemplate = (
  params: VerificationEmailTemplateParams,
) => {
  const { firstName, verificationLink } = params;
  return ` <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
          <h2>Verify your email address</h2>

          <p>Hi ${firstName},</p>

          <p>
            Thanks for creating your TechStore account.
            Please verify your email address using the button below.
          </p>

          <p>
           <a href="${verificationLink}">
            Verify email address
           </a>
          </p>

          <p>
            This verification link will expire in 30 minutes.
          </p>

         <p>
          If you did not create a TechStore account, you can safely ignore
          this email.
         </p>

          <p>
           TechStore
          </p>
        </div>`;
};
