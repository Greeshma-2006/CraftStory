const https = require('https');

/**
 * Uses Brevo REST API over HTTPS port 443.
 * Render blocks ALL outbound SMTP (587, 465, 25).
 * Port 443 HTTPS is never blocked anywhere.
 *
 * Render env vars needed:
 *   BREVO_API_KEY  — from Brevo dashboard (see below)
 *   EMAIL_FROM     — ggreeshma.ai@gmail.com (must be verified in Brevo)
 */
const sendEmail = ({ email, subject, html }) => {
  return new Promise((resolve, reject) => {

    const apiKey    = process.env.BREVO_API_KEY;
    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    if (!apiKey) {
      return reject(new Error(
        'BREVO_API_KEY not set. Get it from Brevo → top-right avatar → SMTP & API → API Keys tab → Generate.'
      ));
    }

    const body = JSON.stringify({
      sender:      { name: 'CraftStory', email: fromEmail },
      to:          [{ email }],
      subject,
      htmlContent: html,
    });

    const req = https.request({
      hostname: 'api.brevo.com',
      path:     '/v3/smtp/email',
      method:   'POST',
      headers:  {
        'Content-Type':   'application/json',
        'Content-Length': Buffer.byteLength(body),
        'api-key':        apiKey,
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`✓ Email sent to ${email}`);
          resolve();
        } else {
          const msg = `Brevo error ${res.statusCode}: ${data}`;
          console.error('✗', msg);
          reject(new Error(msg));
        }
      });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Brevo API request timed out'));
    });

    req.on('error', err => {
      console.error('✗ Email request error:', err.message);
      reject(err);
    });

    req.write(body);
    req.end();
  });
};

module.exports = sendEmail;