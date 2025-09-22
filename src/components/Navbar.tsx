import { useState, useEffect } from 'react';
// import indianFlag from '../assets/indian-flag.png.svg';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { t } = useTranslation();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  // const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // const languages = [
  //   { code: 'en', name: 'English', native: 'EN', flag: indianFlag },
  //   { code: 'kn', name: 'ಕನ್ನಡ', native: 'KN', flag: indianFlag },
  // ];

  const products = [
    { id: 'hand-bell', name: t('handBell') },
    { id: 'hanging-bell', name: t('hangingBell') },
    { id: 'jayagante', name: t('jayagante') }
  ];

  // const changeLanguage = (langCode: string) => {
  //   i18n.changeLanguage(langCode);
  //   setShowLanguageDropdown(false);
  // };

  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
    setShowProductsDropdown(false);
  };

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);
  const [showThemeAnimation, setShowThemeAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'sun' | 'moon'>('sun');

  // Toggle dark mode and update document root class
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      
      // Set animation type based on the mode we're switching TO
      setAnimationType(newMode ? 'moon' : 'sun');
      setShowThemeAnimation(true);
      
      // Hide animation after 800ms
      setTimeout(() => {
        setShowThemeAnimation(false);
      }, 800);
      
      if (newMode) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
      return newMode;
    });
  };

  // Search bar state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const productOptions = [
    { id: 'hand-bell', name: t('handBell') },
    { id: 'hanging-bell', name: t('hangingBell') },
    { id: 'jayagante', name: t('jayagante') }
  ];
  const filteredOptions = searchTerm
    ? productOptions.filter(opt => opt.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSearchSelect = (id: string) => {
    setSearchTerm('');
    setSearchFocused(false);
    navigate(`/products/${id}`);
  };

  // Location state
  const [location, setLocation] = useState<{city?: string, postal?: string, name?: string, areaName?: string} | null>(null);

  useEffect(() => {
    // Prefill from localStorage if previously saved
    try {
      const saved = localStorage.getItem('userLocation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.city || parsed.postal)) {
          setLocation(parsed);
        }
      }
    } catch {}

  if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      // Use a free reverse geocoding API (e.g., Nominatim)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const areaName = data.address?.suburb || data.address?.neighbourhood || data.address?.road;
        const loc = {
          city: data.address?.city || data.address?.town || data.address?.village,
          postal: data.address?.postcode,
          name: data.address?.road || data.address?.suburb || data.address?.neighbourhood,
          areaName,
        } as {city?: string, postal?: string, name?: string, areaName?: string};
        setLocation(loc);
        try {
          // Maintain backward compatibility with existing structure (keep 'name')
          localStorage.setItem('userLocation', JSON.stringify(loc));
        } catch {}
      } catch {}
    });
    const onLocChange = () => {
      try {
        const saved = localStorage.getItem('userLocation');
        if (saved) setLocation(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('userLocationChange', onLocChange as EventListener);
    return () => window.removeEventListener('userLocationChange', onLocChange as EventListener);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand-search">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" className="brand-link">
            <span className="brand-text">
              {t('Paranavanaada')}
            </span>
          </Link>
          {location && location.city && (
            <div className="navbar-location-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '1rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {location.city}{location.postal ? ` - ${location.postal}` : ''}
              </span>
              {location.areaName && (
                <span style={{ fontSize: '0.85rem', opacity: 0.8, marginLeft: 22 }}>
                  {location.areaName}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="navbar-search">
          <input
            type="text"
            className="search-input"
            placeholder={t('Search Pranavaada.in') || 'Search products...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            autoComplete="off"
          />
          {searchFocused && filteredOptions.length > 0 && (
            <div className="search-suggestions">
              {filteredOptions.map(opt => (
                <div
                  key={opt.id}
                  className="search-suggestion"
                  onMouseDown={() => handleSearchSelect(opt.id)}
                >
                  {opt.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle mobile menu"
      >
        <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <Link to="/about" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('about')}</Link>
        <div className="dropdown">
          <button 
            className="dropdown-trigger"
            onMouseEnter={() => setShowProductsDropdown(true)}
            onMouseLeave={() => setShowProductsDropdown(false)}
            onClick={() => setShowProductsDropdown(!showProductsDropdown)}
          >
            {t('products')}
            <span className="arrow">▼</span>
          </button>
          {showProductsDropdown && (
            <div 
              className="dropdown-content"
              onMouseEnter={() => setShowProductsDropdown(true)}
              onMouseLeave={() => setShowProductsDropdown(false)}
            >
              {products.map(product => (
                <a 
                  key={product.id}
                  href={`#${product.id}`}
                  onClick={() => {
                    handleProductClick(product.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {product.name}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* <div className="dropdown language-dropdown">
          <button
            className="dropdown-trigger"
            onMouseEnter={() => setShowLanguageDropdown(true)}
            onMouseLeave={() => setShowLanguageDropdown(false)}
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img src={indianFlag} alt="IN" style={{ width: 28, height: 18, borderRadius: 3, marginRight: 4 }} />
            <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '1px' }}>
              {languages.find(l => l.code === i18n.language)?.native || 'EN'}
            </span>
            <span className="arrow">▼</span>
          </button>
          {showLanguageDropdown && (
            <div
              className="dropdown-content"
              onMouseEnter={() => setShowLanguageDropdown(true)}
              onMouseLeave={() => setShowLanguageDropdown(false)}
              style={{ minWidth: 220 }}
            >
              <div style={{ padding: '0.5rem 1rem', fontWeight: 700, color: '#d35400', fontSize: '1rem', borderBottom: '1px solid #eee' }}>
                <img src={indianFlag} alt="IN" style={{ width: 22, height: 14, borderRadius: 2, marginRight: 6, verticalAlign: 'middle' }} />
                <span style={{ color: '#d35400', fontWeight: 700 }}>English - EN</span>
              </div>
              {languages.map(lang => (
                <label key={lang.code} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '1rem' }}>
                  <input
                    type="radio"
                    name="language-select"
                    checked={i18n.language === lang.code}
                    onChange={() => {
                      changeLanguage(lang.code);
                      setIsMobileMenuOpen(false);
                    }}
                    style={{ accentColor: '#d35400' }}
                  />
                  <span style={{ fontWeight: 600 }}>{lang.name}</span>
                  <span style={{ color: '#888', fontWeight: 500 }}>{lang.native}</span>
                </label>
              ))}
              <div style={{ padding: '0.5rem 1rem', color: '#1976d2', fontSize: '0.95rem', borderTop: '1px solid #eee' }}>
              </div>
              <div style={{ padding: '0.5rem 1rem', color: '#888', fontSize: '0.95rem', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={indianFlag} alt="IN" style={{ width: 18, height: 12, borderRadius: 2 }} />
                <span>You are shopping on Pranavaada.in</span>
              </div>
            </div>
          )}
        </div> */}

        <Link to="/contact" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>{t('contact')}</Link>

        {/* Dark mode toggle button */}
        <button
          className="theme-toggle-btn"
          onClick={() => {
            toggleDarkMode();
            setIsMobileMenuOpen(false);
          }}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </nav>
    
    {/* Theme Switch Animation Overlay */}
    {showThemeAnimation && (
      <div className="theme-animation-overlay">
        <div className="theme-animation-container">
          <div className={`theme-icon ${animationType}`}>
            {animationType === 'sun' ? '☀️' : '🌙'}
          </div>
          <div className="theme-animation-text">
            {animationType === 'sun' ? 'Light Mode' : 'Dark Mode'}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Navbar;
