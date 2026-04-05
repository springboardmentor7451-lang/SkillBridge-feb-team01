import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  let transporter;

  if (process.env.SMTP_USER) {
    // Use Gmail SMTP (or any configured SMTP provider)
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback: Ethereal fake email for development
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("⚠️ No SMTP credentials found. Using Ethereal test email.");
  }

  const message = {
    from: `${process.env.FROM_NAME || "SkillBridge"} <${process.env.SMTP_USER || "noreply@skillbridge.com"}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  const info = await transporter.sendMail(message);

  if (!process.env.SMTP_USER) {
    console.log("\n---------------------------------------------------------");
    console.log(`✉️  DEV MODE: Test Email Sent!`);
    console.log(`📬 View email here: ${nodemailer.getTestMessageUrl(info)}`);
    console.log("---------------------------------------------------------\n");
  } else {
    console.log(`✅ Real email sent successfully to ${options.email}`);
  }
};

export default sendEmail;
