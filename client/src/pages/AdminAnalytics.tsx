import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowDownRight,
  Activity,
  Zap,
  Globe,
  PieChart as PieIcon
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

const fetchAnalytics = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/api/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch analytics");
  return response.json();
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-4 border-primary/20 backdrop-blur-xl shadow-2xl">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-white italic">
           Value: <span className="text-primary">${payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const AdminAnalytics: React.FC = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: fetchAnalytics,
  });

  const stats = [
    { label: "Total Revenue", value: "$124,592", change: "+12.5%", icon: DollarSign, trend: "up", color: "text-primary bg-primary/10" },
    { label: "Active Users", value: "8,432", change: "+5.2%", icon: Users, trend: "up", color: "text-blue-500 bg-blue-500/10" },
    { label: "Conversion Rate", value: "3.24%", change: "-0.4%", icon: Zap, trend: "down", color: "text-amber-500 bg-amber-500/10" },
    { label: "Purchase Flux", value: "482", change: "+18%", icon: ShoppingBag, trend: "up", color: "text-green-500 bg-green-500/10" },
  ];

  const pieData = [
    { name: "Premium", value: 45 },
    { name: "Artisan", value: 30 },
    { name: "Standard", value: 25 },
  ];

  const COLORS = ["#00F2FF", "#FF00E5", "#00FF66"];

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Activity className="w-12 h-12 text-primary animate-pulse mx-auto" />
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Compiling Neural Data...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-heading text-white italic">System <span className="text-primary NOT-italic">Intelligence</span></h1>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.2em]">Live projection of commercial metrics</p>
        </div>
        <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-xl border border-white/10">
          <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary text-white">Live</button>
          <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Historical</button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex items-start justify-between relative group overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-white italic">{stat.value}</p>
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === "up" ? <TrendingUp className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                <span className={`text-[10px] font-black ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>{stat.change}</span>
                <span className="text-[10px] text-gray-600 font-bold ml-1">vs last interval</span>
              </div>
            </div>
            {/* Background Glow */}
            <div className={`absolute -top-10 -right-10 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity rounded-full ${stat.color.split(' ')[0]}`} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 glass-card p-8 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500"><Activity className="w-4 h-4" /></div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Revenue Trajectory</h3>
            </div>
            <select className="bg-transparent text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 rounded-lg px-3 py-1 outline-none">
              <option className="bg-[#0a0a0b]">Past 30 Cycles</option>
              <option className="bg-[#0a0a0b]">Past 7 Cycles</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.dailyRevenue || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F2FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F2FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                  fontWeight="bold"
                />
                <YAxis stroke="#ffffff20" fontSize={10} fontWeight="bold" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#00F2FF" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-8 space-y-8"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent"><PieIcon className="w-4 h-4" /></div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Segment Auth</h3>
          </div>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Total</p>
              <p className="text-xl font-black text-white italic">1.2k</p>
            </div>
          </div>
          <div className="space-y-3">
             {pieData.map((d, i) => (
               <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{d.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-white italic">{d.value}%</span>
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      {/* Regional Activity */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t-4 border-t-accent"
      >
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-accent">
            <Globe className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Expansion</span>
          </div>
          <h3 className="text-2xl font-black text-white italic">Localized Scaling Active</h3>
          <p className="text-xs text-gray-500 max-w-sm">System nodes are synchronizing across 14 terrestrial zones. Real-time latency optimized for premium assets.</p>
        </div>
        <div className="flex -space-x-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-12 h-12 rounded-2xl border-2 border-[#0a0a0b] bg-white/5 backdrop-blur-md flex items-center justify-center text-xs font-black text-gray-400">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-12 h-12 rounded-2xl border-2 border-[#0a0a0b] bg-primary text-[#0a0a0b] flex items-center justify-center text-xs font-black">
            +14
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
