import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  TO_EMAIL,
  FROM_EMAIL,
} = process.env as Record<string, string | undefined>;

let transporter: nodemailer.Transporter | null = null;
let usingEthereal = false;

async function getTransporter() {
  if (transporter) return transporter;
  if (SMTP_HOST) {
    const port = Number(SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: String(SMTP_SECURE || "false").toLowerCase() === "true" || port === 465,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    usingEthereal = false;
    return transporter;
  }
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  usingEthereal = true;
  // eslint-disable-next-line no-console
  console.log("[mailer] Using Ethereal test SMTP account. Messages are not delivered; preview in browser.");
  return transporter;
}

export async function sendContactEmail(subject: string, text: string, html?: string): Promise<{ previewUrl?: string; messageId: string }> {
  const tx = await getTransporter();
  const from = FROM_EMAIL || SMTP_USER || "no-reply@example.com";
  const to = TO_EMAIL || FROM_EMAIL || SMTP_USER || from;
  const info = await tx.sendMail({ from, to, subject, text, html });
  const previewUrl = usingEthereal ? nodemailer.getTestMessageUrl(info) || undefined : undefined;
  if (previewUrl) {
    // eslint-disable-next-line no-console
    console.log("[mailer] Preview:", previewUrl);
  }
  return { previewUrl, messageId: info.messageId };
}

export async function sendContactEmailWithReply(
  subject: string,
  text: string,
  html: string | undefined,
  replyToEmail: string,
  fromDisplayName?: string
): Promise<{ previewUrl?: string; messageId: string }> {
  const tx = await getTransporter();
  const fromAddress = FROM_EMAIL || SMTP_USER || "no-reply@example.com";
  const from = fromDisplayName ? { name: `${fromDisplayName} via EduLearn`, address: fromAddress } : fromAddress;
  const to = TO_EMAIL || FROM_EMAIL || SMTP_USER || fromAddress;
  const info = await tx.sendMail({ from, to, subject, text, html, replyTo: replyToEmail });
  const previewUrl = usingEthereal ? nodemailer.getTestMessageUrl(info) || undefined : undefined;
  if (previewUrl) {
    // eslint-disable-next-line no-console
    console.log("[mailer] Preview:", previewUrl);
  }
  return { previewUrl, messageId: info.messageId };
} 