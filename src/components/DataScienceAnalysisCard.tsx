import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Code, 
  BarChart3, 
  Database,
  Eye,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { DataScienceAnalysis } from '../services/dataScienceAnalyzer';

interface DataScienceAnalysisCardProps {
  analysis: DataScienceAnalysis;
  className?: string;
}

export const DataScienceAnalysisCard: React.FC<DataScienceAnalysisCardProps> = ({
  analysis,
  className = ""
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 6) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 4) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getReadinessColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-blue-500';
    if (score >= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const skillIcons = {
    programming: Code,
    statistics: BarChart3,
    machineLearning: Brain,
    dataTools: Database,
    visualization: Eye
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h3 className="text-3xl font-bold text-black">Data Science Resume Analysis</h3>
          <p className="text-gray-600 text-lg">Professional assessment for data science roles</p>
        </div>
      </div>

      {/* Overall Score */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-2xl font-bold text-black">Overall Relevance Score</h4>
          <div className={`px-6 py-3 rounded-2xl text-2xl font-bold border-2 ${getScoreColor(analysis.overallRelevanceScore)}`}>
            {analysis.overallRelevanceScore}/10
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(analysis.overallRelevanceScore / 10) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`h-4 rounded-full ${getReadinessColor(analysis.overallRelevanceScore)}`}
          />
        </div>
      </div>

      {/* Technical Skills Breakdown */}
      <div className="mb-8">
        <h4 className="text-xl font-bold text-black mb-6 flex items-center">
          <Code className="w-6 h-6 mr-2" />
          Technical Skills Assessment
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(analysis.technicalSkillsBreakdown).map(([skill, data]) => {
            const IconComponent = skillIcons[skill as keyof typeof skillIcons];
            return (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <IconComponent className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-semibold text-gray-800 capitalize">{skill}</span>
                  </div>
                  <span className={`font-bold ${data.score >= 7 ? 'text-green-600' : data.score >= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {data.score}/10
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${data.score >= 7 ? 'bg-green-500' : data.score >= 5 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${(data.score / 10) * 100}%` }}
                  />
                </div>
                {data.present.length > 0 && (
                  <div className="text-xs text-green-700 mb-1">
                    ✓ {data.present.slice(0, 2).join(', ')}
                  </div>
                )}
                {data.missing.length > 0 && (
                  <div className="text-xs text-red-700">
                    ✗ Missing: {data.missing.slice(0, 2).join(', ')}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Experience & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Experience */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Experience Assessment ({analysis.experienceRelevance.experienceScore}/10)
          </h4>
          {analysis.experienceRelevance.dataRelatedExperience.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-green-700 mb-1">✓ Data-Related Experience:</p>
              <p className="text-sm text-green-600">{analysis.experienceRelevance.dataRelatedExperience.join(', ')}</p>
            </div>
          )}
          {analysis.experienceRelevance.analyticalExperience.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-blue-700 mb-1">~ Analytical Experience:</p>
              <p className="text-sm text-blue-600">{analysis.experienceRelevance.analyticalExperience.slice(0, 3).join(', ')}</p>
            </div>
          )}
          {analysis.experienceRelevance.irrelevantExperience.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">✗ Irrelevant Experience:</p>
              <p className="text-sm text-red-600">{analysis.experienceRelevance.irrelevantExperience.join(', ')}</p>
            </div>
          )}
        </div>

        {/* Education */}
        <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
          <h4 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Education Assessment ({analysis.educationAssessment.educationScore}/10)
          </h4>
          {analysis.educationAssessment.relevantEducation.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-green-700 mb-1">✓ Relevant Education:</p>
              <p className="text-sm text-green-600">{analysis.educationAssessment.relevantEducation.join(', ')}</p>
            </div>
          )}
          {analysis.educationAssessment.supportiveEducation.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-blue-700 mb-1">~ Supportive Education:</p>
              <p className="text-sm text-blue-600">{analysis.educationAssessment.supportiveEducation.join(', ')}</p>
            </div>
          )}
          {analysis.educationAssessment.irrelevantEducation.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">✗ Irrelevant Education:</p>
              <p className="text-sm text-red-600">{analysis.educationAssessment.irrelevantEducation.join(', ')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Key Strengths */}
      {analysis.keyStrengths.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-bold text-black mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Key Strengths
          </h4>
          <div className="space-y-3">
            {analysis.keyStrengths.map((strength, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start bg-green-50 border border-green-200 rounded-xl p-4"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-green-800 font-medium">{strength}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Major Gaps */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-black mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          Major Gaps
        </h4>
        <div className="space-y-3">
          {analysis.majorGaps.map((gap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start bg-red-50 border border-red-200 rounded-xl p-4"
            >
              <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-red-800 font-medium">{gap}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Irrelevant Elements */}
      {analysis.irrelevantElements.length > 0 && (
        <div className="mb-8">
          <h4 className="text-lg font-bold text-black mb-4 flex items-center">
            <XCircle className="w-5 h-5 text-orange-600 mr-2" />
            Irrelevant Elements
          </h4>
          <div className="space-y-2">
            {analysis.irrelevantElements.map((element, index) => (
              <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <span className="text-orange-800 font-medium">⚠️ {element}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Recommendations */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-black mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
          Improvement Recommendations
        </h4>
        <div className="space-y-3">
          {analysis.improvementRecommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start bg-blue-50 border border-blue-200 rounded-xl p-4"
            >
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 text-sm font-bold">
                {index + 1}
              </div>
              <span className="text-blue-800 font-medium">{recommendation}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Job Readiness Assessment */}
      <div className="bg-gradient-to-r from-gray-800 to-black rounded-2xl p-6 text-white">
        <h4 className="text-xl font-bold mb-4 flex items-center">
          <Award className="w-6 h-6 mr-2" />
          Honest Job Readiness Assessment
        </h4>
        <p className="text-lg leading-relaxed font-medium">
          {analysis.jobReadinessAssessment}
        </p>
      </div>
    </div>
  );
};