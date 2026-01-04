import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { clearCart } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Hash, 
  ChevronLeft, 
  ShieldCheck, 
  ArrowRight,
  ShoppingBag
} from "lucide-react";

const Checkout: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearCart());
    navigate("/success");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-center space-y-8">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-600" />
        </div>
        <h1 className="text-3xl font-black font-heading text-white">Your Cart is Empty</h1>
        <button onClick={() => navigate("/products")} className="btn-primary">Start Curating</button>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-heading text-white"
          >
            Secured <br /><span className="text-primary italic">Checkout</span>
          </motion.h1>
          <p className="text-gray-400">Complete your acquisition of premium goods.</p>
        </div>
        <button 
          onClick={() => navigate("/cart")}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Return to Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Shipping Form */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass-card p-10 space-y-8"
        >
          <div className="flex items-center space-x-3 text-white">
            <MapPin className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-black font-heading italic">Shipping Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Street Address</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="123 Artistic Lane"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                  placeholder="Design City"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">ZIP Code</label>
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                    placeholder="00000"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-3 group pt-4">
              <CreditCard className="w-6 h-6" />
              <span className="font-black">COMPLETE PURCHASE</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 uppercase font-black tracking-widest pt-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Encrypted Transaction</span>
            </div>
          </form>
        </motion.div>

        {/* Summary Pane */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="glass-card p-10 space-y-8"
        >
          <h2 className="text-2xl font-black font-heading text-white italic">Acquisition Summary</h2>
          
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/5">
                  <img src={item.image || "/placeholder.jpg"} className="w-full h-full object-cover" alt={item.name} />
                </div>
                <div className="flex-grow">
                  <h4 className="text-white font-bold line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black italic">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-white/5" />

          <div className="space-y-4">
            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <span>Subtotal</span>
              <span className="text-white font-black">${cart.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-[10px]">
              <span>Handling Fee</span>
              <span className="text-green-500 font-black">Free</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="text-white font-black text-xl uppercase tracking-widest">Total</span>
              <span className="text-4xl font-black text-primary italic leading-none">${cart.total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
