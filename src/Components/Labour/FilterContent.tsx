import React, { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';

interface FilterContentProps {
  selectedJobTitles: string[];
  setSelectedJobTitles: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterContent: React.FC<FilterContentProps> = ({ 
  selectedJobTitles, 
  setSelectedJobTitles 
}) => {
  const [jobTitleInput, setJobTitleInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleJobTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitleInput(e.target.value);
  };

  const handleAddJobTitle = (title: string) => {
    if (title.trim() && !selectedJobTitles.includes(title.trim())) {
      setSelectedJobTitles(prev => [...prev, title.trim()]);
      setJobTitleInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddJobTitle(jobTitleInput);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow p-3 mt-2">
      <h2 className="font-bold text-sm text-purple-700 border-b border-gray-200 pb-2">Filter Jobs</h2>
      <div className="mt-2">
        <h3 className="font-semibold text-xs text-gray-700">Job Title</h3>
        <div className="mt-1 relative">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-xs" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={jobTitleInput}
              onChange={handleJobTitleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search job title"
              className="pl-8 pr-12 py-2 w-full text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none"
            />
            <button
              onClick={() => handleAddJobTitle(jobTitleInput)}
              className="absolute right-2 bg-purple-600 text-white px-2 py-1 rounded-lg hover:bg-purple-700 transition text-xs"
            >
              Add
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          {selectedJobTitles.map((title) => (
            <div key={title} className="flex items-center justify-between bg-purple-50 p-2 rounded-md text-xs">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedJobTitles.includes(title)}
                  onChange={() =>
                    setSelectedJobTitles((prev) =>
                      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
                    )
                  }
                  className="h-3 w-3 text-purple-600 focus:ring-purple-500"
                />
                <span>{title}</span>
              </label>
              <button 
                onClick={() => setSelectedJobTitles(prev => prev.filter(t => t !== title))}
                className="text-gray-500 hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {/* Additional filter sections */}
        <div className="mt-5">
          <h3 className="font-semibold text-xs text-gray-700 mb-2">Available Work</h3>
          <div className="text-xs text-gray-600">
            <p className="mb-2">
              Find daily and weekly jobs that match your skills. Connect directly with clients looking for reliable workers.
            </p>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold text-xs text-gray-700 mb-1">In-Demand Skills</h3>
          <div className="flex flex-wrap gap-1">
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Construction</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Cleaning</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Moving</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Painting</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold text-xs text-gray-700 mb-1">Quick Tips</h3>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
            <li>Complete your profile to get more job matches</li>
            <li>Add skills to help clients find you</li>
            <li>Check in daily for new opportunities</li>
          </ul>
        </div>
        
        <div className="mt-4 bg-purple-50 p-2 rounded-md">
          <h3 className="font-semibold text-xs text-purple-700">Payment Info</h3>
          <p className="text-xs text-gray-600 mt-1">
            Most jobs pay between $15-25/hr. Get paid securely through our app after job completion.
          </p>
        </div>
        
        <div className="mt-4">
          <h3 className="font-semibold text-xs text-gray-700">Getting Started</h3>
          <ol className="text-xs text-gray-600 list-decimal pl-4 space-y-1">
            <li>Filter jobs by type and location</li>
            <li>Apply with a single tap</li>
            <li>Confirm details with the client</li>
            <li>Complete the work and submit for payment</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default FilterContent;