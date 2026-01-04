import React, { useState } from "react";
import { useProducts, useCategories } from "../api/products";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, ShoppingCart, Eye, Star } from "lucide-react";

const ProductListing: React.FC = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const limit = 12;

  const {
    data: result,
    isLoading,
    error,
  } = useProducts({
    search: search || undefined,
    category: category || undefined,
    sort,
    page,
    limit,
  });

  const { data: categories } = useCategories();

  const products = result?.products || [];
  const pagination = result?.pagination;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
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

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">
        Error loading products. Please try again.
      </div>
    );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto space-y-12">
      <Helmet>
        <title>Curated Collection - E-Store</title>
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black font-heading text-white"
          >
            Curated <br /><span className="text-primary italic">Selection</span>
          </motion.h1>
          <p className="text-gray-400 max-w-md">
            Discover our hand-picked collection of premium goods. 
            Filtered by quality, inspired by art.
          </p>
        </div>

        {/* Improved Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative group flex-grow md:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search art pieces..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
            />
          </form>
          
          <div className="flex gap-2">
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none font-medium cursor-pointer"
              >
                <option value="" className="bg-gray-900">All Collections</option>
                {categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id} className="bg-gray-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none font-medium cursor-pointer"
              >
                <option value="createdAt_desc" className="bg-gray-900">Sort: Newest</option>
                <option value="name_asc" className="bg-gray-900">A - Z</option>
                <option value="price_asc" className="bg-gray-900">Price: Low to High</option>
                <option value="price_desc" className="bg-gray-900">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Products Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode='popLayout'>
          {products.map((product: any, idx: number) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-card group flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden rounded-t-2xl">
                <LazyLoadImage
                  src={product.imageUrl || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  effect="blur"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-[2px]">
                  <Link 
                    to={`/products/${product.id}`}
                    className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <button className="p-3 bg-white text-black rounded-full hover:bg-accent hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
                {product.isNew && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">New</span>
                )}
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{product.category?.name || "Premium"}</span>
                  <div className="flex text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] ml-1 text-gray-400 font-bold">4.8</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{product.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Price</span>
                    <span className="text-xl font-black text-white">${product.price.toLocaleString()}</span>
                  </div>
                  <Link 
                    to={`/products/${product.id}`}
                    className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center group/btn"
                  >
                    Details
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Artistic Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-6 pt-12">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="p-3 rounded-2xl glass-card disabled:opacity-20 hover:border-primary/50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex gap-2">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                  page === i + 1 
                    ? "bg-primary text-white shadow-lg scale-110" 
                    : "glass-card text-gray-400 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
            className="p-3 rounded-2xl glass-card disabled:opacity-20 hover:border-primary/50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      )}

      {products.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 space-y-4"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-white">No products found</h3>
          <p className="text-gray-400">Try adjusting your filters or search terms.</p>
          <button 
            onClick={() => { setSearch(""); setCategory(""); }}
            className="text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductListing;
