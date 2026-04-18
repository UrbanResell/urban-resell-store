import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'orders'), {
        productId: product.id,
        productName: product.name,
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-[400px] bg-white rounded-[12px] p-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-bg-polish transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>

            {success ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-[22px] font-bold text-text-primary mb-2">Order Confirmed</h3>
                <p className="text-[14px] text-text-secondary mb-8">
                  Order received, we will contact you shortly to finalize details.
                </p>
                <button
                  onClick={onClose}
                  className="submit-btn w-full p-[14px] bg-black text-white rounded-[6px] font-semibold text-[15px] hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-[22px] font-bold text-text-primary">Complete Order</h3>
                  <p className="text-[14px] text-text-secondary mt-1">
                    Enter your details below and we'll reach out to finalize payment and shipping.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group">
                    <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-tight mb-1.5">Full Name</label>
                    <input
                      required
                      type="text"
                      className="w-full p-[12px] border border-border-polish rounded-[6px] text-[14px] outline-none focus:border-black transition-colors"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-tight mb-1.5">Phone Number (Required)</label>
                    <input
                      required
                      type="tel"
                      className="w-full p-[12px] border border-border-polish rounded-[6px] text-[14px] outline-none focus:border-black transition-colors"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-tight mb-1.5">Full Address / Location (Required)</label>
                    <textarea
                      required
                      className="w-full p-[12px] h-[80px] border border-border-polish rounded-[6px] text-[14px] outline-none focus:border-black transition-colors resize-none"
                      placeholder="Street, City, State, Zip"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="submit-btn w-full p-[14px] bg-black text-white rounded-[6px] font-semibold text-[15px] hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span>Confirm Order</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
