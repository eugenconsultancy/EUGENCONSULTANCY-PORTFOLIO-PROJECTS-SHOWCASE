import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendNewInquiryEmail(inquiry: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP not configured; skipping email");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `New inquiry: ${inquiry.subject}`,
    html: `
      <h2>New contact message</h2>
      <p><strong>Name:</strong> ${inquiry.name}</p>
      <p><strong>Email:</strong> ${inquiry.email}</p>
      <p><strong>Subject:</strong> ${inquiry.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${inquiry.message.replace(/\n/g, "<br>")}</p>
    `,
  });
}
