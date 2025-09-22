// Serverless email endpoint for Vercel/Netlify
// Uses Resend to send messages
const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'pranavanaadaa@gmail.com';
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const resend = new Resend(RESEND_API_KEY);

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  if (!RESEND_API_KEY) {
    res.status(500).json({ error: 'Server email not configured' });
    return;
  }
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const subject = `New enquiry from ${name}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      '',
      message,
    ].filter(Boolean).join('\n');

    const { error } = await resend.emails.send({
      from: RESEND_FROM,
      to: CONTACT_TO_EMAIL,
      subject,
      text,
    });

    if (error) {
      res.status(500).json({ error: 'Failed to send email' });
      return;
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected server error' });
  }
};
