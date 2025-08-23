//npm install nodemailer
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// optionally export a function to send emails
exports.sendEmail = async (toEmail, subject, html) => {
  await transporter.sendMail({
    from: `"Todolist App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: subject,
    html: html,
  });
};
