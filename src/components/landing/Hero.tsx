import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Configuration ---
// We assume you have images named 1.jpg, 2.jpg, etc. in public/carousals/
// For this demo code, I will generate an array of filenames.
const CAROUSEL_IMAGES = [
  '/carousals/1.jpg', '/carousals/2.jpg', '/carousals/3.jpg',
  '/carousals/4.jpg', '/carousals/5.jpg', '/carousals/6.jpg',
  '/carousals/1.jpg', '/carousals/2.jpg', '/carousals/3.jpg', // Repeat for infinite loop illusion
];

const Hero = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Parallax effects for text
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={targetRef} className="relative w-full min-h-screen bg-white overflow-hidden flex items-center justify-center selection:bg-red-100 selection:text-red-600">
      
      {/* Background Decor: Subtle Red Gradient Orb */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* LEFT SIDE: Typography & CTA */}
        <motion.div 
          style={{ y, opacity }} 
          className="flex flex-col gap-6 lg:pr-10 pt-20 lg:pt-0"
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
              Next Gen Attendance
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Attend<span className="text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-red-700">AI</span>
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-gray-200 mt-2">
              See the unseen.
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-500 max-w-lg leading-relaxed"
          >
            Ditch the manual registers. Using advanced AI & OCR, verify student attendance from a single photo. Fast, accurate, and effortless.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <Link to="/register">
              <button className="group relative px-8 py-4 bg-red-600 text-white font-semibold rounded-xl overflow-hidden shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300">
                <span className="relative z-10">Get Started Free</span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </Link>
            <Link to="/login">
                <button className="px-8 py-4 bg-white text-gray-800 border border-gray-200 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                Login
                </button>
            </Link>
          </motion.div>

          {/* Stats / Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex gap-8 mt-8 border-t border-gray-100 pt-8"
          >
            <div>
              <h4 className="text-3xl font-bold text-gray-900">99%</h4>
              <p className="text-sm text-gray-400">Accuracy</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-gray-900">10x</h4>
              <p className="text-sm text-gray-400">Faster</p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: The "Sexy" 3D Infinite Carousel */}
        <div className="relative h-[600px] w-full hidden lg:block overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            {/* We rotate the whole container to give it a dynamic angle */}
            <div className="flex gap-6 h-full justify-center items-center rotate-[-12deg] scale-110">
                
                {/* Column 1 - Moving Up */}
                <CarouselColumn images={CAROUSEL_IMAGES} speed={25} direction="up" />
                
                {/* Column 2 - Moving Down (Faster) */}
                <CarouselColumn images={CAROUSEL_IMAGES} speed={35} direction="down" />
                
                {/* Column 3 - Moving Up */}
                <CarouselColumn images={CAROUSEL_IMAGES} speed={20} direction="up" />

            </div>
        </div>
      </div>
    </section>
  );
};

// --- Helper Component for the Columns ---
const CarouselColumn = ({ images, speed, direction }: { images: string[], speed: number, direction: 'up' | 'down' }) => {
    return (
        <div className="relative flex flex-col gap-6 w-48 min-w-[12rem]">
            <motion.div
                initial={{ y: direction === 'up' ? 0 : -1000 }}
                animate={{ y: direction === 'up' ? -1000 : 0 }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className="flex flex-col gap-6"
            >
                {/* We triple the array to ensure smooth infinite scrolling without gaps */}
                {[...images, ...images, ...images].map((src, idx) => (
                    <div key={idx} className="relative w-full h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                        {/* Placeholder logic if image fails, uses a nice gradient */}
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                           {/* If you want to use real images, uncomment the img tag below and ensure paths are correct */}
                           {/* <img src={src} alt="Attendance Sheet" className="w-full h-full object-cover" /> */}
                           
                           {/* For now, using a stylish placeholder gradient so you can see the effect immediately */}
                           <div className={`w-full h-full bg-gradient-to-br ${idx % 2 === 0 ? 'from-gray-100 to-gray-300' : 'from-red-50 to-red-100'} flex items-center justify-center text-gray-400 font-mono text-xs`}>
                                Sheet {idx + 1}
                           </div>
                        </div>
                        
                        {/* Glassmorphism overlay for 'Sexy' effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                            <p className="text-white text-xs font-bold">Scan Processed</p>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

export default Hero;