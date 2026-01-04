import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../api/products";
import { useDispatch } from "react-redux";
import { addItem } from "../store/slices/cartSlice";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  ChevronLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  Plus,
  Minus,
  Heart
} from "lucide-react";

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id!);
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.imageUrl || "/placeholder.jpg",
        })
      );
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );

  if (error || !product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
        <button onClick={() => navigate("/products")} className="text-primary hover:underline">
          Return to collection
        </button>
      </div>
    );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Back to Collections</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square"
        >
          <div className="glass-card p-4 h-full group">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <img
                src={product.imageUrl || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute top-6 right-6">
                <button className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-all">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full -z-10" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full -z-10" />
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col justify-center space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">
                {product.category?.name || "Premium Collection"}
              </span>
              <div className="flex items-center text-yellow-500 space-x-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-white">4.9</span>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black font-heading text-white leading-tight">
              {product.name}
            </h1>
            
            <p className="text-3xl font-black text-primary italic">
              ${product.price.toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
              Description
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              {product.description || "Indulge in the pinnacle of design and craftsmanship. This carefully curated piece embodies our commitment to quality and aesthetic excellence, making it a perfect addition to your modern lifestyle."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <div className="flex items-center glass-card p-1 rounded-2xl w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:text-primary transition-colors disabled:opacity-30"
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-6 font-black text-lg text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:text-primary transition-colors"
                disabled={quantity >= 10}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="btn-primary flex-grow flex items-center justify-center space-x-3 group active:scale-95 transition-transform"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="text-lg font-black uppercase tracking-widest">Add to Cart</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Secured Payment</p>
                <p className="text-xs text-gray-500">SSL Encrypted protection</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Express Shipping</p>
                <p className="text-xs text-gray-500">2-3 business days delivery</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
