import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  DollarSign, 
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const fetchProducts = async (): Promise<Product[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/api/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch products");
  const data = await response.json();
  return data.products || data; // Handle both direct array and wrapped response
};

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE}/api/categories`);
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

const deleteProduct = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete product");
};

const AdminProducts: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: "",
    categoryId: "",
  });

  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct: any) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error("Failed to create product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      handleCloseForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      handleCloseForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl || "",
      stock: product.stock.toString(),
      categoryId: product.category.id,
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      stock: "",
      categoryId: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-heading text-white italic">Product <span className="text-primary NOT-italic">Inventory</span></h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Manage your premium collection</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm w-64"
            />
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2 py-2.5 px-6 rounded-2xl"
          >
            <Plus className="w-4 h-4" />
            <span className="font-black text-xs uppercase tracking-widest">New Asset</span>
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-primary">
          <div className="p-3 bg-primary/10 rounded-xl text-primary"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Total Assets</p>
            <p className="text-2xl font-black text-white">{products?.length || 0}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-green-500">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Value Projection</p>
            <p className="text-2xl font-black text-white">${products?.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center space-x-4 border-l-4 border-l-accent">
          <div className="p-3 bg-accent/10 rounded-xl text-accent"><AlertCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Low Stock Alert</p>
            <p className="text-2xl font-black text-white">{products?.filter(p => p.stock < 10).length || 0}</p>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Price / Stock</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode='popLayout'>
                {productsLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span>Initializing inventory...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProducts.map((p, idx) => (
                  <motion.tr 
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={p.imageUrl || "/placeholder.jpg"} className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" alt={p.name} />
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{p.name}</p>
                          <p className="text-[10px] text-gray-500 font-medium truncate max-w-[200px]">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                        {p.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-primary italic">${p.price.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-tighter">Stock: {p.stock}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className="flex items-center space-x-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                            {p.stock > 0 ? "Operational" : "Depleted"}
                          </span>
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(p)}
                          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all underline-none"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm("Confirm deletion of this asset?")) {
                              deleteMutation.mutate(p.id);
                            }
                          }}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all underline-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseForm}
              className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass-card overflow-hidden"
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white italic">
                      {editingProduct ? "Update" : "Register"} <span className="text-primary NOT-italic">Asset</span>
                    </h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Synchronizing central database</p>
                  </div>
                  <button 
                    onClick={handleCloseForm}
                    className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Asset Nomenclature</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="e.g. Quantum Processor v2"
                    />
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Technical Specifications</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all h-24"
                      placeholder="Detailed description of the asset..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Market Value ($)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Inventory Density</label>
                    <input 
                      type="number" 
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">System Category</label>
                    <select 
                      required
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      <option value="" className="bg-[#0a0a0b]">Select Node</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-[#0a0a0b]">{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Visual Identity (URL)</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-11 py-3 text-white focus:outline-none focus:border-primary/50 transition-all"
                        placeholder="https://..."
                      />
                      <ImageIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {(createMutation.isPending || updateMutation.isPending) ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          <span className="font-black text-xs uppercase tracking-[0.2em]">{editingProduct ? "Command Update" : "Deploy Asset"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
