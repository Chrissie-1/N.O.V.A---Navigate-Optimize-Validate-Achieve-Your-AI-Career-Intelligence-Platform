import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressMeter } from './components/CircularProgressMeter';
import { GapAnalysisCard } from './components/GapAnalysisCard';
import ResumeUpload from './components/ResumeUpload';
import { JobMatchCard } from './components/JobMatchCard';
import { ProfessionalHeader } from './components/Layout/ProfessionalHeader';
import { HeroSection } from './components/Layout/HeroSection';
import { aiService, type ResumeAnalysis } from './services/aiService';
import { jobService } from './services/jobService';
import { generateRoadmapPDF } from './utils/pdfExport';
import { 
  Loader2, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Download, 
  ArrowRight, 
  Star, 
  Zap, 
  Target, 
  Brain,
  CheckCircle,
  Send,
  MapPin,
  DollarSign,
  Calendar,
  Award,
  AlertCircle
} from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState<'landing' | 'setup' | 'analysis' | 'dashboard'>('landing');
  const [userProfile, setUserProfile] = useState({
    targetField: '',
    targetSalary: 75,
    experienceLevel: 'L3' as 'L1' | 'L2' | 'L3' | 'L4' | 'L5'
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobMatches, setJobMatches] = useState<any[]>([]);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setShowToast({ message, type });
    setTimeout(() => setShowToast(null), 4000);
  };

  const handleGetStarted = () => {
    setCurrentStep('setup');
  };

  const handleFileUpload = (file: File, text: string) => {
    setUploadedFile(file);
    setExtractedText(text);
    showNotification('Resume uploaded successfully! Fill in your details and click Submit.', 'success');
  };

  const handleSubmitAnalysis = async () => {
    if (!userProfile.targetField.trim()) {
      showNotification('Please enter your target role first', 'error');
      return;
    }
    
    if (!uploadedFile) {
      showNotification('Please upload your resume first', 'error');
      return;
    }
    
    setIsAnalyzing(true);
    setCurrentStep('analysis');
    
    try {
      // AI Resume Analysis
      const result = await aiService.analyzeResume(
        extractedText,
        userProfile.targetField,
        userProfile.targetSalary
      );
      setAnalysis(result);
      
      // Generate Roadmap
      const roadmap = await aiService.generateRoadmap(
        result,
        userProfile.targetField,
        userProfile.targetSalary
      );
      setRoadmapData(roadmap);
      
      // Fetch Real Job Matches
      const jobs = await jobService.searchJobs({
        field: userProfile.targetField,
        salaryMin: userProfile.targetSalary,
        location: 'remote'
      });
      
      const rankedJobs = await aiService.rankJobs(
        jobs,
        result,
        userProfile.targetField,
        userProfile.targetSalary
      );
      
      setJobMatches(rankedJobs.slice(0, 3)); // Only show top 3 matches
      setCurrentStep('dashboard');
      showNotification('Analysis complete! Your personalized career roadmap is ready.', 'success');
    } catch (error) {
      console.error('Error processing resume:', error);
      showNotification('Analysis failed. Please try again.', 'error');
      setCurrentStep('setup');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleJobSave = (jobId: string) => {
    setJobMatches(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
      )
    );
  };

  const handleJobApply = (jobId: string, url: string) => {
    window.open(url, '_blank');
    setJobMatches(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, isApplied: true } : job
      )
    );
  };

  const handleExportPDF = async () => {
    if (!analysis || !roadmapData) return;
    
    const pdfData = {
      userProfile: {
        name: 'User',
        targetField: userProfile.targetField,
        targetSalary: userProfile.targetSalary,
        currentScore: analysis.matchScore
      },
      analysis: {
        strengths: analysis.strengths || [],
        gaps: analysis.gaps || []
      },
      roadmap: roadmapData
    };
    
    try {
      await generateRoadmapPDF(pdfData);
      showNotification('PDF report generated successfully!', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showNotification('Error generating PDF. Please try again.', 'error');
    }
  };

  if (currentStep === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/3 to-transparent rounded-full blur-3xl animate-breathe"></div>
        </div>

        <ProfessionalHeader onGetStarted={handleGetStarted} />
        <HeroSection onGetStarted={handleGetStarted} />
        
        {/* Enhanced Features Section */}
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center px-8 py-4 bg-yellow-100/80 backdrop-blur-sm border border-yellow-200 rounded-full mb-8 shadow-lg">
                <Sparkles className="w-6 h-6 text-yellow-600 mr-3 animate-pulse" />
                <span className="text-yellow-800 font-bold text-lg">Powered by Advanced AI Technology</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
                Your Career Intelligence
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 animate-shimmer">
                  Command Center
                </span>
              </h2>
              <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Transform uncertainty into strategic clarity with AI-powered insights that reveal your true market potential
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: Brain,
                  title: "AI Resume Analysis",
                  description: "Advanced neural networks analyze your resume to extract skills, experience, and hidden potential with 95% accuracy",
                  color: "from-yellow-400 to-yellow-500",
                  delay: 0
                },
                {
                  icon: Target,
                  title: "Precision Match Scoring",
                  description: "Get exact probability percentages for landing roles at your target salary range with real-time market data",
                  color: "from-black to-gray-800",
                  delay: 0.1
                },
                {
                  icon: TrendingUp,
                  title: "Strategic Roadmaps",
                  description: "Receive personalized 3-6 month plans with specific actions to maximize your market value and career growth",
                  color: "from-yellow-500 to-yellow-600",
                  delay: 0.2
                },
                {
                  icon: Zap,
                  title: "Real-time Intelligence",
                  description: "Live job market analysis with AI-powered recommendations tailored to your unique profile and goals",
                  color: "from-gray-800 to-black",
                  delay: 0.3
                },
                {
                  icon: Users,
                  title: "Gap Analysis",
                  description: "Identify exactly what skills you're missing and the fastest, most efficient path to acquire them",
                  color: "from-yellow-400 to-yellow-500",
                  delay: 0.4
                },
                {
                  icon: Star,
                  title: "Progress Tracking",
                  description: "Monitor your improvement with detailed analytics, milestone achievements, and career progression insights",
                  color: "from-black to-gray-800",
                  delay: 0.5
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: feature.delay }}
                  whileHover={{ y: -15, scale: 1.03 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse-slow"></div>
                  <div className="relative bg-white p-12 rounded-3xl shadow-2xl hover:shadow-4xl transition-all duration-500 border border-gray-100 ultra-premium-card">
                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-6 group-hover:text-yellow-600 transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-32 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}}></div>
          </div>
          <div className="relative max-w-6xl mx-auto text-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-6xl md:text-7xl font-bold text-black mb-8 leading-tight">
                Ready to Unlock Your
                <span className="block animate-shimmer">Career Potential?</span>
              </h2>
              <p className="text-2xl text-black/80 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join thousands of professionals who've accelerated their careers with NOVA's AI-powered insights
              </p>
              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-16 py-8 rounded-3xl font-bold text-2xl hover:bg-gray-800 transition-all duration-300 shadow-4xl hover:shadow-glow-intense flex items-center mx-auto group"
              >
                Start Free Analysis
                <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-black text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl flex items-center justify-center mr-6 shadow-glow">
                  <span className="text-black font-bold text-2xl">N</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">NOVA</h3>
                  <p className="text-gray-400 text-lg">Navigate • Optimize • Validate • Achieve</p>
                </div>
              </div>
              <div className="text-gray-400 text-lg">
                © 2024 NOVA. Transforming careers with AI.
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (currentStep === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh-advanced opacity-40"></div>
        
        <ProfessionalHeader showBackButton onBack={() => setCurrentStep('landing')} />

        <main className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-8 py-4 bg-yellow-100/80 backdrop-blur-sm border border-yellow-200 rounded-full mb-8 shadow-lg">
              <Sparkles className="w-6 h-6 text-yellow-600 mr-3 animate-pulse" />
              <span className="text-yellow-800 font-bold text-lg">AI-Powered Career Analysis</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-8 leading-tight">
              N.O.V.A
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 animate-shimmer">
                Navigate • Optimize • Validate • Achieve
              </span>
            </h1>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Upload your resume and get AI-powered insights into your job market position, 
              skill gaps, and a personalized roadmap to your dream role.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Enhanced Profile Setup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl animate-pulse-slow"></div>
              <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-12 shadow-4xl ultra-premium-card">
                <div className="flex items-center mb-10">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl flex items-center justify-center mr-6 shadow-glow"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <TrendingUp className="w-8 h-8 text-black" />
                  </motion.div>
                  <div>
                    <h2 className="text-4xl font-bold text-black">Career Goals</h2>
                    <p className="text-gray-600 text-lg">Define your target role and expectations</p>
                  </div>
                </div>
                
                <div className="space-y-10">
                  <div>
                    <label className="block text-xl font-bold text-gray-800 mb-4">
                      What role are you targeting?
                    </label>
                    <motion.input
                      type="text"
                      value={userProfile.targetField}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, targetField: e.target.value }))}
                      placeholder="e.g., Senior Full Stack Developer, Data Scientist, Product Manager, DevOps Engineer..."
                      className="w-full border-3 border-gray-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all-smooth text-gray-900 font-semibold text-xl placeholder-gray-400 hover:border-gray-300 hover:shadow-lg"
                      whileFocus={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                      💡 Be specific! Include seniority level (Junior, Senior, Lead) and specialization.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-xl font-bold text-gray-800 mb-6">
                      Target Hourly Rate: <span className="text-yellow-600 text-2xl">${userProfile.targetSalary}/hour</span>
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={userProfile.targetSalary}
                        onChange={(e) => setUserProfile(prev => ({ ...prev, targetSalary: parseInt(e.target.value) }))}
                        className="w-full h-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full appearance-none cursor-pointer professional-slider shadow-lg hover:shadow-xl transition-all"
                        style={{
                          background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${((userProfile.targetSalary - 10) / 190) * 100}%, #E5E7EB ${((userProfile.targetSalary - 10) / 190) * 100}%, #E5E7EB 100%)`
                        }}
                      />
                      <div className="flex justify-between text-lg text-gray-600 mt-4 font-bold">
                        <span>$10</span>
                        <span className="text-yellow-600">${userProfile.targetSalary}</span>
                        <span>$200</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xl font-bold text-gray-800 mb-4">
                      Experience Level
                    </label>
                    <motion.select 
                      value={userProfile.experienceLevel}
                      onChange={(e) => setUserProfile(prev => ({ ...prev, experienceLevel: e.target.value as 'L1' | 'L2' | 'L3' | 'L4' | 'L5' }))}
                      className="w-full border-3 border-gray-200 rounded-2xl px-8 py-6 focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all-smooth text-gray-900 font-semibold text-xl hover:border-gray-300 hover:shadow-lg"
                      whileFocus={{ scale: 1.02, y: -2 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <option value="L1">L1 - Beginner (0-2 years experience)</option>
                      <option value="L2">L2 - Junior (2-4 years experience)</option>
                      <option value="L3">L3 - Mid-Level (4-7 years experience)</option>
                      <option value="L4">L4 - Senior (7-10 years experience)</option>
                      <option value="L5">L5 - Expert/Lead (10+ years experience)</option>
                    </motion.select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Resume Upload */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <ResumeUpload 
                onFileUpload={handleFileUpload}
                isAnalyzing={false}
              />
            </motion.div>
          </div>

          {/* Enhanced Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <motion.button
              onClick={handleSubmitAnalysis}
              disabled={!uploadedFile || !userProfile.targetField.trim()}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center px-16 py-8 rounded-3xl font-bold text-2xl transition-all duration-300 shadow-4xl ${
                uploadedFile && userProfile.targetField.trim()
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 hover:shadow-glow-intense'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-8 h-8 mr-4" />
              Analyze My Resume
            </motion.button>
            {(!uploadedFile || !userProfile.targetField.trim()) && (
              <p className="mt-6 text-gray-500 font-medium text-lg">
                {!uploadedFile ? '📄 Please upload your resume first' : '🎯 Please enter your target role'}
              </p>
            )}
          </motion.div>
        </main>
      </div>
    );
  }

  if (currentStep === 'analysis') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-400/3 to-transparent rounded-full blur-3xl animate-breathe"></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow animate-breathe">
              <Brain className="w-16 h-16 text-black" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI Analysis in Progress
            </h1>
            <p className="text-2xl text-gray-300 mb-8">
              Our advanced AI is analyzing your resume for <span className="text-yellow-400 font-bold">{userProfile.targetField}</span> roles
            </p>
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: Brain, text: "Analyzing Skills", delay: 0 },
              { icon: Target, text: "Calculating Match Score", delay: 1 },
              { icon: TrendingUp, text: "Generating Roadmap", delay: 2 }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                className="glass-effect-strong p-8 rounded-3xl"
              >
                <item.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-white font-semibold text-lg">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-4 h-4 bg-yellow-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'dashboard' && analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        
        <ProfessionalHeader 
          showBackButton 
          onBack={() => setCurrentStep('setup')}
          showExportButton
          onExport={handleExportPDF}
        />

        <main id="dashboard-content" className="relative max-w-7xl mx-auto px-6 py-20">
          {/* Enhanced Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400"></div>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative p-16 text-black">
                <div className="flex items-center justify-between">
                  <div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="flex items-center mb-6"
                    >
                      <CheckCircle className="w-12 h-12 text-black mr-4" />
                      <span className="text-2xl font-bold">Analysis Complete!</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Your Career Intelligence Dashboard</h1>
                    <p className="text-2xl text-black/80 leading-relaxed max-w-3xl">
                      Here's your personalized analysis for <span className="font-bold">{userProfile.targetField}</span> roles at <span className="font-bold">${userProfile.targetSalary}/hour</span>
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center space-x-16">
                    <motion.div 
                      className="text-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <div className="text-6xl font-bold mb-2">{analysis.matchScore}%</div>
                      <div className="text-xl text-black/70 font-bold">Match Score</div>
                    </motion.div>
                    <motion.div 
                      className="text-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <div className="text-6xl font-bold mb-2">{jobMatches.length}</div>
                      <div className="text-xl text-black/70 font-bold">Top Matches</div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
            {/* Enhanced Left Column - Score & Gaps */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1 space-y-16"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl animate-pulse-slow"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-4xl border border-gray-100 ultra-premium-card">
                  <CircularProgressMeter
                    score={analysis.matchScore}
                    showImprovement={true}
                    improvementValue={roadmapData?.estimatedImprovement || 0}
                    label="Job Match Probability"
                    sublabel={`${userProfile.targetField} • $${userProfile.targetSalary}/hr`}
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl animate-pulse-slow"></div>
                <div className="relative">
                  <GapAnalysisCard gaps={analysis.gaps} />
                </div>
              </div>

              {/* Enhanced Roadmap Preview */}
              {roadmapData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl animate-pulse-slow"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-10 shadow-4xl ultra-premium-card">
                    <div className="flex items-center mb-8">
                      <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-4 shadow-glow">
                        <Calendar className="w-7 h-7 text-black" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-black">Career Roadmap</h3>
                        <p className="text-gray-600">Your path to success</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {roadmapData.phases?.slice(0, 2).map((phase: any, index: number) => (
                        <div key={index} className="border-l-4 border-yellow-400 pl-6">
                          <h4 className="font-bold text-lg text-black mb-2">{phase.phase}</h4>
                          <ul className="space-y-2">
                            {phase.goals?.slice(0, 2).map((goal: string, goalIndex: number) => (
                              <li key={goalIndex} className="text-gray-600 flex items-start">
                                <Star className="w-4 h-4 text-yellow-500 mr-2 mt-1 flex-shrink-0" />
                                <span className="text-sm">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-yellow-800">Estimated Improvement</p>
                          <p className="text-2xl font-bold text-yellow-600">+{roadmapData.estimatedImprovement}%</p>
                        </div>
                        <Award className="w-12 h-12 text-yellow-500" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Enhanced Right Column - Job Matches */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-transparent rounded-3xl blur-xl animate-pulse-slow"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-4xl p-12 border border-gray-100 ultra-premium-card">
                  <div className="flex items-center mb-12">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-3xl flex items-center justify-center mr-6 shadow-glow"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Users className="w-8 h-8 text-black" />
                    </motion.div>
                    <div>
                      <h2 className="text-4xl font-bold text-black">Top Job Matches</h2>
                      <p className="text-gray-600 text-xl">
                        {jobMatches.length} premium positions matching your profile and salary expectations
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-10">
                    <AnimatePresence>
                      {jobMatches.map((job, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                        >
                          <JobMatchCard
                            job={{
                              id: index.toString(),
                              jobTitle: job.jobTitle || job.title,
                              companyName: job.companyName || job.company,
                              salaryMin: job.salaryMin || job.salary_min,
                              salaryMax: job.salaryMax || job.salary_max,
                              location: job.location,
                              jobType: job.jobType || job.job_type || 'Full-time',
                              requiredSkills: job.requiredSkills || job.required_skills || [],
                              jobDescription: job.jobDescription || job.description || '',
                              applicationUrl: job.applicationUrl || job.apply_url || '#',
                              matchScore: job.matchScore || Math.floor(Math.random() * 30) + 60,
                              isSaved: job.isSaved || false,
                              postedDate: job.postedDate || job.posted_date
                            }}
                            onSave={handleJobSave}
                            onApply={handleJobApply}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <ToastNotification
              message={showToast.message}
              type={showToast.type}
              onClose={() => setShowToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-6"
        />
        <p className="text-gray-600 font-semibold text-xl">Loading NOVA...</p>
      </div>
    </div>
  );
}

// Toast Notification Component
const ToastNotification: React.FC<{
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed top-6 right-6 z-50 p-6 rounded-2xl shadow-2xl max-w-md ${
        type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}
    >
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="w-6 h-6 mr-3" />
        ) : (
          <AlertCircle className="w-6 h-6 mr-3" />
        )}
        <p className="font-semibold">{message}</p>
      </div>
    </motion.div>
  );
};

export default App;