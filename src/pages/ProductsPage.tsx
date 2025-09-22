import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import '../components/ProductCard.css';
import './ProductsPage.css';

// Import product images
import bell1 from '../assets/WhatsApp Image 2025-09-03 at 10.00.10 AM (1).jpeg';
import bell2 from '../assets/WhatsApp Image 2025-09-03 at 10.00.10 AM (2).jpeg';
import bell3 from '../assets/WhatsApp Image 2025-09-03 at 10.00.10 AM (3).jpeg';
import product1 from '../assets/WhatsApp Image 2025-09-03 at 10.00.10 AM.jpeg';
import product2 from '../assets/WhatsApp Image 2025-09-03 at 10.17.25 AM.jpeg';

const products = [
  {
    id: 1,
    name: 'Traditional Pooja Bell',
    image: bell1,
    price: '₹1,500',
    description: 'Traditional brass pooja bell with intricate designs'
  },
  {
    id: 2,
    name: 'Premium Temple Bell',
    image: bell2,
    price: '₹2,000',
    description: 'Premium quality temple bell with deep resonating sound'
  },
  {
    id: 3,
    name: 'Decorative Bell',
    image: bell3,
    price: '₹1,800',
    description: 'Beautifully crafted decorative bell with unique patterns'
  },
  {
    id: 4,
    name: 'Special Product 1',
    image: product1,
    price: '₹1,200',
    description: 'Special pooja accessory with traditional design'
  },
  {
    id: 5,
    name: 'Special Product 2',
    image: product2,
    price: '₹1,300',
    description: 'Exclusive pooja item for sacred ceremonies'
  }
];

const ProductsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="products-page">
      <h1 className="products-title">{t('products')}</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
            description={product.description}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
