import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { useAdmin } from '../AdminContext';
import { ShieldCheck, LogIn, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const { isAdmin, user, loading: contextLoading } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!contextLoading && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, contextLoading, navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Only authorized admins can access.');
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading) return null;
  if (user && isAdmin) return null;

  return (
    <div className="flex h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-[32px] rounded-[12px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] border border-border-polish text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[8px] bg-black text-white mb-6">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-[22px] font-bold text-text-primary mb-2">Admin Panel</h2>
        <p className="text-[14px] text-text-secondary mb-8">
          Authorized personnel only. Please sign in with your Google account to manage products and orders.
        </p>

        {user && !isAdmin && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-[6px] text-xs font-medium">
            Access denied. Your account is not authorized as an admin.
          </div>
        )}

        <button
          disabled={loading}
          onClick={handleLogin}
          className="w-full py-[14px] bg-black text-white rounded-[6px] font-semibold text-[15px] hover:bg-gray-800 disabled:bg-gray-400 transition-all flex items-center justify-center space-x-3 active:scale-[0.98]"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
