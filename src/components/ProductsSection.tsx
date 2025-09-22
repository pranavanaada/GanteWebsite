import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

// Import latest showcase images
import handBellImage from '../assets/products/show case/Anjaneya.png';
import hangingBellImage from '../assets/products/show case/Hanging.png';
import jayaganteImage from '../assets/products/show case/Jayagante.png';

// Original 3 product categories
const products = [
  {
    id: 1,
    name: 'Hand Bells',
    image: handBellImage,
    type: 'hand-bell',
    description: 'Sacred hand bells crafted from Panchaloha metals with divine sounds.'
  },
  {
    id: 2,
    name: 'Hanging Bells',
    image: hangingBellImage,
    type: 'hanging-bell',
    description: 'Traditional hanging bells crafted from Panchaloha metals.'
  },
  {
    id: 3,
    name: 'Jayagante',
    image: jayaganteImage,
    type: 'jayagante',
    description: 'Classic Jayagante bells for spiritual rituals and ceremonies.'
  }
];

const ProductsSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();


  return (
    <section id="products">
      <h2>{t('products')}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} style={{ cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div onClick={() => navigate(`/products/${product.type}`)} style={{ width: '100%', height: '100%' }}>
              <ProductCard
                name={product.name}
                image={product.image}
                price={''}
                description={product.description}
              />
            </div>
            <button
              style={{
                marginTop: '0.7rem',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.45rem 1.2rem',
                fontWeight: 500,
                fontSize: '1rem',
                boxShadow: '0 1px 4px rgba(4, 29, 54, 0.08)',
                cursor: 'pointer',
                transition: 'background 0.15s',
                width: '80%',
                alignSelf: 'center',
                position: 'absolute',
                bottom: '18px',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
              onClick={() => navigate(`/products/${product.type}`)}
            >VIEW</button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsSection;
