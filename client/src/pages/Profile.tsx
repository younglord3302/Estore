import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  ChevronRight,
  Clock,
  Package,
  Star
} from "lucide-react";

const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 text-center space-y-4"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-black text-white italic">Access <span className="text-primary NOT-italic">Denied</span></h2>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Authentication required for entry</p>
          <button className="btn-primary w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Return to Login</button>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 lg:py-20 relative">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Core Identity */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="glass-card overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent" />
            <div className="p-8 -mt-16 space-y-6">
              <div className="relative inline-block group">
                <div className="w-24 h-24 rounded-[2rem] bg-[#0a0a0b] border-2 border-primary/50 p-1 group-hover:rotate-12 transition-transform duration-500">
                  <div className="w-full h-full rounded-[1.8rem] bg-white/5 flex items-center justify-center overflow-hidden">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary text-[#0a0a0b] flex items-center justify-center border-4 border-[#0a0a0b]">
                  <Shield className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-black text-white italic leading-tight">{user.name}</h1>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] mt-1">Operational <span className="text-primary">Status: Active</span></p>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5">
                {[
                  { icon: Mail, label: "Neural Link", value: user.email },
                  { icon: Shield, label: "Access Level", value: user.role === 'admin' ? "System Administrator" : "Verified Client" },
                  { icon: Clock, label: "Active Since", value: "Cycle 2024.12" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 group">
                    <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                      <item.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">{item.label}</p>
                      <p className="text-xs font-bold text-gray-300">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={logout}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500/10 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <LogOut className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-white italic uppercase tracking-widest">System Preferences</h3>
                <Settings className="w-4 h-4 text-gray-500" />
             </div>
             <div className="space-y-2">
                {['Security Matrix', 'Neural Preferences', 'Financial Logs'].map((opt, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                    <span className="text-[10px] text-gray-400 font-bold group-hover:text-white">{opt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-primary transition-colors" />
                  </button>
                ))}
             </div>
          </motion.div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Stats Banner */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Total Assets", val: "14", icon: Package, color: "text-primary" },
              { label: "Elite Status", val: "Level 4", icon: Star, color: "text-accent" },
              { label: "Loyalty Flow", val: "2.4k", icon: ShoppingBag, color: "text-green-500" },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 flex flex-col items-center justify-center text-center group">
                 <stat.icon className={`w-6 h-6 mb-3 ${stat.color} transition-transform group-hover:scale-110`} />
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-xl font-black text-white italic">{stat.val}</p>
              </div>
            ))}
          </motion.div>

          {/* Transactional History */}
          <motion.div variants={itemVariants} className="glass-card overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-white italic">Acquisition <span className="text-primary NOT-italic">Logbook</span></h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">History of verified transactions</p>
              </div>
              <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4">View Global Archive</button>
            </div>
            
            <div className="p-8">
              {/* Conditional empty state or list */}
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 relative">
                  <ShoppingBag className="w-10 h-10 text-gray-600" />
                  <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Archive Initialized</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">No commercial activity detected in the current cycle. Start your first acquisition sequence to populate the log.</p>
                </div>
                <button className="btn-primary px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">Initialize Sequence</button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Background Decorative Element */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/5 blur-[120px] rounded-full -z-10" />
    </div>
  );
};

export default Profile;
