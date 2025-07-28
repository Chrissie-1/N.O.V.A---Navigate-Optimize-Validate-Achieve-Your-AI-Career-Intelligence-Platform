import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, TrendingUp, Zap, Target, Brain } from 'lucide-react'
import { AuthModal } from '../Auth/AuthModal'

export const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup')

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-black font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-black">NOVA</h1>
                <p className="text-xs text-gray-500 -mt-1">Career Intelligence</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => openAuth('signin')}
                className="text-gray-700 hover:text-black font-medium transition-colors"
              >
                Sign In
              </button>
              <motion.button
                onClick={() => openAuth('signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-6">
                <Star className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-yellow-800 font-medium">AI-Powered Career Intelligence</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
                Navigate to Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Dream Job
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                NOVA analyzes your resume, identifies skill gaps, and creates a personalized roadmap 
                to land your dream role with the salary you deserve.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <motion.button
                onClick={() => openAuth('signup')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors flex items-center shadow-xl"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">85%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">10K+</div>
                <div className="text-gray-600">Careers Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">$25K</div>
                <div className="text-gray-600">Avg. Salary Increase</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Your Personal Career Command Center
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by advanced AI, NOVA transforms your career uncertainty into strategic clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Resume Analysis",
                description: "Advanced AI analyzes your resume to extract skills, experience, and identify improvement opportunities"
              },
              {
                icon: Target,
                title: "Match Probability Score",
                description: "Get a precise percentage of your chances for landing roles at your target salary"
              },
              {
                icon: TrendingUp,
                title: "Personalized Roadmap",
                description: "Receive a strategic 3-6 month plan with specific actions to boost your market value"
              },
              {
                icon: Zap,
                title: "Real-time Job Matching",
                description: "AI-powered job recommendations that match your skills and salary expectations"
              },
              {
                icon: Users,
                title: "Gap Analysis",
                description: "Identify exactly what skills you're missing and how to acquire them efficiently"
              },
              {
                icon: Star,
                title: "Progress Tracking",
                description: "Monitor your improvement with detailed analytics and milestone achievements"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who've accelerated their careers with NOVA's AI-powered insights
            </p>
            <motion.button
              onClick={() => openAuth('signup')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors shadow-xl"
            >
              Start Free Analysis
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mr-3">
                <span className="text-black font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">NOVA</h3>
                <p className="text-gray-400 text-sm">Career Intelligence Platform</p>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 NOVA. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}