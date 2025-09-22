// Azure Function for contact form using Resend
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || '');
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'pranavanaadaa@gmail.com';
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';

module.exports = async function (context, req) {
  const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    context.res = { status: 200, headers };
    return;
  }

  if (req.method !== 'POST') {
    context.res = { status: 405, headers, body: { error: 'Method Not Allowed' } };
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    context.res = { status: 500, headers, body: { error: 'Server email not configured' } };
    return;
  }

  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) {
      context.res = { status: 400, headers, body: { error: 'Missing required fields' } };
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
      context.res = { status: 500, headers, body: { error: 'Failed to send email' } };
      return;
    }

    context.res = { status: 200, headers, body: { ok: true } };
  } catch (e) {
    context.res = { status: 500, headers, body: { error: 'Unexpected server error' } };
  }
};
