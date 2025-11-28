import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { HeartIcon, SparklesIcon, CommandLineIcon, StarIcon, CodeBracketIcon, BoltIcon } from '@heroicons/react/24/solid';

const Dedication = () => {
  return (
    <section className="relative py-24 px-6 bg-white overflow-hidden flex items-center justify-center">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,228,230,0.4),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-6xl mx-auto text-center">
        
        {/* Section Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
        >
            <h2 className="text-gray-400 text-sm font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2">
                <span className="w-8 h-[1px] bg-gray-300"></span>
                The Minds Behind AttendAI
                <span className="w-8 h-[1px] bg-gray-300"></span>
            </h2>
        </motion.div>

        {/* The Cards Container */}
        {/* Flex-col for mobile (stacks vertically), md:flex-row for desktop (side by side) */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-8 lg:gap-16">
            
            {/* 1. Insiya (GF - Comes first on mobile) */}
            <TiltCard 
                imageSrc="/insiya.jpeg"
                name="Insiya"
                title="The Inspiration"
                variant="love"
                showCrown={true}
            />

            {/* 2. Sayma (Friend - Comes second) */}
            <TiltCard 
                imageSrc="/sayma.jpeg"
                name="Sayma"
                title="Project Partner"
                variant="tech"
                showCrown={false}
            />

        </div>

        {/* Dedication Text */}
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 max-w-lg mx-auto"
        >
            <p className="text-gray-500 italic font-serif text-lg">
                "Built with lines of code, logic, and a shared vision."
            </p>
        </motion.div>

      </div>
    </section>
  );
};

// --- Props Interface ---
interface TiltCardProps {
    imageSrc: string;
    name: string;
    title: string;
    variant: 'love' | 'tech';
    showCrown: boolean;
}

// --- The Reusable 3D Card Component ---
const TiltCard = ({ imageSrc, name, title, variant, showCrown }: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse move logic for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * 0.325;
    const mouseY = (e.clientY - rect.top) * 0.325;

    const rX = (mouseY / height - 0.5) * -20;
    const rY = (mouseX / width - 0.5) * 20;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Theme configuration based on variant
  const isLove = variant === 'love';
  const cardGradient = isLove 
    ? "bg-gradient-to-br from-red-50 to-pink-50" 
    : "bg-gradient-to-br from-slate-50 to-blue-50";
  
  const ringGradient = isLove
    ? "from-red-300 to-pink-300"
    : "from-blue-300 to-indigo-300";

  const badgeColor = isLove
    ? "text-pink-500"
    : "text-blue-600";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d", transform }}
      className="relative group w-80 h-96 rounded-3xl bg-white shadow-xl border border-gray-100"
    >
       {/* --- Floating Orbiting Elements (Customized per variant) --- */}
       {isLove ? (
           <>
               <FloatingIcon icon={HeartIcon} color="text-red-500" delay={0} x={-40} y={-40} />
               <FloatingIcon icon={SparklesIcon} color="text-yellow-400" delay={1} x={40} y={-60} />
               <FloatingIcon icon={CommandLineIcon} color="text-blue-400" delay={2} x={-50} y={50} />
               <FloatingIcon icon={StarIcon} color="text-purple-400" delay={1.5} x={50} y={40} />
           </>
       ) : (
           <>
               <FloatingIcon icon={CodeBracketIcon} color="text-blue-500" delay={0} x={-40} y={-40} />
               <FloatingIcon icon={BoltIcon} color="text-yellow-500" delay={1} x={40} y={-60} />
               <FloatingIcon icon={CommandLineIcon} color="text-slate-600" delay={2} x={-50} y={50} />
               <FloatingIcon icon={StarIcon} color="text-indigo-400" delay={1.5} x={50} y={40} />
           </>
       )}

       {/* --- Inner Content --- */}
       <div 
         style={{ transform: "translateZ(50px)" }} 
         className={`absolute inset-4 ${cardGradient} rounded-2xl flex flex-col items-center justify-center p-6 border border-white/50 shadow-inner`}
       >
            {/* Photo Wrapper with Glowing Ring */}
            <div className="relative w-40 h-40 mb-6">
                {/* Spinning Ring */}
                <div className={`absolute inset-[-4px] rounded-full bg-gradient-to-tr ${ringGradient} opacity-70 blur-sm animate-spin-slow`} />
                
                {/* The Photo */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-sm bg-gray-200">
                     <img 
                        src={imageSrc} 
                        alt={name} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=256`;
                        }}
                     />
                </div>

                {/* Crown Sticker (Only if showCrown is true) */}
                {showCrown && (
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -bottom-2 -right-2 bg-white text-2xl p-1 rounded-full shadow-sm border border-gray-100 z-20"
                    >
                        👑
                    </motion.div>
                )}
            </div>

            {/* Name & Title */}
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>
            <p className={`text-xs font-semibold ${badgeColor} uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm`}>
                {title}
            </p>
       </div>
    </motion.div>
  );
};

// Helper for floating icons
const FloatingIcon = ({ icon: Icon, color, delay, x, y }: any) => {
    return (
        <motion.div
            style={{ transform: "translateZ(75px)" }}
            animate={{ 
                y: [0, -10, 0],
                rotate: [0, 10, -10, 0]
            }}
            transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: delay, 
                ease: "easeInOut" 
            }}
            className={`absolute z-50 bg-white p-3 rounded-full shadow-lg ${color}`}
        >
             <div className="absolute w-10 h-10 flex items-center justify-center" 
                  style={{ 
                      marginTop: y, 
                      marginLeft: x,
                      left: '50%',
                      top: '50%' 
                   }}
             >
                 <Icon className="w-6 h-6" />
             </div>
        </motion.div>
    );
};

export default Dedication;