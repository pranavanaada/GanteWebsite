import './ProductPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ganteSound from '../assets/products/Gante sound.mp3';

interface ProductPageProps {
  type: 'hand-bell' | 'hanging-bell' | 'jayagante';
  images: string[];
  handBellImages?: {
    [key: number]: {
      name: string;
      images: string[];
      thumbnail: string;
    };
  };
  initialHandBellType?: 1 | 2 | 3 | 4 | 5;
}

const ProductPage = ({ type, images, handBellImages, initialHandBellType }: ProductPageProps) => {
  const [selectedWeight, setSelectedWeight] = useState<'1000' | '1500' | '2000' | '3500' | '5000' | '6000' | '12000'>('1000');
  const [selectedHandBellType, setSelectedHandBellType] = useState<1 | 2 | 3 | 4 | 5>(initialHandBellType || 1);
  
  // Initialize images based on product type
  const getInitialImages = () => {
    if (type === 'hand-bell' && handBellImages) {
      return handBellImages[1].images; // Default to type 1
    }
    return images;
  };
  
  const [currentImages, setCurrentImages] = useState(getInitialImages());
  const [mainImage, setMainImage] = useState(getInitialImages()[0]);

  // Hand Bell type definitions
  const handBellTypes = handBellImages || {
    1: { name: 'Shanka Chakra', images: [], thumbnail: '' },
    2: { name: 'Anjeneya', images: [], thumbnail: '' },
    3: { name: 'Brahmanda Gola', images: [], thumbnail: '' },
    4: { name: 'Nandi', images: [], thumbnail: '' },
    5: { name: 'Pranava', images: [], thumbnail: '' }
  };
  const [showModal, setShowModal] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [detectedLocation, setDetectedLocation] = useState<{city?: string; postal?: string; areaName?: string} | null>(null);
  const [editingPincode, setEditingPincode] = useState(false);
  const [tempPincode, setTempPincode] = useState('');
  const [savingPin, setSavingPin] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(ganteSound));
  const navigate = useNavigate();

  // Initialize weight based on product type
  useEffect(() => {
    if (type === 'hanging-bell') {
      setSelectedWeight('2000'); // Default to 2kg for hanging bells
    } else if (type === 'jayagante') {
      setSelectedWeight('1000'); // Default to 1000g for jayagante
    } else if (type === 'hand-bell') {
      setSelectedWeight('1000'); // Default to 1kg for hand bells
    }
  }, [type]);

  // Reset images when product type or images prop changes
  useEffect(() => {
    if (type === 'hand-bell' && handBellImages) {
      const typeToUse = initialHandBellType || 1;
      const newImages = handBellImages[typeToUse].images;
      setCurrentImages(newImages);
      setMainImage(newImages[0]);
      setSelectedHandBellType(typeToUse);
    } else {
      setCurrentImages(images);
      setMainImage(images[0]);
    }
  }, [type, images, handBellImages, initialHandBellType]);

  // Update images when hand bell type changes
  useEffect(() => {
    if (type === 'hand-bell' && handBellImages && handBellImages[selectedHandBellType]) {
      const newImages = handBellImages[selectedHandBellType].images;
      if (newImages && newImages.length > 0) {
        setCurrentImages(newImages);
        setMainImage(newImages[0]);
        // Scroll to top when changing hand bell types
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [selectedHandBellType, type, handBellImages]);

  useEffect(() => {
    // Try to read location saved by Navbar
    try {
      const saved = localStorage.getItem('userLocation');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.city || parsed.postal)) {
          setDetectedLocation({ city: parsed.city, postal: parsed.postal, areaName: parsed.areaName || parsed.name });
        }
      }
    } catch {}
  }, []);

  // Audio control function
  const playBellSound = () => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      audio.play().then(() => {
        // Audio started successfully
      }).catch((error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
      
      // Reset playing state when audio ends
      audio.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const normalizeCity = (v?: string) => (v || '').toLowerCase();
  const isBangalore = () => {
    const city = normalizeCity(detectedLocation?.city);
    const pin = detectedLocation?.postal || '';
    return city.includes('bengaluru') || city.includes('bangalore') || city.includes('bengalore') || pin.startsWith('560');
  };

  const formatDeliveryDate = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const weekday = weekdays[d.getDay()];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    return `${weekday} ${day} ${month}`;
  };

  const deliveryDays = isBangalore() ? 0 : 3;
  const deliveryDateLabel = formatDeliveryDate(deliveryDays);

  const lookupCityByPincode = async (pin: string): Promise<{ city: string | null; areaName: string | null }> => {
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
        const po = data[0].PostOffice[0];
        // Prefer District; fallback to Block/Division
        const rawCity = po.District || po.Block || po.Division || '';
        // Use PostOffice Name as area name
        const areaName = po.Name || null;
        // Normalize Bengaluru variants
        const cityLower = rawCity.toLowerCase();
        const city = (cityLower.includes('bengaluru') || cityLower.includes('bangalore')) ? 'Bengaluru' : rawCity;
        return { city, areaName };
      }
    } catch {}
    return { city: null, areaName: null };
  };

  const handleSavePincode = async () => {
    const pin = tempPincode.trim();
    if (!/^\d{6}$/.test(pin)) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }
    setSavingPin(true);
    let newCity: string | undefined = undefined;
    let newArea: string | undefined = undefined;
    const resolved = await lookupCityByPincode(pin);
    if (resolved.city && resolved.city.trim()) {
      newCity = resolved.city.trim();
      newArea = resolved.areaName || detectedLocation?.areaName;
    } else if (pin.startsWith('560')) {
      // Fallback inference for Bengaluru if API fails
      newCity = 'Bengaluru';
    } else {
      newCity = detectedLocation?.city; // Keep prior city if lookup failed
    }
    const newLoc = { city: newCity, postal: pin, areaName: newArea };
    setDetectedLocation(newLoc);
    try {
      const saved = localStorage.getItem('userLocation');
      const base = saved ? JSON.parse(saved) : {};
      localStorage.setItem('userLocation', JSON.stringify({ ...base, ...newLoc }));
      // Notify other parts (like Navbar) in the same tab
      window.dispatchEvent(new CustomEvent('userLocationChange'));
    } catch {}
    setSavingPin(false);
    setEditingPincode(false);
  };

  const handleThumbnailClick = (img: string) => {
    setMainImage(img);
  };

  const handleImageClick = () => {
    setShowModal(true);
    setZoom(1);
  };

  const handleModalClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  // Weight specifications for different product types
  const weightSpecs = {
    // Jayagante weights (in grams)
    '1000': {
      price: '₹5,000',
      features: ['Length 8 inches', 'Width 3mm', 'Wooden stick free']
    },
    '1500': {
      price: '₹7,000',
      features: ['Length 10 inch diameter', 'Width 3mm', 'Wooden stick free']
    },
    // Hanging Bell weights (in grams - 2kg=2000g, 3.5kg=3500g, 5kg=5000g, 6kg=6000g, 12kg=12000g)
    '2000': {
      price: '₹12,000',
      features: ['Height 7 inches', 'Diameter 6 inches', 'Weight 2 kg']
    },
    '3500': {
      price: '₹13,500',
      features: ['Height 6 inches', 'Diameter 6 inches', 'Weight 3.5 kg']
    },
    '5000': {
      price: '₹16,000',
      features: ['Height 9 inches', 'Diameter 9 inches', 'Weight 5 kg']
    },
    '6000': {
      price: '₹18,000',
      features: ['Height 9 inches', 'Diameter 9 inches', 'Weight 6 kg']
    },
    '12000': {
      price: '₹33,000',
      features: ['Height 10 inches', 'Diameter 10 inches', 'Weight 12 kg']
    }
  };

  // Hand Bell weight specifications (separate from weightSpecs for different weight ranges)
  const handBellWeightSpecs = {
    '1000': {
      price: '₹8,000',
      features: ['Height 9 inches', 'Width 5 inches', 'Weight 1 kg']
    },
    '1500': {
      price: '₹10,000',
      features: ['Height 10 inches', 'Width 5.5 inches', 'Weight 1.5 kg']
    },
    '2000': {
      price: '₹12,000',
      features: ['Height 11 inches', 'Width 5.5 inches', 'Weight 2 kg']
    }
  };

  // Get current product info based on weight selection
  const getCurrentProductInfo = () => {
    if (type === 'jayagante' || type === 'hanging-bell') {
      return {
        price: weightSpecs[selectedWeight as keyof typeof weightSpecs].price,
        name: type === 'jayagante' ? 'Jayagante' : 'Hanging Bell',
        features: weightSpecs[selectedWeight as keyof typeof weightSpecs].features,
      };
    }
    // For hand-bell - use handBellWeightSpecs and show type name
    if (type === 'hand-bell') {
      const currentType = handBellTypes[selectedHandBellType];
      return {
        price: handBellWeightSpecs[selectedWeight as keyof typeof handBellWeightSpecs].price,
        name: currentType.name,
        features: handBellWeightSpecs[selectedWeight as keyof typeof handBellWeightSpecs].features,
      };
    }
    // Default fallback
    return {
      price: '₹1,500',
      name: 'Hand Bell',
      features: ['Feature 1', 'Feature 2', 'Feature 3'],
    };
  };

  // Calculate original price (20% higher) and format prices
  const getPriceInfo = (price: string) => {
    // Extract numeric value from price string (₹5,000 -> 5000)
    const numericPrice = parseInt(price.replace(/[₹,]/g, ''));
    
    // Calculate original price (20% higher)
    const originalPrice = Math.round(numericPrice * 1.2);
    
    // Format prices back to currency format
    const formatPrice = (num: number) => `₹${num.toLocaleString('en-IN')}`;
    
    return {
      originalPrice: formatPrice(originalPrice),
      discountedPrice: price,
      savingsAmount: formatPrice(originalPrice - numericPrice),
      discountPercentage: '20%'
    };
  };

  const productInfo = getCurrentProductInfo();

  return (
    <div className="product-page">
      <div className="product-details-amazon">
        <div className="product-gallery-amazon">
          <div className="gallery-flex-row">
            <div className="thumbnail-list-vertical">
              {currentImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${productInfo.name} thumbnail ${idx + 1}`}
                  className={`thumbnail-image${mainImage === img ? ' active' : ''}`}
                  onClick={() => handleThumbnailClick(img)}
                />
              ))}
            </div>
            <div className="main-image-container">
              <img
                src={mainImage}
                alt={productInfo.name}
                className="main-product-image"
                onClick={handleImageClick}
                style={{ cursor: 'zoom-in' }}
              />
            </div>
          </div>
        </div>
        <div className="product-summary-amazon">
          <h1 className="product-title">{productInfo.name}</h1>
          
          {/* Weight Selection for Jayagante */}
          {type === 'jayagante' && (
            <div className="weight-selection" style={{ 
              margin: '1rem 0', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef' 
            }}>
              <h3 style={{ 
                margin: '0 0 0.8rem 0', 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: '#333' 
              }}>Weight:</h3>
              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={() => setSelectedWeight('1000')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '1000' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '1000' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '1000' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '1000' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  1000 gram
                </button>
                <button
                  onClick={() => setSelectedWeight('1500')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '1500' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '1500' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '1500' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '1500' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  1500 gram
                </button>
              </div>
            </div>
          )}

          {/* Weight Selection for Hanging Bell */}
          {type === 'hanging-bell' && (
            <div className="weight-selection" style={{ 
              margin: '1rem 0', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef' 
            }}>
              <h3 style={{ 
                margin: '0 0 0.8rem 0', 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: '#333' 
              }}>Weight:</h3>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedWeight('2000')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '2000' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '2000' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '2000' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '2000' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  2 kg
                </button>
                <button
                  onClick={() => setSelectedWeight('3500')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '3500' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '3500' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '3500' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '3500' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  3.5 kg
                </button>
                <button
                  onClick={() => setSelectedWeight('5000')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '5000' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '5000' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '5000' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '5000' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  5 kg
                </button>
                <button
                  onClick={() => setSelectedWeight('6000')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '6000' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '6000' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '6000' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '6000' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  6 kg
                </button>
                <button
                  onClick={() => setSelectedWeight('12000')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '12000' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '12000' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '12000' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '12000' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  12 kg
                </button>
              </div>
            </div>
          )}

          {/* Weight Selection for Hand Bell */}
          {type === 'hand-bell' && (
            <div className="weight-selection" style={{ 
              margin: '1rem 0', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px', 
              border: '1px solid #e9ecef' 
            }}>
              <h3 style={{ 
                margin: '0 0 0.8rem 0', 
                fontSize: '1.1rem', 
                fontWeight: 600, 
                color: '#333' 
              }}>Weight:</h3>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedWeight('1000')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '1000' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '1000' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '1000' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '1000' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  1 kg
                </button>
                <button
                  onClick={() => setSelectedWeight('1500')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '1500' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '1500' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '1500' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '1500' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  1.5 kg
                </button>
                <button
                  onClick={() => setSelectedWeight('2000')}
                  style={{
                    padding: '0.6rem 1.2rem',
                    border: selectedWeight === '2000' ? '2px solid #1976d2' : '1px solid #ccc',
                    borderRadius: '6px',
                    backgroundColor: selectedWeight === '2000' ? '#e3f2fd' : 'white',
                    color: selectedWeight === '2000' ? '#1976d2' : '#666',
                    fontWeight: selectedWeight === '2000' ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem'
                  }}
                >
                  2 kg
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Price Section with Discount */}
          <div className="product-price-section">
            {(() => {
              const priceInfo = getPriceInfo(productInfo.price);
              return (
                <>
                  <div className="price-display">
                    <span className="original-price">{priceInfo.originalPrice}</span>
                    <span className="current-price">{priceInfo.discountedPrice}</span>
                    <span className="discount-badge">{priceInfo.discountPercentage} OFF</span>
                  </div>
                  <div className="savings-text">
                    You save {priceInfo.savingsAmount} ({priceInfo.discountPercentage})
                  </div>
                </>
              );
            })()}
          </div>
          
          {/* Sound Preview Button - Only for Hand Bells */}
          {type === 'hand-bell' && (
            <div className="sound-preview-section">
              <button 
                className={`sound-preview-btn ${isPlaying ? 'playing' : ''}`}
                onClick={playBellSound}
                title={isPlaying ? 'Stop bell sound' : 'Play bell sound'}
              >
                <div className="sound-icon">
                  {isPlaying ? (
                    <span className="pause-icon">⏸️</span>
                  ) : (
                    <span className="play-icon">🔊</span>
                  )}
                </div>
                <span className="sound-text">
                  {isPlaying ? 'Playing Bell Sound...' : 'Listen to Bell Sound'}
                </span>
                <div className={`sound-waves ${isPlaying ? 'active' : ''}`}>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                  <div className="wave-bar"></div>
                </div>
              </button>
            </div>
          )}
          
          <div className="delivery-info-amazon">
            <span className="free-delivery-text" style={{ fontWeight: 600 }}>FREE delivery</span>{' '}
            <span className="delivery-date-text" style={{ fontWeight: 500 }}>{deliveryDateLabel}</span>
            <br />
            {!editingPincode ? (
              <span className="delivery-location-text" style={{ fontSize: '0.95rem' }}>
                {(detectedLocation?.city || detectedLocation?.postal)
                  ? `Delivering to ${detectedLocation?.city ?? ''}${detectedLocation?.areaName ? ' - ' + detectedLocation.areaName : ''} ${detectedLocation?.postal ?? ''}`.trim()
                  : 'Delivering to your location'}
                <button
                  className="change-location-btn"
                  onClick={() => { setEditingPincode(true); setTempPincode(detectedLocation?.postal || ''); }}
                  style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >Change</button>
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter pincode"
                  value={tempPincode}
                  onChange={e => setTempPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }}
                />
                <button onClick={handleSavePincode} disabled={savingPin} style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: 4, cursor: 'pointer', opacity: savingPin ? 0.8 : 1 }}>{savingPin ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setEditingPincode(false)} style={{ background: 'transparent', color: '#555', border: '1px solid #ccc', padding: '4px 10px', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
              </span>
            )}
          </div>
          
          <button
            className="buy-now-btn"
            onClick={() => {
              const qp = new URLSearchParams({
                product: productInfo.name,
                type,
                price: productInfo.price,
                weight: (type === 'jayagante' || type === 'hanging-bell' || type === 'hand-bell') ? selectedWeight : '',
                handBellType: type === 'hand-bell' ? handBellTypes[selectedHandBellType].name : '',
                city: detectedLocation?.city || '',
                area: detectedLocation?.areaName || '',
                pincode: detectedLocation?.postal || '',
              }).toString();
              navigate(`/contact?${qp}`);
            }}
          >
            Know more
          </button>
        </div>
      </div>

      {/* Features Section - Now below the image gallery */}
      <div className="product-features-section">
        <div className="features-container">
          <h3>Product Features</h3>
          <ul className="features-list">
            {productInfo.features.map((feature, index) => (
              <li key={index} className="feature-item">{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="image-modal-overlay" onClick={handleModalClose}>
          <div className="image-modal-content">
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
            >
              ×
            </button>
            <img
              src={mainImage}
              alt={productInfo.name}
              className="modal-image"
              style={{
                transform: `scale(${zoom})`,
                maxWidth: zoom > 1.2 ? '60vw' : '80vw',
                maxHeight: zoom > 1.2 ? '50vh' : '70vh',
              }}
              onWheel={e => {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.1 : -0.1;
                setZoom((z: number) => Math.min(2, Math.max(1, z + delta)));
              }}
            />
            <div className="modal-thumbnails" style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {currentImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${productInfo.name} ${idx + 1}`}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: mainImage === img ? '3px solid #1976d2' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                    opacity: mainImage === img ? 1 : 0.7
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = mainImage === img ? '1' : '0.7'}
                />
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
              {productInfo.name}
            </div>
          </div>
        </div>
      )}

      {/* Other Hand Bell Types Section - only show for hand-bell type */}
      {type === 'hand-bell' && (
        <div className="hand-bell-types-section">
          <h3>Other Hand Bell Types</h3>
          <div className="hand-bell-types-grid">
            {Object.entries(handBellTypes).map(([typeNum, typeInfo]) => {
              const currentTypeNum = parseInt(typeNum) as 1 | 2 | 3 | 4 | 5;
              if (currentTypeNum === selectedHandBellType) return null; // Don't show current type
              
              return (
                <div key={typeNum} className="hand-bell-type-card">
                  
                  {/* Type Image - using thumbnail from handBellImages */}
                  <div className="hand-bell-type-image">
                    <img 
                      src={typeInfo.thumbnail} 
                      alt={typeInfo.name}
                    />
                  </div>
                  
                  <h4 className="hand-bell-type-name">
                    {typeInfo.name}
                  </h4>
                  
                  <button
                    className="hand-bell-type-btn"
                    onClick={() => {
                      setSelectedHandBellType(currentTypeNum);
                      setSelectedWeight('1000'); // Reset to default weight
                    }}
                  >
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;