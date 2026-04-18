import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { Loader2, ArrowLeft, ShoppingCart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import OrderModal from '../components/OrderModal';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-black underline underline-offset-4"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Collection
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Image Grid */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col-reverse"
        >
          <div className="aspect-[3/4] w-full rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {product.name}
            </h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl text-gray-900 font-bold">{formatPrice(product.price)}</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                {product.description}
              </div>
            </div>

            <div className="mt-10 flex space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 bg-black rounded-[4px] py-[12px] px-8 flex items-center justify-center text-[14px] font-bold text-white hover:bg-gray-800 transition-all active:scale-[0.98]"
              >
                <ShoppingCart className="mr-2 w-5 h-5" /> Order Now
              </button>
            </div>

            <section aria-labelledby="details-heading" className="mt-12 border-t border-gray-100 pt-8">
              <h2 id="details-heading" className="sr-only">Additional details</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>Quality checked and verified</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>Fast shipping guaranteed</span>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>

      <OrderModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
