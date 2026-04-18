import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { useAdmin } from '../AdminContext';

export default function Navbar() {
  const { isAdmin } = useAdmin();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-border-polish">
      <div className="max-w-7xl mx-auto px-10 h-[72px] flex items-center justify-between">
        <Link to="/" className="logo text-[20px] font-bold tracking-[-0.5px]">
          RESELL.CO
        </Link>
        
        <div className="flex items-center space-x-6 text-[14px] font-medium">
          <Link to="/" className="text-text-secondary hover:text-black transition-colors">
            New Arrivals
          </Link>
          <Link to="/" className="text-text-secondary hover:text-black transition-colors">
            Categories
          </Link>
          {isAdmin ? (
            <Link to="/admin" className="text-black bg-bg-polish px-4 py-1.5 rounded-sm hover:bg-border-polish transition-colors">
              Admin
            </Link>
          ) : (
            <Link to="/login" className="text-text-secondary hover:text-black transition-colors">
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
