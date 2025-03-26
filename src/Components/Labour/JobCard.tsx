import React from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { JobPost } from '../../Types/JobTypes';

// Utility function for date formatting
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch (error) {
    return 'N/A';
  }
};

interface JobCardProps {
  job: JobPost;
  onShowInterest: (job: JobPost) => void;
  onViewDetails: (job: JobPost) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onShowInterest, onViewDetails }) => (
  <div className={`
    bg-white rounded-lg shadow-md hover:shadow-lg 
    transition-all duration-300 overflow-hidden border 
    ${job.isPreferred ? 'border-purple-300' : 'border-gray-100'} 
    w-full max-w-md 
    mx-auto
    transform hover:-translate-y-1 hover:scale-[1.01]
    min-h-[200px] h-auto
  `}>
    {/* Job Card Header */}
    <div className={`
      ${job.isPreferred ? 'bg-purple-700' : 'bg-purple-600'} 
      text-white p-3 flex items-center justify-between
    `}>
      <div className="flex items-center gap-2 truncate w-full">
        <FaBriefcase className="text-sm flex-shrink-0" />
        <h2 className="font-bold text-sm truncate flex-grow">
          {job.title}
        </h2>
        {job.isPreferred && (
          <span className="
            bg-yellow-400 text-purple-900 
            text-xs px-1.5 py-0.5 rounded-full 
            ml-1 flex-shrink-0
          ">
            Preferred
          </span>
        )}
      </div>
    </div>

    <div className="p-3 space-y-3">
      {/* Employer Profile */}
      <div className="flex items-center bg-gray-50 p-2 rounded-lg">
        <div className="
          w-8 h-8 
          rounded-full bg-purple-100 
          flex items-center justify-center 
          overflow-hidden flex-shrink-0
        ">
          {job.profileImageUrl ? (
            <img 
              src={job.profileImageUrl} 
              alt={job.fullName} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span className="text-purple-600 font-bold text-xs">
              {job.fullName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="ml-2 truncate flex-grow">
          <h3 className="
            font-medium text-gray-800 
            text-xs 
            truncate
          ">
            {job.fullName}
          </h3>
          <p className="text-[10px] text-gray-500">Job Provider</p>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-500 flex-shrink-0 text-sm" />
          <span className="truncate text-xs">
            {job.muncipalityId || 'Location N/A'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-green-500 flex-shrink-0 text-sm" />
          <span className="text-xs">{formatDate(job.createdDate)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button 
          onClick={() => onViewDetails(job)}
          className="
            flex-1 bg-purple-600 text-white 
            py-2 rounded-lg text-xs 
            hover:bg-purple-700 transition
            font-semibold
          "
        >
          View Details
        </button>
        <button 
          onClick={() => onShowInterest(job)}
          className="
            flex-1 bg-gray-100 text-purple-600 
            py-2 rounded-lg text-xs 
            hover:bg-gray-200 transition
            font-semibold
          "
        >
          Interested
        </button>
      </div>
    </div>
  </div>
);

export default JobCard;