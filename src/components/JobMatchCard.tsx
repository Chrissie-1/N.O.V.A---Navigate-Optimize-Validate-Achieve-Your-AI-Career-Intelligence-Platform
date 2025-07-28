import React from 'react';
import { MapPin, DollarSign, Clock, ExternalLink, Bookmark, BookmarkCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobMatch {
  id: string;
  jobTitle: string;
  companyName: string;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  jobType: string;
  requiredSkills: string[];
  jobDescription: string;
  applicationUrl: string;
  matchScore: number;
  isSaved?: boolean;
  postedDate?: string;
}

interface JobMatchCardProps {
  job: JobMatch;
  onSave: (jobId: string) => void;
  onApply: (jobId: string, url: string) => void;
  className?: string;
}

export const JobMatchCard: React.FC<JobMatchCardProps> = ({
  job,
  onSave,
  onApply,
  className = ""
}) => {
  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-orange-700 bg-orange-50 border-orange-200';
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${min}-${max}/hr`;
    if (min) return `$${min}+/hr`;
    return `Up to $${max}/hr`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-yellow-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col ${className}`}
    >
      {/* Header with Match Score */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
            {job.jobTitle}
          </h3>
          <p className="text-gray-600 font-medium text-base">
            {job.companyName}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getMatchColor(job.matchScore)}`}>
            {Math.round(job.matchScore)}% match
          </span>
          <button
            onClick={() => onSave(job.id)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            {job.isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-yellow-500" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{job.location}</span>
        </div>
        
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          <span className="font-semibold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{job.jobType}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4 flex-grow">
        <p className="text-sm font-semibold text-gray-700 mb-2">Key Skills:</p>
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-lg">
              +{job.requiredSkills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {job.jobDescription}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
        <button
          onClick={() => onApply(job.id, job.applicationUrl)}
          className="flex items-center px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Apply Now
        </button>
        
        <div className="flex items-center text-yellow-500">
          <Star className="w-4 h-4 mr-1" />
          <span className="text-sm font-semibold">Top Match</span>
        </div>
      </div>
    </motion.div>
  );
};