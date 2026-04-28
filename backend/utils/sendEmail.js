import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Avoid crashing flow on slow/unreachable SMTP resolution
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      dnsTimeout: 10000,
    });

    await transporter.sendMail({
      from: `"Docchain" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error.message);
    return { success: false, error: error.message };
  }
};

export default sendEmail;
