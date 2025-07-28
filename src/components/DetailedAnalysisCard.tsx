import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, TrendingUp, Award, Target, Brain } from 'lucide-react';

interface DetailedAnalysisCardProps {
  analysis: {
    keyMatchingElements: string[];
    majorGaps: string[];
    detailedJustification: string;
    roleAlignment: {
      technicalMatch: number;
      experienceMatch: number;
      industryMatch: number;
      educationMatch: number;
    };
    matchScore: number;
  };
  targetField: string;
  className?: string;
}

export const DetailedAnalysisCard: React.FC<DetailedAnalysisCardProps> = ({
  analysis,
  targetField,
  className = ""
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAlignmentColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl ${className}`}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-4">
          <Brain className="w-6 h-6 text-black" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-black">Detailed Analysis</h3>
          <p className="text-gray-600">Comprehensive role alignment assessment</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-8">
        <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-bold border-2 ${getScoreColor(analysis.matchScore)}`}>
          <Target className="w-5 h-5 mr-2" />
          Relevance Score: {analysis.matchScore}%
        </div>
      </div>

      {/* Role Alignment Breakdown */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-black mb-4">Role Alignment Breakdown</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Technical Match', score: analysis.roleAlignment.technicalMatch, icon: '🔧' },
            { label: 'Experience Match', score: analysis.roleAlignment.experienceMatch, icon: '📈' },
            { label: 'Industry Match', score: analysis.roleAlignment.industryMatch, icon: '🏢' },
            { label: 'Education Match', score: analysis.roleAlignment.educationMatch, icon: '🎓' }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </span>
                <span className="font-bold text-black">{Math.round(item.score)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-2 rounded-full ${getAlignmentColor(item.score)}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Key Matching Elements */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-black mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          Key Matching Elements
        </h4>
        <div className="space-y-3">
          {analysis.keyMatchingElements.length > 0 ? (
            analysis.keyMatchingElements.map((element, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-800 font-medium">{element}</span>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 italic">No specific matching elements identified</div>
          )}
        </div>
      </div>

      {/* Major Gaps */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-black mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          Major Gaps
        </h4>
        <div className="space-y-3">
          {analysis.majorGaps.length > 0 ? (
            analysis.majorGaps.map((gap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-red-800 font-medium">{gap}</span>
              </motion.div>
            ))
          ) : (
            <div className="text-gray-500 italic">No major gaps identified</div>
          )}
        </div>
      </div>

      {/* Detailed Justification */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Analysis Justification
        </h4>
        <p className="text-yellow-800 leading-relaxed font-medium">
          {analysis.detailedJustification}
        </p>
      </div>
    </div>
  );
};