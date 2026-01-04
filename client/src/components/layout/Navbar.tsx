import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ShoppingCart, User as UserIcon, LogOut, Home, Package, LayoutDashboard } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 glass-card pointer-events-auto">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center group">
            <img 
              src="/doo_logo.png" 
              alt="Doo Logo" 
              className="h-10 w-auto object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </Link>
          
          <div className="hidden sm:flex items-center space-x-1 bg-black/20 p-1 rounded-full border border-white/5">
            {[
              { path: "/", label: "Home", icon: Home },
              { path: "/products", label: "Products", icon: Package },
              ...(user?.role === "ADMIN" ? [{ path: "/admin", label: "Admin", icon: LayoutDashboard }] : []),
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full transition-all duration-300 text-sm font-medium ${
                  isActive(link.path)
                    ? "bg-white text-black shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link
            to="/cart"
            className="relative p-2 rounded-full hover:bg-white/5 transition-colors group"
          >
            <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-white" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[var(--background)] shadow-lg animate-pulse">
                {cartItems.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4 pl-4 border-l border-white/10">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-white">{user?.name}</span>
                <span className="text-[10px] text-gray-400">{user?.role}</span>
              </div>
              <Link to="/profile" className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <UserIcon className="w-6 h-6 text-gray-300 hover:text-white" />
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full hover:bg-red-500/20 transition-colors group"
              >
                <LogOut className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
