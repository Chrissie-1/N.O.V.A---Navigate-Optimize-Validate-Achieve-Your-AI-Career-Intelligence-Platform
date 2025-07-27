import React from 'react';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface Gap {
  skill: string;
  impact: 'High' | 'Medium' | 'Low';
  timeToAcquire: string;
  description?: string;
}

interface GapAnalysisCardProps {
  gaps: Gap[];
  className?: string;
}

export const GapAnalysisCard: React.FC<GapAnalysisCardProps> = ({ 
  gaps, 
  className = "" 
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'High': return <AlertTriangle className="w-4 h-4" />;
      case 'Medium': return <Clock className="w-4 h-4" />;
      case 'Low': return <TrendingUp className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl ${className}`}>
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mr-4">
          <AlertTriangle className="w-6 h-6 text-black" />
        </div>
        <h3 className="text-2xl font-bold text-black">Skill Gaps Analysis</h3>
      </div>

      <div className="space-y-4">
        {gaps.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold">Great! No major skill gaps identified.</p>
          </div>
        ) : (
          gaps.map((gap, index) => (
            <div key={index} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-yellow-200 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <span className="font-bold text-black text-lg">{gap.skill}</span>
                </div>
                <div className={`flex items-center px-4 py-2 rounded-2xl text-sm font-bold ${getImpactColor(gap.impact)}`}>
                  {getImpactIcon(gap.impact)}
                  <span className="ml-1">{gap.impact} Impact</span>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <Clock className="w-5 h-5 mr-2" />
                <span>Time to acquire: {gap.timeToAcquire}</span>
              </div>
              
              {gap.description && (
                <p className="text-gray-700 leading-relaxed">{gap.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      {gaps.length > 0 && (
        <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
          <p className="text-yellow-800 font-semibold">
            <strong>Tip:</strong> Focus on high-impact gaps first to maximize your match probability improvement.
          </p>
        </div>
      )}
    </div>
  );
};