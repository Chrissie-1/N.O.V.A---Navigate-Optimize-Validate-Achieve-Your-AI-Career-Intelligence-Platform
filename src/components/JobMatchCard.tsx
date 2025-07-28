import React from 'react';
import { MapPin, DollarSign, Clock, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

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
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min}-${max}/hour`;
    if (min) return `$${min}+/hour`;
    return `Up to $${max}/hour`;
  };

  return (
    <div className={`bg-white border-2 border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:border-yellow-200 transition-all duration-300 h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold text-black mb-2">
            {job.jobTitle}
          </h3>
          <p className="text-gray-600 font-semibold text-lg">{job.companyName}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${getMatchColor(job.matchScore)}`}>
            {job.matchScore}% match
          </span>
          <button
            onClick={() => onSave(job.id)}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
          >
            {job.isSaved ? (
              <BookmarkCheck className="w-6 h-6 text-yellow-500" />
            ) : (
              <Bookmark className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2" />
          <span className="font-semibold">{job.location}</span>
        </div>
        
        <div className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          <span className="font-semibold">{formatSalary(job.salaryMin, job.salaryMax)}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          <span className="font-semibold">{job.jobType}</span>
        </div>
        
        {job.postedDate && (
          <span className="text-gray-500 font-semibold">
            Posted {job.postedDate}
          </span>
        )}
      </div>

      {/* Required Skills */}
      <div className="mb-6 flex-grow">
        <p className="font-bold text-gray-800 mb-3 text-lg">Required Skills:</p>
        <div className="flex flex-wrap gap-3">
          {job.requiredSkills.slice(0, 6).map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-2xl"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills.length > 6 && (
            <span className="px-4 py-2 bg-gray-100 text-gray-500 text-sm font-semibold rounded-2xl">
              +{job.requiredSkills.length - 6} more
            </span>
          )}
        </div>
      </div>

      {/* Job Description Preview */}
      <div className="mb-6">
        <p className="text-gray-700 line-clamp-2 leading-relaxed">
          {job.jobDescription}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t-2 border-gray-100 mt-auto">
        <button
          onClick={() => onApply(job.id, job.applicationUrl)}
          className="flex items-center px-6 py-3 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Apply Now
        </button>
        
        <button className="text-gray-600 hover:text-black transition-colors font-semibold">
          View Details
        </button>
      </div>
    </div>
  );
};