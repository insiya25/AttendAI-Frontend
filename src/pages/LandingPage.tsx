import React from 'react';
import Hero from '../components/landing/Hero';
import FeaturesBento from '../components/landing/FeaturesBento';
import HowItWorks from '../components/landing/HowItWorks';
import Dedication from '../components/landing/Dedication'; 
import HeroScrollDemo from '@/components/landing/HeroScroll';
import LiveStats from '../components/landing/LiveStats';
import DashboardPreview from '../components/landing/DashboardPreview';
import MobileShowcase from '@/components/landing/MobileShowcase';
import Footer from '../components/landing/Footer'; 

const LandingPage = () => {
    return (
        <div className="font-sans antialiased text-gray-900 bg-white">
            <Hero />
            <FeaturesBento /> 
            <HowItWorks />
             <Dedication />
             <HeroScrollDemo/>
             <LiveStats /> 
              <DashboardPreview />
              <MobileShowcase/>
              <Footer/>
            {/* We will add more components here later */}
        </div>
    );
};

export default LandingPage;