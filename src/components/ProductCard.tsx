import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { ArrowRight } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-surface-polish border border-border-polish rounded-lg overflow-hidden flex flex-col group h-full"
    >
      <Link to={`/product/${product.id}`} className="block flex-1">
        <div className="h-[200px] overflow-hidden bg-gray-100 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        
        <div className="p-[20px] flex flex-col h-full">
          <h3 className="text-[16px] font-semibold text-text-primary mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-[18px] font-bold text-black mb-4">{formatPrice(product.price)}</p>
          
          <div className="mt-auto">
            <button className="w-full py-3 px-4 bg-black text-white text-[14px] font-semibold rounded-[4px] cursor-pointer hover:bg-gray-800 transition-colors">
              Order Now
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
