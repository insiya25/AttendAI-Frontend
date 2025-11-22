import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    FaFacebookF, 
    FaLinkedinIn, 
    FaXTwitter, 
    FaYoutube, 
    FaInstagram 
} from 'react-icons/fa6';
import { HeartIcon } from '@heroicons/react/24/solid';

const SOCIAL_LINKS = [
    { name: 'Facebook', icon: FaFacebookF, href: 'https://www.facebook.com/gnimsbs' },
    { name: 'LinkedIn', icon: FaLinkedinIn, href: 'https://www.linkedin.com/school/gnimsbs' },
    { name: 'X', icon: FaXTwitter, href: 'https://x.com/gnimsbs' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com/c/Gnims-mum' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://www.instagram.com/gnimsbs/' },
];

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 relative overflow-hidden">
            
            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-red-50/50 rounded-full blur-3xl -z-10" />
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -z-10" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* --- Top Section: Big CTA --- */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                            Ready to transform your <br />
                            <span className="text-red-600">Campus Experience?</span>
                        </h2>
                        <p className="text-lg text-gray-500">
                            Join GNIMS in the digital revolution. Streamline attendance, empower students, and simplify management today.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                         <Link to="/register">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-700 transition-colors"
                            >
                                Get Started Now
                            </motion.button>
                        </Link>
                        <Link to="/login">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-white text-gray-900 border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Log In
                            </motion.button>
                        </Link>
                    </div>
                </div>

                <hr className="border-gray-100 mb-16" />

                {/* --- Middle Section: Links & Logo --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
                    
                    {/* Column 1: Brand & Logo */}
                    <div className="md:col-span-5 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            {/* Logo Image */}
                            <div className="w-20 h-20 bg-gray-50 rounded-lg p-1 flex items-center justify-center border border-gray-100">
                                <img 
                                    src="/logo/gnims.png" // Ensure this file exists!
                                    alt="GNIMS Logo" 
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        // Fallback if image is missing
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                {/* Fallback Text if logo fails to load or alongside it */}
                                {/* <span className="font-bold text-red-600 text-xl ml-2">GNIMS</span> */}
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            Empowering the future of education through advanced technology and AI-driven insights.
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex gap-4 mt-2">
                            {SOCIAL_LINKS.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, color: '#DC2626' }} // Red on hover
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 transition-colors hover:border-red-100 hover:bg-red-50"
                                >
                                    <social.icon className="w-4 h-4" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="md:col-span-3">
                        <h4 className="font-bold text-gray-900 mb-6">Platform</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link to="/login" className="hover:text-red-600 transition-colors">Student Login</Link></li>
                            <li><Link to="/login" className="hover:text-red-600 transition-colors">Teacher Login</Link></li>
                            <li><Link to="/register" className="hover:text-red-600 transition-colors">Register New Account</Link></li>
                            <li><a href="#" className="hover:text-red-600 transition-colors">Admin Portal</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact/Address */}
                    <div className="md:col-span-4">
                        <h4 className="font-bold text-gray-900 mb-6">GNIMS Mumbai</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li>King's Circle, Matunga East,</li>
                            <li>Mumbai, Maharashtra 400019</li>
                            <li className="pt-2">
                                <a href="mailto:info@gnims.com" className="text-red-600 font-medium hover:underline">info@gnims.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* --- Bottom Section: Copyright & Credits --- */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-sm">
                    
                    {/* Copyright */}
                    <p className="text-gray-400 mb-4 md:mb-0 text-center md:text-left">
                        Copyright 2023 © <span className="font-semibold text-gray-600">GNIMS, Mumbai</span> - All Rights Reserved
                    </p>

                    {/* Credits */}
                    <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100"
                    >
                        <span className="text-gray-500">Created & Designed by</span>
                        <span className="font-bold text-gray-800 flex items-center gap-1">
                            Insiya Rizvi
                            <HeartIcon className="w-3 h-3 text-red-500" />
                        </span>
                    </motion.div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;