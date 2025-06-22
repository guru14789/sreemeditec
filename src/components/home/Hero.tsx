import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-[#1d7d69] to-[#21b095] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute right-0 bottom-0 w-1/2 h-1/2 bg-white rounded-full transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute left-0 top-0 w-1/3 h-1/3 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center min-h-[540px] sm:min-h-[570px] md:min-h-[600px] lg:min-h-[630px] py-12 sm:py-16 lg:py-20">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Medical Equipment Solutions to Power Modern Healthcare 
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-lg">
              We deliver cutting-edge reliable medical equipment for today’s healthcare needs..
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="bg-white text-[#1d7d69] hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-all">
                Get Started
              </Link>
              <Link to="/store" className="flex items-center text-white border border-white bg-transparent hover:bg-white/10 font-medium py-3 px-6 rounded-md transition-all">
                Our Store <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end">
            <img 
              src="\download.jpeg" 
              alt="Technology Solutions" 
              className="rounded-lg shadow-xl max-w-full h-auto"
              style={{ maxHeight: '400px' }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
