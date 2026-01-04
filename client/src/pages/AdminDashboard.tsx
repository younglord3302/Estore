import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  LayoutDashboard, 
  LogOut,
  ChevronRight,
  UserCircle
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
    { path: "/admin/products", icon: Package, label: "Products" },
    { path: "/admin/orders", icon: ShoppingBag, label: "Orders" },
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8 min-h-screen">
      {/* Sidebar */}
      <motion.aside 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-72 shrink-0 space-y-6"
      >
        <div className="glass-card p-6 space-y-8">
          <div className="flex items-center space-x-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-white font-black text-sm">{user?.name || "Admin"}</p>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest italic">System Access</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.path 
                : location.pathname.startsWith(item.path) && (item.path !== "/admin" || location.pathname === "/admin");
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="font-bold text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-1"}`} />
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-black text-sm uppercase tracking-widest">Terminate Session</span>
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="glass-card p-6 bg-primary/5 border-primary/20 hidden lg:block">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">System Integrity</p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-bold">Latency</span>
              <span className="text-xs text-green-500 font-black">12ms</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                className="h-full bg-green-500"
              />
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-grow min-w-0"
      >
        <div className="glass-card p-8 min-h-[600px] relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -z-10" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
