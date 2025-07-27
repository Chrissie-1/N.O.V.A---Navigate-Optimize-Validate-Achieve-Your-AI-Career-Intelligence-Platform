import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularProgressMeterProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  animationDuration?: number;
  showImprovement?: boolean;
  improvementValue?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const CircularProgressMeter: React.FC<CircularProgressMeterProps> = ({
  score,
  size = 200,
  strokeWidth = 8,
  animationDuration = 2,
  showImprovement = false,
  improvementValue = 0,
  label = "Match Probability",
  sublabel = "Current Score",
  className = ""
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#FFD700'; // Gold for excellent
    if (score >= 60) return '#FFA500'; // Orange for good
    if (score >= 40) return '#FF6B35'; // Orange-red for fair
    return '#FF4444'; // Red for needs improvement
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className={`flex flex-col items-center p-8 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ 
              duration: animationDuration, 
              ease: "easeInOut",
              delay: 0.2 
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-4xl font-bold text-black mb-1">
              {Math.round(animatedScore)}%
            </div>
            
            {showImprovement && improvementValue !== 0 && (
              <div className={`text-sm font-medium ${
                improvementValue > 0 ? 'text-green-600' : 'text-red-500'
              }`}>
                {improvementValue > 0 ? '+' : ''}{improvementValue}% this week
              </div>
            )}
          </motion.div>
        </div>

        {/* Score indicator dots */}
        <div className="absolute inset-0">
          {[25, 50, 75, 100].map((milestone, index) => {
            const angle = (milestone / 100) * 360 - 90;
            const x = size / 2 + (radius + strokeWidth / 2 + 8) * Math.cos(angle * Math.PI / 180);
            const y = size / 2 + (radius + strokeWidth / 2 + 8) * Math.sin(angle * Math.PI / 180);
            
            return (
              <div
                key={milestone}
                className={`absolute w-2 h-2 rounded-full transform -translate-x-1 -translate-y-1 ${
                  score >= milestone ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
                style={{ left: x, top: y }}
              />
            );
          })}
        </div>
      </div>

      {/* Labels */}
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-bold text-black mb-2">{label}</h3>
        <p className="text-lg text-gray-600 font-semibold">{sublabel}</p>
      </div>

      {/* Score interpretation */}
      <div className="mt-4 text-center">
        <span className={`inline-block px-6 py-3 rounded-2xl text-sm font-bold ${
          score >= 80 ? 'bg-green-100 text-green-800' :
          score >= 60 ? 'bg-yellow-100 text-yellow-800' :
          score >= 40 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {score >= 80 ? 'Excellent Match' :
           score >= 60 ? 'Good Match' :
           score >= 40 ? 'Fair Match' :
           'Needs Improvement'}
        </span>
      </div>
    </div>
  );
};