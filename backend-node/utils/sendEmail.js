const nodemailer = require('nodemailer');

/**
 * sendEmail({ email, subject, html })
 *
 * Uses Brevo SMTP relay — credentials never expire.
 * Brevo SMTP works on Render/Railway/all cloud hosts (port 587 is open).
 *
 * Add these to Render environment variables:
 *   BREVO_SMTP_USER = ad3b02001@smtp-brevo.com
 *   BREVO_SMTP_PASS = rX7jyMKxsPnhbLED
 *   EMAIL_FROM      = ggreeshma.ai@gmail.com
 */
const sendEmail = async ({ email, subject, html }) => {

  const user     = process.env.BREVO_SMTP_USER;
  const pass     = process.env.BREVO_SMTP_PASS;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  if (!user || !pass) {
    throw new Error(
      'BREVO_SMTP_USER or BREVO_SMTP_PASS is not set in environment variables.'
    );
  }

  if (!fromEmail) {
    throw new Error('EMAIL_FROM is not set in environment variables.');
  }

  const transporter = nodemailer.createTransport({
    host:   'smtp-relay.brevo.com',
    port:   587,
    secure: false, // STARTTLS
    auth:   { user, pass },
    connectionTimeout: 10000,
    greetingTimeout:   10000,
    socketTimeout:     15000,
  });

  try {
    const info = await transporter.sendMail({
      from:    `"CraftStory" <${fromEmail}>`,
      to:      email,
      subject,
      html,
    });
    console.log(`✓ Email sent to ${email} | MessageId: ${info.messageId}`);
  } catch (error) {
    console.error('✗ Email failed:', error.message);
    throw error;
  } finally {
    transporter.close();
  }
};

module.exports = sendEmail;