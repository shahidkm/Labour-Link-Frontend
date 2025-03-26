import React from 'react';

const JobCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 animate-pulse">
    <div className="bg-purple-200 h-12"></div>
    <div className="p-3 space-y-3">
      {/* Employer Profile Skeleton */}
      <div className="flex items-center bg-gray-50 p-2 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        <div className="ml-2 space-y-1 flex-1">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      {/* Job Details Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded flex-1"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>

      {/* Actions Skeleton */}
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 h-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default JobCardSkeleton;