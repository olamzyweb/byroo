import { Resend } from "resend";
import { emailConfig } from "./config";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resend) {
  console.warn(
    "⚠️ RESEND_API_KEY environment variable is not defined. Email dispatch will default to mock logging."
  );
}

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

/**
 * Sends an email using Resend, with automated retry logic (exponential backoff)
 * and support for local mock dispatching if RESEND_API_KEY is not defined.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text = "",
  replyTo,
  from,
}: SendEmailParams) {
  const fromAddress =
    from || `${emailConfig.sender.name} <${emailConfig.sender.email}>`;
  const replyToAddress = replyTo || emailConfig.replyTo;

  if (!resend) {
    console.info(
      `📬 [MOCK EMAIL DISPATCH]\nTo: ${Array.isArray(to) ? to.join(", ") : to}\nSubject: ${subject}\nHTML size: ${html.length} chars`
    );
    // Return a mock ID simulating a successful Resend response
    return {
      data: {
        id: `mock_msg_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`,
      },
      error: null,
    };
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const response = await resend.emails.send({
        from: fromAddress,
        to,
        subject,
        html,
        text,
        replyTo: replyToAddress,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return { data: response.data, error: null };
    } catch (error: any) {
      console.error(
        `🚨 Resend API Send Attempt ${attempts}/${maxAttempts} failed:`,
        error
      );

      if (attempts >= maxAttempts) {
        return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
      }

      // Exponential backoff: wait 1s, 2s, 4s before retrying
      const delay = Math.pow(2, attempts) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return { data: null, error: new Error("Failed to send email after maximum retries") };
}
export default resend;
