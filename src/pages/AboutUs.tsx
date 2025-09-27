import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const { t } = useTranslation();
  const [showNamaste, setShowNamaste] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show namaste symbol for 2 seconds
    const namasteTimer = setTimeout(() => {
      setShowNamaste(false);
      // Then show content with fade-in
      setTimeout(() => {
        setShowContent(true);
      }, 300);
    }, 2000);

    return () => clearTimeout(namasteTimer);
  }, []);

  return (
    <div className="about-us-page">
      {/* Namaste Loading Animation */}
      {showNamaste && (
        <div className="namaste-overlay">
          <div className="namaste-container">
            <div className="namaste-symbol">🙏</div>
            <div className="namaste-text">Namaste</div>
             <div className="namaste-text">|| Sri Ranga Sadgurave Namaha ||</div>
            <div className="namaste-subtitle">{t('welcome')}</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`about-main-content ${showContent ? 'fade-in' : ''}`}>
        <div className="about-hero">
          <h1 className="about-title">{t('pranavanaada')}</h1>
          <div className="hero-decoration">
            <div className="om-symbol">ॐ</div>
          </div>
        </div>
      
      <div className="about-content">
        <section className={`story-section ${showContent ? 'animate-in' : ''}`}>
          <div className="section-header">
            <h2 className="section-title">{t('ourStory')}</h2>
            <div className="title-underline"></div>
          </div>
          <div className="story-content">
            <div className="story-text">
              <p className="story-paragraph">{t('ourStoryContent')}</p>
            </div>
            <div className="story-visual">
              <div className="bell-illustration">
                <div className="bell-circle">
                  <span className="bell-icon">🔔</span>
                </div>
                <div className="sound-waves">
                  <div className="wave wave-1"></div>
                  <div className="wave wave-2"></div>
                  <div className="wave wave-3"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="significance-section">
          <div className="section-header">
            <h2 className="section-title">{t('culturalSignificance')}</h2>
            <div className="title-underline"></div>
          </div>
          <div className="significance-content">
            <div className="significance-card">
              <div className="card-icon">🙏</div>
              <p className="significance-text">{t('culturalSignificanceContent')}</p>
            </div>
          </div>
        </section>

        <section className="metals-section">
          <div className="section-header">
            <h2 className="section-title">Panchaloha Metals</h2>
            <div className="title-underline"></div>
          </div>
          <div className="metals-grid">
            <div className="metal-item">
              <div className="metal-icon gold">Au</div>
              <span>Gold</span>
            </div>
            <div className="metal-item">
              <div className="metal-icon silver">Ag</div>
              <span>Silver</span>
            </div>
            <div className="metal-item">
              <div className="metal-icon copper">Cu</div>
              <span>Copper</span>
            </div>
            <div className="metal-item">
              <div className="metal-icon brass">Br</div>
              <span>Brass</span>
            </div>
            <div className="metal-item">
              <div className="metal-icon lead">Tin</div>
              <span>Tin</span>
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
};

export default AboutUs;
