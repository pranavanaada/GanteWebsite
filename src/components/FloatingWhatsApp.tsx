import './FloatingWhatsApp.css';
import whatsappIcon from '../assets/whatsapp.svg';
import { WHATSAPP_WA_LINK } from '../config/contact';
import { useMemo } from 'react';

const FloatingWhatsApp = () => {
  // Build a lightweight default message; try to include city/area if available
  const defaultText = useMemo(() => {
    try {
      const saved = localStorage.getItem('userLocation');
      const parsed = saved ? JSON.parse(saved) : null;
      const city = parsed?.city || '';
      const area = parsed?.areaName || parsed?.name || '';
      const pin = parsed?.postal || '';
      const loc = [city, area].filter(Boolean).join(' - ');
      const locFinal = [loc, pin].filter(Boolean).join(' ');
      const parts = [
        'Hi, I would like to know more.',
        locFinal && `My location: ${locFinal}`,
      ].filter(Boolean);
      return parts.join('\n');
    } catch {
      return 'Hi, I would like to know more.';
    }
  }, []);

  return (
    <a
      className="floating-whatsapp-btn"
      href={WHATSAPP_WA_LINK(defaultText)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <img src={whatsappIcon} alt="WhatsApp" />
    </a>
  );
};

export default FloatingWhatsApp;
