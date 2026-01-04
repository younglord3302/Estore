import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight, Sparkles, PackageCheck } from "lucide-react";

const Success: React.FC = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full -z-10 animate-pulse" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card max-w-2xl w-full p-12 md:p-16 text-center space-y-10 relative overflow-hidden"
      >
        {/* Animated Sparkles */}
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="absolute -top-10 -right-10 text-primary/30"
        >
          <Sparkles className="w-40 h-40" />
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto border border-green-500/20"
          >
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </motion.div>
          
          <div className="space-y-2">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-6xl font-black font-heading text-white"
            >
              Payment <br /><span className="text-primary italic">Successful</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-400 text-lg max-w-sm mx-auto"
            >
              Your order has been confirmed and is being prepared with clinical precision.
            </motion.p>
          </div>
        </div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.8 }}
           className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 p-6 rounded-2xl border border-white/5"
        >
          <div className="flex items-center space-x-4 text-left">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">Order Status</p>
              <p className="text-white font-bold">Processing</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-left border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-tight">Est. Delivery</p>
              <p className="text-white font-bold">Jan 07 - Jan 09</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <Link to="/profile" className="flex-grow p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-xs transition-all text-center">
            View Order
          </Link>
          <Link to="/" className="btn-primary flex-grow flex items-center justify-center space-x-3 group">
            <span className="font-black text-xs uppercase tracking-widest">Continue Shopping</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Success;
