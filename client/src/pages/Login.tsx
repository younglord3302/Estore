import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ArrowRight, Github, Twitter, Chrome } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@example.com") {
      login({
        id: "1",
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
      });
    } else {
      login({ id: "2", name: "User", email, role: "user" });
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full -z-10 animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card w-full max-w-md p-10 md:p-12 space-y-8 relative"
      >
        <div className="text-center space-y-2">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20"
          >
            <LogIn className="w-8 h-8 text-primary" />
          </motion.div>
          <h1 className="text-4xl font-black font-heading text-white">Welcome <br /><span className="text-primary italic">Back</span></h1>
          <p className="text-gray-400 text-sm">Enter the portal to your premium experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end ml-1">
              <label className="text-xs font-black uppercase tracking-widest text-gray-500">
                Password
              </label>
              <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-3 group">
            <span className="font-black">SIGN IN</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-[#0a0a0b] px-4 text-gray-600 font-bold">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex justify-center">
              <Chrome className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex justify-center">
              <Github className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex justify-center">
              <Twitter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          New here? <Link to="/register" className="text-primary font-bold hover:underline">Create an account</Link>
        </p>

        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-[10px] text-center text-primary font-black uppercase tracking-[0.2em]">
            Demo: admin@example.com for portal access
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
