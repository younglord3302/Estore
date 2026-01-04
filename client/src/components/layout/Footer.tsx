import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Mail } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="mt-20 glass-card mx-4 mb-4 overflow-hidden">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold font-heading text-white">E-Store</h3>
            <p className="text-gray-400 max-w-sm">
              Discover the finest collection of premium goods curated just for you. 
              Elevate your lifestyle with our artistic and modern digital experience.
            </p>
            <div className="flex space-x-4">
              {[Github, Twitter, Instagram, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=electronics" className="hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/products?category=fashion" className="hover:text-white transition-colors">Fashion</Link></li>
              <li><Link to="/products?category=books" className="hover:text-white transition-colors">Books</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs gap-4">
          <p>&copy; {new Date().getFullYear()} E-Store. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors italic">Designed with Passion</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
