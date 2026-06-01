const nodemailer = require('nodemailer');
const dns        = require('dns');

// Force Node.js to prefer IPv4 over IPv6 globally.
// This fixes "ENETUNREACH" errors on servers that don't support IPv6
// (common on Render, Railway, Heroku free tier, etc.)
dns.setDefaultResultOrder('ipv4first');

// Create ONE transporter instance and reuse it for every email.
// Recreating it on every call wastes 2-5 seconds per email.
//
// Port 587 + STARTTLS is more reliable than 465 + SSL on cloud hosts
// because many providers block or mis-route port 465.
const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   587,
  secure: false,          // false = STARTTLS (upgrades after connect)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Explicit IPv4 socket binding — belt-and-suspenders fix
  // for the IPv6 unreachable error
  tls: {
    rejectUnauthorized: false,
  },
  // Socket family: 4 = IPv4 only
  family: 4,
});

/**
 * sendEmail({ email, subject, html })
 * Throws on failure so callers can return 500 with the real message.
 */
const sendEmail = async ({ email, subject, html }) => {

  // NOTE: transporter.verify() has been removed from here.
  // It caused a full SMTP handshake BEFORE every send, adding
  // 3-10 seconds of latency to every forgot-password / admin-login request.
  // If you need to test the connection, call transporter.verify() once
  // at server startup (server.js), not per-request.

  await transporter.sendMail({
    from:    `"CraftStory" <${process.env.EMAIL_USER}>`,
    to:      email,
    subject,
    html,
  });
};

module.exports = sendEmail;
