const nodemailer = require('nodemailer');
const dns        = require('dns');

// Force IPv4 — fixes ENETUNREACH on Render/Railway (no IPv6 support)
dns.setDefaultResultOrder('ipv4first');

/**
 * sendEmail({ email, subject, html })
 *
 * Transporter is created INSIDE this function (not at module load time).
 * This ensures process.env values are always read fresh — critical on
 * Render where env vars are injected at runtime, not at require() time.
 */
const sendEmail = async ({ email, subject, html }) => {

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // Validate credentials before attempting connection
  // This gives a clear error in Render logs instead of a cryptic SMTP failure
  if (!user || !pass) {
    throw new Error(
      'EMAIL_USER or EMAIL_PASS is not set. ' +
      'Add these in your Render environment variables dashboard.'
    );
  }

  const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   587,           // 587 + STARTTLS — more reliable than 465 on cloud hosts
    secure: false,         // false = STARTTLS (upgrades automatically)
    auth:   { user, pass },
    family: 4,             // IPv4 only
    tls:    { rejectUnauthorized: false },
    // Timeouts — prevent hanging forever on flaky cloud networks
    connectionTimeout: 10000,
    greetingTimeout:   10000,
    socketTimeout:     15000,
  });

  try {
    await transporter.sendMail({
      from:    `"CraftStory" <${user}>`,
      to:      email,
      subject,
      html,
    });

    console.log(`Email sent successfully to ${email} | Subject: ${subject}`);

  } catch (error) {
    // Log the FULL error so it appears in Render logs
    console.error('=== EMAIL SEND FAILED ===');
    console.error('To:', email);
    console.error('Subject:', subject);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('=========================');
    throw error; // re-throw so caller knows it failed
  } finally {
    transporter.close();
  }
};

module.exports = sendEmail;