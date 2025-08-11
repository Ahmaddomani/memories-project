import nodemailer from "nodemailer";

export const sendEmail = async (option) => {
  // Create Account
  const account = await nodemailer.createTestAccount();

  /// Create Transporter
  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  //create info
  const info = await transporter.sendMail({
    from: "SomeWebSites2024<support@SomeWebSites2024>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  });

  console.log("✅ Email sent!");
  console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
};
