import { Resend } from "resend";
import { getEnvVar } from "../../../config/env.js";

const apiKey = getEnvVar("RESEND_API_KEY");

const resend = new Resend(apiKey);

type MailerPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
};

export const mailer = async ({ from, to, subject, html }: MailerPayload) => {
  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    const error = result.error;

    if (error) {
      console.error("[Mailer]", error);
    }

    return true;
  } catch (error) {
    console.error("[Mailer]", error);
  }
};
