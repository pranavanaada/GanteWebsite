import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import './App.css'
import './components/Navbar.css'
import './i18n/i18n'
import Navbar from './components/Navbar'
import ImageCarousel from './components/ImageCarousel'
import ProductsSection from './components/ProductsSection'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import ProductPage from './pages/ProductPage'
import ProductsPage from './pages/ProductsPage'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import ScrollToTop from './components/ScrollToTop'


// Import Jayagante images
import jayagante1 from './assets/products/jayagante/jaya-removebg-preview.png'
import jayagante2 from './assets/products/jayagante/jaya1-removebg-preview.png'
import jayagante3 from './assets/products/jayagante/jaya3-removebg-preview.png'

// Import Hanging Bell images
import hangingBell1 from './assets/products/hanging-bells/hang-removebg-preview.png'
import hangingBell2 from './assets/products/hanging-bells/hang1-removebg-preview (2).png'
import hangingBell4 from './assets/products/hanging-bells/hang_5-removebg-preview.png'

// Import Home Carousel images
import homeCarousel1 from './assets/products/Home carousel/Anjaneya.png'
import homeCarousel2 from './assets/products/Home carousel/gola.png'
import homeCarousel3 from './assets/products/Home carousel/Hanging.png'
import homeCarousel4 from './assets/products/Home carousel/Jayagante.png'
import homeCarousel5 from './assets/products/Home carousel/PRANAVA.png'

// Import Hand Bell images by type
// Type 1 - Shanka Chakra
import handBellType1_1 from './assets/products/hand-bells/type-1/CHAKRA.jpg'
import handBellType1_2 from './assets/products/hand-bells/type-1/CHAKRA 1.jpg'
import handBellType1_3 from './assets/products/hand-bells/type-1/hang1-removebg-preview (1).png'
import handBellType1_4 from './assets/products/hand-bells/type-1/SHANKA.jpg'
import handBellType1_5 from './assets/products/hand-bells/type-1/SHANKA 1.jpg'

// Type 2 - Anjeneya
import handBellType2_1 from './assets/products/hand-bells/type-2/hang1-removebg-preview.png'
import handBellType2_2 from './assets/products/hand-bells/type-2/ANJANEYA.jpg'
import handBellType2_3 from './assets/products/hand-bells/type-2/GARUDA.jpg'
import handBellType2_4 from './assets/products/hand-bells/type-2/GARUDA 2.jpg'

// Type 3 - Brahmanda Gola
import handBellType3_1 from './assets/products/hand-bells/type-3/gola-removebg-preview.png'
import handBellType3_2 from './assets/products/hand-bells/type-3/hang1-removebg-preview (2).png'

// Type 4 - Nandi
import handBellType4_1 from './assets/products/hand-bells/type-4/NANDI.jpg'
import handBellType4_2 from './assets/products/hand-bells/type-4/NANDI 1.jpg'
import handBellType4_3 from './assets/products/hand-bells/type-4/NANDI 2.jpg'

// Type 5 - Pranava
import handBellType5_1 from './assets/products/hand-bells/type-5/hang1-removebg-preview (2).png'
import handBellType5_2 from './assets/products/hand-bells/type-5/PRANAVA-removebg-preview (1).png'

// Hand Bell images organized by type
const handBellImages = {
  1: {
    name: 'Shanka Chakra',
    images: [handBellType1_1, handBellType1_2, handBellType1_3, handBellType1_4, handBellType1_5],
    thumbnail: handBellType1_1
  },
  2: {
    name: 'Anjeneya',
    images: [handBellType2_1, handBellType2_2, handBellType2_3, handBellType2_4],
    thumbnail: handBellType2_2
  },
  3: {
    name: 'Brahmanda Gola',
    images: [handBellType3_1, handBellType3_2],
    thumbnail: handBellType3_1
  },
  4: {
    name: 'Nandi',
    images: [handBellType4_1, handBellType4_2, handBellType4_3],
    thumbnail: handBellType4_1
  },
  5: {
    name: 'Pranava',
    images: [handBellType5_1, handBellType5_2],
    thumbnail: handBellType5_2
  }
};

const carouselImages = [
  { src: homeCarousel4, alt: 'Jayagante Bells' },
  { src: homeCarousel1, alt: 'Anjaneya Hand Bell' },
  { src: homeCarousel3, alt: 'Premium Hanging Bell' },
  { src: homeCarousel2, alt: 'Brahmanda Gola Hand Bell' },
  { src: homeCarousel5, alt: 'Pranava Hand Bell' }
];

