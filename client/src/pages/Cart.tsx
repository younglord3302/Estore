import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { removeItem, updateQuantity } from "../store/slices/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  Truck
} from "lucide-react";

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center"
        >
          <ShoppingBag className="w-12 h-12 text-gray-600" />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-4xl font-black font-heading text-white">Your Cart is Empty</h1>
          <p className="text-gray-400 max-w-sm">
            Looks like you haven't added anything to your collection yet.
          </p>
        </div>
        <Link to="/products" className="btn-primary inline-flex items-center space-x-2">
          <span>Start Shopping</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
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
            Shopping <br /><span className="text-primary italic">Cart</span>
          </motion.h1>
          <p className="text-gray-400">
            {cart.items.length} premium items selected for your collection.
          </p>
        </div>
        <button 
          onClick={() => navigate("/products")}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode='popLayout'>
            {cart.items.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-primary/30 transition-colors"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/5 shrink-0">
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex-grow text-center sm:text-left space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-primary font-black italic">${item.price.toLocaleString()}</p>
                </div>

                <div className="flex items-center glass-card p-1 rounded-xl">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-2 hover:text-primary transition-colors disabled:opacity-20"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-2 hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-lg font-black text-white">${(item.price * item.quantity).toLocaleString()}</p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500/50 hover:text-red-500 transition-colors mt-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:sticky lg:top-32 space-y-6"
        >
          <div className="glass-card p-8 space-y-8">
            <h2 className="text-2xl font-black font-heading text-white italic">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white font-bold">${cart.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-end">
                <span className="text-white font-bold">Total</span>
                <div className="text-right">
                  <p className="text-3xl font-black text-white leading-none">${cart.total.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">VAT Included</p>
                </div>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center space-x-3 group">
              <CreditCard className="w-6 h-6" />
              <span className="font-black">PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="space-y-4 pt-4">
               <div className="flex items-center space-x-3 text-gray-400 group cursor-default">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Secure Transaction</span>
               </div>
               <div className="flex items-center space-x-3 text-gray-400 group cursor-default">
                  <Truck className="w-5 h-5 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest">Global Express Delivery</span>
               </div>
            </div>
          </div>

          <div className="glass-card p-6 flex items-center justify-between text-gray-400">
            <span className="text-xs font-bold uppercase">Promo Code?</span>
            <button className="text-primary font-black text-sm hover:underline italic">Add It</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
