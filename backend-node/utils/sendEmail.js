const nodemailer = require('nodemailer');

const sendEmail = async ({
  email,
  subject,
  html,
}) => {

  try {

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("SMTP Connected Successfully");

    await transporter.sendMail({
      from: `"CraftStory" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

  } catch (error) {

    console.error('Email Error:', error);

    throw error;
  }
};

module.exports = sendEmail;