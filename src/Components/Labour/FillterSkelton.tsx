import React from 'react';

const FilterSkeleton = () => (
  <div className="bg-gray-50 rounded-lg shadow p-3 mt-12 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
    <div className="mt-2">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
      <div className="h-8 bg-gray-200 rounded w-full mb-3"></div>
      
      <div className="mt-5">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-12 bg-gray-200 rounded w-full mb-3"></div>
      </div>
      
      <div className="mt-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
        <div className="flex flex-wrap gap-1">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-6 w-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default FilterSkeleton;