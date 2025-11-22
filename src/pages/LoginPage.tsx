// src/pages/LoginPage.tsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import { SparklesIcon } from "@heroicons/react/24/solid";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center p-6">
      
      {/* --- Background Effects (Matching Landing Page) --- */}
      <div className="absolute inset-0 pointer-events-none">
          {/* Faint Tech Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          {/* Glowing Red Orbs */}
          <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-red-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-red-600/5 rounded-full blur-[100px]" />
      </div>

      {/* --- The Login Card --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Floating Decorative Icon */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-2xl shadow-xl border border-red-50 flex items-center justify-center z-20"
        >
           <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-red-600" />
           </div>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10 pt-12">
          
          {/* Header Section */}
          <div className="text-center mb-8">
             <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
               Welcome Back
             </h2>
             <p className="text-sm text-gray-500 mt-2">
               Sign in to access your <span className="font-semibold text-red-600">AttendAI</span> dashboard.
             </p>
          </div>

          {/* The Form */}
          <LoginForm />

          {/* Footer / Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-red-600 hover:text-red-700 hover:underline transition-all">
                Register Now
              </Link>
            </p>
          </div>

        </div>
        
        {/* Bottom Copyright (Optional aesthetic touch) */}
        <p className="text-center text-xs text-gray-300 mt-6 font-medium">
           Secured by AttendAI Intelligence
        </p>

      </motion.div>
    </div>
  );
};

export default LoginPage;