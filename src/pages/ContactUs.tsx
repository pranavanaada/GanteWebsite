import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import whatsappIcon from '../assets/whatsapp.svg';
import { WHATSAPP_DISPLAY, WHATSAPP_WA_LINK, EMAIL, MAILTO_LINK } from '../config/contact';
import copyIcon from '../assets/copy.svg';

const ContactUs = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const prefill = useMemo(() => {
    const product = params.get('product') || '';
    const type = params.get('type') || '';
    const price = params.get('price') || '';
    const city = params.get('city') || '';
    const area = params.get('area') || '';
    const pincode = params.get('pincode') || '';
    const loc = [city, area].filter(Boolean).join(' - ');
    const locFinal = [loc, pincode].filter(Boolean).join(' ');
    const lines = [
      product && `Product: ${product}`,
      type && `Type: ${type}`,
      price && `Price: ${price}`,
      locFinal && `Location: ${locFinal}`,
      '',
      'Hi, I would like to know more about this product.',
    ].filter(Boolean);
    return lines.join('\n');
  }, [params]);

  const [copied, setCopied] = useState<string | null>(null);
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <div className="contact-us-page">
      <div className="contact-hero">
        <h1 className="contact-title">{t('contact')}</h1>
        <div className="hero-decoration">
          <div className="contact-icon-main">📞</div>
        </div>
        <p className="contact-subtitle">
          Connect with us for spiritual guidance and premium bell collections
        </p>
      </div>

      <div className="contact-container">
        <div className="contact-info-card">
          <div className="card-header">
            <h2 className="contact-heading">{t('getInTouch')}</h2>
            <div className="header-decoration"></div>
          </div>
          
          <div className="contact-details">
            <div className="contact-item whatsapp-item">
              <div className="contact-icon-wrapper whatsapp-icon">
                <img src={whatsappIcon} alt="WhatsApp" width={24} height={24} />
              </div>
              <div className="contact-info">
                <span className="contact-label">WhatsApp</span>
                <a
                  className="contact-value whatsapp-link"
                  href={WHATSAPP_WA_LINK(prefill)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </div>
              <button
                className="copy-btn whatsapp-copy"
                onClick={() => copyToClipboard(WHATSAPP_DISPLAY, 'wa')}
                title="Copy WhatsApp number"
              >
                <img src={copyIcon} alt="Copy" width={18} height={18} />
                {copied === 'wa' && <span className="copied-indicator">Copied!</span>}
              </button>
            </div>

            <div className="contact-item email-item">
              <div className="contact-icon-wrapper email-icon">
                <span>✉️</span>
              </div>
              <div className="contact-info">
                <span className="contact-label">Email</span>
                <a
                  className="contact-value email-link"
                  href={MAILTO_LINK('Product enquiry', prefill)}
                >
                  {EMAIL}
                </a>
              </div>
              <button
                className="copy-btn email-copy"
                onClick={() => copyToClipboard(EMAIL, 'email')}
                title="Copy email address"
              >
                <img src={copyIcon} alt="Copy" width={18} height={18} />
                {copied === 'email' && <span className="copied-indicator">Copied!</span>}
              </button>
            </div>
          </div>

          <div className="contact-features">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <span>Quick Response</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <span>Secure Communication</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💎</div>
              <span>Premium Support</span>
            </div>
          </div>
        </div>

        <div className="contact-visual-card">
          <div className="visual-content">
            <div className="bell-animation">
              <div className="bell-container">
                <div className="bell-icon">🔔</div>
                <div className="sound-rings">
                  <div className="ring ring-1"></div>
                  <div className="ring ring-2"></div>
                  <div className="ring ring-3"></div>
                </div>
              </div>
            </div>
            <h3 className="visual-title">Reach Out to Us</h3>
            <p className="visual-description">
              Experience the divine sound of Pranavanaada bells. 
              Our team is here to help you find the perfect spiritual companion.
            </p>
            <div className="om-symbol-decoration">ॐ</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;