import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AdminProvider } from './AdminContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

export default function App() {
  return (
    <AdminProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="mt-20 border-t border-gray-100 py-12 px-4 shadow-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-900">ResellNow</p>
                <p className="text-xs text-gray-500 mt-1">© 2026 ResellNow Platform. All rights reserved.</p>
              </div>
              <div className="mt-6 md:mt-0 flex space-x-8">
                <Link to="/login" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">Admin Login</Link>
                <a href="#" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">Privacy</a>
                <a href="#" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">Terms</a>
                <a href="#" className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AdminProvider>
  );
}
