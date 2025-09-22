import { motion } from 'framer-motion';

interface ProductCardProps {
  name: string;
  image: string;
  price: string;
  description: string;
}

const ProductCard = ({ name, image, price, description }: ProductCardProps) => {

  return (
    <motion.div
      className="product-card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-image-container">
        <img src={image} alt={name} className="product-image" />
      </div>
      <div className="product-info">
          <h3>{name}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">{price}</p>
      </div>
    </motion.div>
  );
};

export default ProductCard;
