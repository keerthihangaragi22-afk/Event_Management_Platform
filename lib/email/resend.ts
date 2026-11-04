import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(params: SendEmailParams) {
  if (!resend) {
    console.warn("Resend API key not configured. Email not sent.");
    return { success: false, error: "Email service not configured" };
  }

  const fromEmail = params.from || process.env.RESEND_FROM_EMAIL || "noreply@thelegacycircle.org";
  const fromName = process.env.RESEND_FROM_NAME || "The Legacy Circle";

  try {
    const result = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo,
    });

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Resend error:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
}

export function personalizeTemplate(
  template: string,
  variables: Record<string, string | undefined>
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "gi");
    result = result.replace(regex, value || "");
  }
  return result;
}
