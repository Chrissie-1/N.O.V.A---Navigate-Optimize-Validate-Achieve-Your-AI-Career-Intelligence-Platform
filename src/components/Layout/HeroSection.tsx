import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Users, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="inline-flex items-center px-6 py-3 bg-yellow-100/80 backdrop-blur-sm border border-yellow-200 rounded-full mb-8">
              <Star className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-semibold">AI-Powered Career Intelligence</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              N.O.V.A
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Navigate Optimize Validate Achieve
              </span>
              <span className="block text-4xl md:text-5xl mt-4 text-gray-300">
                Your AI Career Intelligence Platform
              </span>
            </h1>
            
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              NOVA analyzes your resume, identifies skill gaps, and creates a personalized roadmap 
              to land your dream role with the salary you deserve.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <div className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                <span className="text-white font-bold text-lg">Built by Chrissie Raj</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-12 py-6 rounded-2xl font-bold text-xl hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 flex items-center shadow-2xl hover:shadow-3xl"
            >
              Start Free Analysis
              <ArrowRight className="w-6 h-6 ml-3" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/30 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:border-white/50 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            {[
              { icon: TrendingUp, value: "95%", label: "Success Rate", color: "from-yellow-400 to-yellow-500" },
              { icon: Users, value: "50K+", label: "Careers Transformed", color: "from-white to-gray-200" },
              { icon: Zap, value: "$35K", label: "Avg. Salary Increase", color: "from-yellow-400 to-yellow-500" },
              { icon: Star, value: "4.9", label: "User Rating", color: "from-white to-gray-200" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};