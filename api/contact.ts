// Serverless email endpoint (Vercel/Netlify-compatible Node handler)
// Sends contact form messages using Resend
import type { IncomingMessage, ServerResponse } from 'http';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'pranavanaadaa@gmail.com';
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const resend = new Resend(RESEND_API_KEY);

function setCors(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req: IncomingMessage & { method?: string; body?: any }, res: ServerResponse & { status?: (code: number) => any }) {
  setCors(res);
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  if (!RESEND_API_KEY) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server email not configured' }));
    return;
  }

  try {
    const body = await readJson(req);
    const { name, email, phone, message } = body || {};

    if (!name || !email || !message) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Missing required fields' }));
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
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to send email' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unexpected server error' }));
  }
}

async function readJson(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', (err) => reject(err));
  });
}
