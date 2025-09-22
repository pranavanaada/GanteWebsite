import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const isEmailConfigured = () => Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

let initialized = false;
export const initEmail = () => {
  if (!initialized && PUBLIC_KEY) {
    emailjs.init(PUBLIC_KEY);
    initialized = true;
  }
};

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export const sendContactEmail = async (payload: ContactPayload) => {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS is not configured. Please set VITE_EMAILJS_* env vars.');
  }
  initEmail();
  const templateParams = {
    from_name: payload.name,
    from_email: payload.email,
    phone: payload.phone || '',
    message: payload.message,
    to_email: 'pranavanaadaa@gmail.com',
  };
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
};