function App() {
  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <Navbar />
        <FloatingWhatsApp />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/hand-bell" element={
            <ProductPage type="hand-bell" images={handBellImages[1].images} handBellImages={handBellImages} initialHandBellType={1} />
          } />
          <Route path="/products/hand-bell/shanka-chakra" element={
            <ProductPage type="hand-bell" images={handBellImages[1].images} handBellImages={handBellImages} initialHandBellType={1} />
          } />
          <Route path="/products/hand-bell/anjeneya" element={
            <ProductPage type="hand-bell" images={handBellImages[2].images} handBellImages={handBellImages} initialHandBellType={2} />
          } />
          <Route path="/products/hand-bell/brahmanda-gola" element={
            <ProductPage type="hand-bell" images={handBellImages[3].images} handBellImages={handBellImages} initialHandBellType={3} />
          } />
          <Route path="/products/hand-bell/nandi" element={
            <ProductPage type="hand-bell" images={handBellImages[4].images} handBellImages={handBellImages} initialHandBellType={4} />
          } />
          <Route path="/products/hand-bell/pranava" element={
            <ProductPage type="hand-bell" images={handBellImages[5].images} handBellImages={handBellImages} initialHandBellType={5} />
          } />
          <Route path="/products/hanging-bell" element={
            <ProductPage type="hanging-bell" images={[hangingBell1, hangingBell2, hangingBell4]} />
          } />
          <Route path="/products/jayagante" element={
            <ProductPage type="jayagante" images={[jayagante1, jayagante2, jayagante3]} />
          } />
        </Routes>
        <SpeedInsights />
        <Analytics />
      </div>
    </Router>
  );
}

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleExploreCollection = () => {
    scrollToSection('products-section');
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="welcome-title">
              <span className="title-line-1">{t('welcome')}</span>
              <span className="title-line-2">{t('sacredPoojaRings')}</span>
            </h1>
            <p className="hero-subtitle">
              {t('heroSubtitle')}
            </p>
            <div className="hero-badges">
              <div className="badge">
                <span className="badge-icon">🏺</span>
                <span>{t('handcrafted')}</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🕉️</span>
                <span>{t('spiritual')}</span>
              </div>
              <div className="badge">
                <span className="badge-icon">⭐</span>
                <span>{t('premiumQuality')}</span>
              </div>
            </div>
          </div>
          <div className="hero-carousel">
            <ImageCarousel images={carouselImages} />
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-bell floating-bell-1">🔔</div>
          <div className="floating-bell floating-bell-2">🪬</div>
          <div className="floating-bell floating-bell-3">🕉️</div>
          <div className="floating-bell floating-bell-4">🔔</div>
        </div>
        
        {/* Sacred Geometry Background */}
        <div className="sacred-geometry">
          <div className="geometry-circle circle-1"></div>
          <div className="geometry-circle circle-2"></div>
          <div className="geometry-circle circle-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">{t('whyChooseTitle')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>{t('divineSound')}</h3>
              <p>{t('divineSoundDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>{t('authenticCraftsmanship')}</h3>
              <p>{t('authenticCraftsmanshipDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>{t('spiritualSignificance')}</h3>
              <p>{t('spiritualSignificanceDesc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>{t('premiumMaterials')}</h3>
              <p>{t('premiumMaterialsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="home-products-section" id="products-section">
        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-bell floating-bell-1">🔔</div>
          <div className="floating-bell floating-bell-2">🪈</div>
          <div className="floating-bell floating-bell-3">🕉️</div>
          <div className="floating-bell floating-bell-4">📿</div>
          <div className="floating-bell floating-bell-5">🔔</div>
        </div>
        
        <div className="section-header">
          <h2 className="section-title">{t('ourSacredCollection')}</h2>
          <p className="section-subtitle">{t('perfectBellDesc')}</p>
          <div className="section-ornament">
            <div className="ornament-line"></div>
            <div className="ornament-center">✨</div>
            <div className="ornament-line"></div>
          </div>
        </div>
        <ProductsSection />
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="testimonials-title">{t('sacredExperiences')}</h2>
          
          {/* Featured Video Section */}
          <div className="featured-video-section">
            <div className="video-container">
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/DHCXuPPhlOM"
                  title="Sacred Bell Experience - Pranavaada"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="youtube-video"
                ></iframe>
              </div>
              <div className="video-description">
                <h3 className="video-title">{t('featuredVideoTitle')}</h3>
                <p className="video-subtitle">{t('featuredVideoDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">{t('ctaTitle')}</h2>
            <p className="cta-subtitle">{t('ctaSubtitle')}</p>
            <div className="cta-buttons">
              <button 
                className="cta-button primary"
                onClick={handleExploreCollection}
              >
                {t('exploreCollection')}
              </button>
              <button 
                className="cta-button secondary"
                onClick={handleContactUs}
              >
                {t('contactUs')}
              </button>
            </div>
          </div>
          <div className="cta-visual">
            <div className="spiritual-symbol">🕉️</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;

