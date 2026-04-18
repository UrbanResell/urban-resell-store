import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  collection, query, orderBy, onSnapshot, doc, 
  deleteDoc, updateDoc, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useAdmin } from '../AdminContext';
import { Product, Order } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { 
  Package, ShoppingCart, LogOut, Plus, 
  Trash2, Check, Clock, User, Phone, MapPin,
  ExternalLink, Loader2, Image as ImageIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const { isAdmin, loading: contextLoading } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (!contextLoading && !isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [isAdmin, contextLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
    });

    const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, [isAdmin]);

  const handleLogout = () => signOut(auth);

  const toggleOrderStatus = async (orderId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Pending' ? 'Contacted' : 'Pending';
    await updateDoc(doc(db, 'orders', orderId), { status: nextStatus });
  };

  const deleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      await deleteDoc(doc(db, 'orders', orderId));
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      description: productForm.description,
      imageUrl: productForm.imageUrl,
      createdAt: serverTimestamp()
    };

    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), data);
      } else {
        await addDoc(collection(db, 'products'), data);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', price: '', description: '', imageUrl: '' });
    } catch (error) {
      console.error('Product error:', error);
      alert('Error saving product');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (confirm('Are you sure? This will not delete orders linked to this product.')) {
      await deleteDoc(doc(db, 'products', productId));
    }
  };

  if (contextLoading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-bg-polish">
      <header className="bg-white border-b border-border-polish sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-black" />
            <h1 className="text-lg font-bold tracking-tight uppercase">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 px-4 py-2 rounded-[6px] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 py-10">
        <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-[8px] w-fit mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              "px-6 py-2 rounded-[6px] text-[13px] font-bold uppercase tracking-wider transition-all",
              activeTab === 'orders' ? "bg-white text-black shadow-sm" : "text-text-secondary hover:text-black"
            )}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={cn(
              "px-6 py-2 rounded-[6px] text-[13px] font-bold uppercase tracking-wider transition-all",
              activeTab === 'products' ? "bg-white text-black shadow-sm" : "text-text-secondary hover:text-black"
            )}
          >
            Products ({products.length})
          </button>
        </div>

        {activeTab === 'orders' ? (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No orders yet</h3>
                <p className="text-gray-500 mt-1">Orders will appear here once customers start buying.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-[8px] border border-border-polish bg-white shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border-polish bg-bg-polish">
                      <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-text-secondary">Customer</th>
                      <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-text-secondary">Product</th>
                      <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-text-secondary">Address</th>
                      <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-text-secondary">Status</th>
                      <th className="px-6 py-3 text-[12px] font-bold uppercase tracking-wider text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{order.customerName}</div>
                              <div className="text-sm text-gray-500 flex items-center mt-0.5">
                                <Phone className="w-3 h-3 mr-1" /> {order.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="font-medium text-gray-900">{order.productName}</div>
                          <div className="text-xs text-gray-400 mt-1">ID: {order.productId.slice(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-start max-w-xs">
                            <MapPin className="w-4 h-4 text-gray-300 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 line-clamp-2">{order.address}</span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <button
                            onClick={() => toggleOrderStatus(order.id, order.status)}
                            className={cn(
                              "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase",
                              order.status === 'Contacted' 
                                ? "bg-green-50 text-green-600" 
                                : "bg-orange-50 text-orange-600"
                            )}
                          >
                            {order.status === 'Contacted' ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{order.status}</span>
                          </button>
                        </td>
                        <td className="px-6 py-6">
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Inventory</h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ name: '', price: '', description: '', imageUrl: '' });
                  setShowProductModal(true);
                }}
                className="inline-flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-[6px] font-bold text-[14px] hover:bg-gray-800 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-[8px] p-6 border border-border-polish flex space-x-4 shadow-sm group">
                  <div className="w-20 h-20 rounded-[6px] overflow-hidden bg-gray-50 flex-shrink-0 border border-border-polish">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                      <p className="font-bold text-black">{formatPrice(product.price)}</p>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setProductForm({
                            name: product.name,
                            price: product.price.toString(),
                            description: product.description,
                            imageUrl: product.imageUrl
                          });
                          setShowProductModal(true);
                        }}
                        className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-lg rounded-[12px] p-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] relative"
            >
              <button onClick={() => setShowProductModal(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-bg-polish">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
              
              <h2 className="text-[22px] font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-tight mb-2">Name</label>
                  <input
                    required
                    className="w-full px-4 py-3 rounded-[6px] bg-white border border-border-polish focus:border-black outline-none transition-all text-[14px]"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-tight mb-2">Price ($)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-[6px] bg-white border border-border-polish focus:border-black outline-none transition-all text-[14px]"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-tight mb-2">Image URL</label>
                  <div className="flex space-x-2">
                    <input
                      required
                      type="url"
                      className="flex-1 px-4 py-3 rounded-[6px] bg-white border border-border-polish focus:border-black outline-none transition-all text-[14px]"
                      placeholder="https://images.unsplash.com/..."
                      value={productForm.imageUrl}
                      onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    />
                    <div className="w-12 h-12 rounded-[6px] bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-border-polish">
                      {productForm.imageUrl ? (
                        <img src={productForm.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-text-secondary uppercase tracking-tight mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-[6px] bg-white border border-border-polish focus:border-black outline-none transition-all resize-none text-[14px]"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="w-full py-[14px] bg-black text-white rounded-[6px] font-bold text-[15px] hover:bg-gray-800 transition-all mt-4">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
