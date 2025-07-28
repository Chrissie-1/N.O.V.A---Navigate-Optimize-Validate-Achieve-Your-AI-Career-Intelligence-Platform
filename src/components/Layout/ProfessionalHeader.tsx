import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';

interface ProfessionalHeaderProps {
  onGetStarted?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
  showExportButton?: boolean;
  onExport?: () => void;
}

export const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  onGetStarted,
  showBackButton,
  onBack,
  showExportButton,
  onExport
}) => {
  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {showBackButton && (
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mr-4 p-3 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </motion.button>
            )}
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <span className="text-black font-bold text-2xl">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">NOVA</h1>
              <p className="text-sm text-gray-500 -mt-1">Career Intelligence</p>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {showExportButton && (
              <motion.button
                onClick={onExport}
                disabled={!onExport}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-2xl font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5 mr-2" />
                Export Report
              </motion.button>
            )}

            {onGetStarted && (
              <motion.button
                onClick={onGetStarted}
                disabled={!onGetStarted}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Started Free
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};