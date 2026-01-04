import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Star, Sparkles, ShieldCheck, Zap } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="pt-24 space-y-24">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 z-10"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>New Collection 2024</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black font-heading leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-gray-500">
              Future of <br />
              <span className="text-primary italic">Shopping</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              Experience the intersection of art and commerce. Our curated selection 
              brings you the world's most premium brands in a stunning digital space.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary flex items-center space-x-2 group">
                <span>Start Exploring</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all font-bold text-white">
                Our Story
              </button>
            </div>

            <div className="flex items-center space-x-12 pt-8">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-[var(--background)] overflow-hidden shadow-xl">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Trusted by 50k+ Customers
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-4 rotate-3 hover:rotate-0 transition-transform duration-700 aspect-square group">
              <div className="w-full h-full rounded-lg overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt="Feature product"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <span className="text-primary text-sm font-bold mb-2">Editor's Choice</span>
                  <h3 className="text-3xl font-bold text-white mb-4">The Minimalist <br /> Watch Vol. 2</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">$299.00</span>
                    <button className="p-3 bg-white text-black rounded-xl hover:bg-primary hover:text-white transition-colors">
                      <ShoppingBag className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 glass-card px-6 py-4 flex items-center space-x-3 shadow-2xl"
            >
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Warranty</p>
                <p className="text-sm font-bold text-white">Lifetime Support</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-5 -left-10 glass-card px-6 py-4 flex items-center space-x-3 shadow-2xl"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Shipping</p>
                <p className="text-sm font-bold text-white">Express Delivery</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Active Users", val: "50k+" },
          { label: "Products", val: "1.2k+" },
          { label: "Awards", val: "24" },
          { label: "Shipped", val: "100k+" },
        ].map((stat, i) => (
          <div key={i} className="text-center space-y-2">
            <h4 className="text-4xl md:text-5xl font-black font-heading text-white">{stat.val}</h4>
            <p className="text-xs text-primary font-bold uppercase tracking-[0.2em]">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-heading text-white">Curated Collections</h2>
            <p className="text-gray-400 max-w-lg">
              Explore our hand-picked selections across multiple categories, 
              designed to fit every aspect of your premium lifestyle.
            </p>
          </div>
          <Link to="/products" className="group flex items-center space-x-2 text-primary font-bold hover:text-accent transition-colors">
            <span>View All Collections</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80", title: "Footwear", color: "from-blue-600" },
            { img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80", title: "Audio & Tech", color: "from-purple-600" },
            { img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80", title: "Apparel", color: "from-red-600" },
          ].map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card group cursor-pointer"
            >
              <img 
                src={cat.img} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                alt={cat.title}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-40 group-hover:opacity-80 transition-opacity`} />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h3 className="text-3xl font-black text-white italic group-hover:not-italic transition-all">{cat.title}</h3>
                <p className="text-white/60 text-sm opacity-0 group-hover:opacity-100 transition-opacity mt-2">Explore 200+ Products</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="glass-card p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center space-y-8">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
          
          <Sparkles className="w-12 h-12 text-primary" />
          <h2 className="text-4xl md:text-6xl font-black font-heading text-white">Stay in the Loop</h2>
          <p className="text-gray-400 max-w-xl text-lg">
            Join our exclusive community and get early access to new drops, 
            artistic collaborations, and premium member-only events.
          </p>
          
          <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary transition-colors"
            />
            <button className="btn-primary">Join Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
