import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  MoreVertical,
  Filter,
  Loader2,
  Calendar,
  User,
  CreditCard,
  X
} from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const fetchOrders = async (): Promise<Order[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/api/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch orders");
  const data = await response.json();
  return data.orders || data;
};

const updateOrderStatus = async ({ id, status }: { id: string; status: string }) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/api/admin/orders/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error("Failed to update status");
  return response.json();
};

const AdminOrders: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);
  
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setShowStatusMenu(null);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "shipped": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "delivered": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "cancelled": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing": return <Clock className="w-3 h-3" />;
      case "shipped": return <Truck className="w-3 h-3" />;
      case "delivered": return <CheckCircle2 className="w-3 h-3" />;
      case "cancelled": return <XCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const filteredOrders = orders?.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.user.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const statusOptions = ["processing", "shipped", "delivered", "cancelled"];

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-heading text-white italic">Order <span className="text-primary NOT-italic">Fulfillment</span></h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Monitor and dispatch client requests</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Track order ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm w-64"
            />
          </div>
          <button className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending", count: orders?.filter(o => o.status === "processing").length || 0, color: "text-blue-500 bg-blue-500/10", icon: Clock },
          { label: "Transit", count: orders?.filter(o => o.status === "shipped").length || 0, color: "text-amber-500 bg-amber-500/10", icon: Truck },
          { label: "Completed", count: orders?.filter(o => o.status === "delivered").length || 0, color: "text-green-500 bg-green-500/10", icon: CheckCircle2 },
          { label: "Revenue", count: `$${orders?.reduce((acc, o) => acc + o.total, 0).toLocaleString()}`, color: "text-accent bg-accent/10", icon: CreditCard },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 flex items-center justify-between group overflow-hidden">
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <p className="text-xl font-black text-white italic">{stat.count}</p>
            </div>
            <div className={`p-2 rounded-xl transition-all duration-500 group-hover:scale-110 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Order / Client</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Temporal Log</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Settlement</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode='popLayout'>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                        <span>Synchronizing logistics...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.map((order, idx) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                          <ShoppingBag className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white tracking-widest uppercase">#{order.id.slice(0,8)}</p>
                          <div className="flex items-center space-x-1 mt-0.5">
                            <p className="text-[10px] text-gray-500 font-bold group-hover:text-gray-300 transition-colors">{order.user.name}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-white italic">${order.total.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4 relative">
                       <button 
                         onClick={() => setShowStatusMenu(showStatusMenu === order.id ? null : order.id)}
                         className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${getStatusColor(order.status)} hover:brightness-125`}
                       >
                         {getStatusIcon(order.status)}
                         <span>{order.status}</span>
                       </button>

                       <AnimatePresence>
                         {showStatusMenu === order.id && (
                           <>
                             <div className="fixed inset-0 z-10" onClick={() => setShowStatusMenu(null)} />
                             <motion.div 
                               initial={{ opacity: 0, y: 10, scale: 0.95 }}
                               animate={{ opacity: 1, y: 0, scale: 1 }}
                               exit={{ opacity: 0, y: 10, scale: 0.95 }}
                               className="absolute left-6 top-12 z-20 w-32 glass-card overflow-hidden shadow-2xl border-white/10"
                             >
                               {statusOptions.map((status) => (
                                 <button
                                   key={status}
                                   onClick={() => statusMutation.mutate({ id: order.id, status })}
                                   className={`w-full px-4 py-2 text-[9px] font-black uppercase tracking-widest text-left hover:bg-white/5 transition-colors ${order.status === status ? 'text-primary' : 'text-gray-400'}`}
                                 >
                                   {status}
                                 </button>
                               ))}
                             </motion.div>
                           </>
                         )}
                       </AnimatePresence>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                          <MoreVertical className="w-4 h-4" />
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

      {/* Order Details Overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-[#0a0a0b]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              className="relative w-full max-w-lg glass-card overflow-hidden"
            >
              <div className="p-8 space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h2 className="text-2xl font-black text-white italic">Order <span className="text-primary NOT-italic">Manifest</span></h2>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Entry ID: #{selectedOrder.id}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                 </div>

                 <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Client Identity</span>
                          <User className="w-4 h-4 text-gray-500" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-white italic">{selectedOrder.user.name}</p>
                          <p className="text-[11px] text-gray-500 font-bold">{selectedOrder.user.email}</p>
                       </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Temporal Log</span>
                          <Calendar className="w-4 h-4 text-gray-500" />
                       </div>
                       <p className="text-sm font-black text-white italic">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4 relative overflow-hidden">
                       <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 text-primary/10 rotate-12" />
                       <div className="flex items-center justify-between relative z-10">
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Settlement Amount</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                       </div>
                       <p className="text-4xl font-black text-white italic relative z-10">${selectedOrder.total.toLocaleString()}</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => setSelectedOrder(null)}
                   className="w-full btn-primary py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em]"
                 >
                    Dismiss Entry
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
