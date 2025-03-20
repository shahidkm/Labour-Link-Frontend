import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaFilter, FaSearch } from "react-icons/fa";

import Navbar from "../User/Navbar";
import { useFetchClientJobPosts, useFetchJobPostByTitle } from "../../Hooks/User/Labour/JobPostHooks";

// Define interfaces for the data structures
interface JobPost {
  jobId: string;
  title: string;
  clientName?: string;
  clientImage?: string;
  muncipalityId: string;
  wage: number;
  prefferedTime?: string;
  // Add other job properties as needed
}

const LabourHomePage = () => {
  const { data: jobPosts, isLoading, error } = useFetchClientJobPosts<JobPost[]>();
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [jobTitleInput, setJobTitleInput] = useState<string>("");
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { data: searchedJobs } = useFetchJobPostByTitle<JobPost[]>(searchTitle);

  const handleAddJobTitle = useCallback((value: string) => {
    if (!value.trim()) return;
    setSelectedJobTitles((prev) => [...new Set([...prev, value])].slice(-3));
    setJobTitleInput("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleJobTitleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitleInput(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && jobTitleInput.trim()) {
      handleAddJobTitle(jobTitleInput);
    }
  }, [jobTitleInput, handleAddJobTitle]);

  const toggleMobileFilter = useCallback(() => {
    setShowMobileFilter(prev => !prev);
  }, []);

  // Filter JSX
  const renderFilterContent = () => (
    <div className="bg-gray-50 rounded-lg shadow p-3 mt-12">
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
        
        {/* Available Work */}
        <div className="mt-5">
          <h3 className="font-semibold text-xs text-gray-700 mb-2">Available Work</h3>
          <div className="text-xs text-gray-600">
            <p className="mb-2">
              Find daily and weekly jobs that match your skills. Connect directly with clients looking for reliable workers.
            </p>
          </div>
        </div>
        
        {/* Popular Jobs */}
        <div className="mt-4">
          <h3 className="font-semibold text-xs text-gray-700 mb-1">In-Demand Skills</h3>
          <div className="flex flex-wrap gap-1">
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Construction</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Cleaning</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Moving</span>
            <span className="bg-purple-50 px-2 py-1 rounded text-xs">Painting</span>
          </div>
        </div>
        
        {/* Quick Tips */}
        <div className="mt-4">
          <h3 className="font-semibold text-xs text-gray-700 mb-1">Quick Tips</h3>
          <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
            <li>Complete your profile to get more job matches</li>
            <li>Add skills to help clients find you</li>
            <li>Check in daily for new opportunities</li>
          </ul>
        </div>
        
        {/* Payment Info */}
        <div className="mt-4 bg-purple-50 p-2 rounded-md">
          <h3 className="font-semibold text-xs text-purple-700">Payment Info</h3>
          <p className="text-xs text-gray-600 mt-1">
            Most jobs pay between $15-25/hr. Get paid securely through our app after job completion.
          </p>
        </div>
        
        {/* How It Works */}
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

  if (isLoading) return <p className="text-center text-purple-600">Loading jobs...</p>;
  if (error) return <p className="text-center text-red-500">Error loading jobs</p>;

  const jobsToDisplay = searchTitle ? searchedJobs : jobPosts;
  const filteredJobs = jobsToDisplay?.filter((job) => 
    selectedJobTitles.length === 0 || selectedJobTitles.includes(job.title)
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
    
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <Navbar searchTitle={searchTitle} setSearchTitle={setSearchTitle} />
      </div>

      <div className="flex w-full mt-8 justify-center">
    
        <div className="hidden md:block md:w-1/5 bg-white shadow-md h-screen fixed left-0 top-[50px]">
          <div className="p-3 h-full overflow-y-auto">
            {renderFilterContent()}
          </div>
        </div>

        <div className="md:hidden fixed bottom-4 right-4 z-20">
          <button 
            onClick={toggleMobileFilter}
            className="bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition flex items-center justify-center"
          >
            <FaFilter className="text-sm" />
          </button>
        </div>

        {showMobileFilter && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 flex items-end">
            <div className="bg-white rounded-t-xl w-full p-4 animate-slide-up">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-sm">Filters</h2>
                <button onClick={toggleMobileFilter} className="text-gray-500 text-lg">×</button>
              </div>
              {renderFilterContent()}
              <button 
                onClick={toggleMobileFilter}
                className="w-full mt-3 bg-purple-600 text-white py-1 rounded-lg text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        <div className="w-full md:ml-1/5 md:w-4/5 md:pl-[20%] mt-12 p-4 md:p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6 mt-3 text-center">Available Jobs</h1> 
          
          {filteredJobs?.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center shadow-md max-w-xl mx-auto">
              <p className="text-gray-600">No jobs found matching your criteria.</p>
              {selectedJobTitles.length > 0 && (
                <button 
                  onClick={() => setSelectedJobTitles([])}
                  className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {filteredJobs?.map((job) => (
                <div 
                  key={job.jobId} 
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 w-full transform hover:-translate-y-2 hover:rotate-1 group perspective-1000"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    const card = e.currentTarget;
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
                  }}
                >
                  <div className="bg-purple-600 text-white p-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <FaBriefcase className="text-sm" />
                      <h2 className="font-bold text-sm line-clamp-1">{job.title}</h2>
                    </div>
                  </div>
                  
                  <div className="p-3 relative z-10">
                    
                    <div className="flex items-center mb-2 bg-gray-50 p-2 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border border-purple-200">
                        {job.clientImage ? (
                          <img 
                            src={job.clientImage} 
                            alt={`${job.clientName || 'Client'}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-purple-600 font-bold text-xs">
                            {(job.clientName || 'C').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="ml-2">
                        <h3 className="font-medium text-gray-800 text-xs">{job.clientName || 'Client'}</h3>
                        <p className="text-xs text-gray-500">Job Provider</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <span className="line-clamp-1">{job.muncipalityId}</span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2">
                      <FaCalendarAlt className="text-green-500" />
                      <span>Created Time</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      <div className="bg-purple-50 py-1 px-2 rounded-full border border-purple-100">
                        <p className="text-purple-800 font-semibold text-xs">₹ {job.wage}/day</p>
                      </div>
                      <div className="bg-gray-50 py-1 px-2 rounded-full border border-gray-100">
                        <p className="text-gray-700 text-xs">Time: {job.prefferedTime || "Flexible"}</p>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-3">
                      <button
                        className="flex-1 px-2 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center text-xs font-medium transform group-hover:scale-105 duration-300 origin-center"
                        onClick={() => navigate(`/job-details/${job.jobId}`)}
                      >
                        View Details
                      </button>
                      <button 
                        className="flex-1 px-2 py-1 bg-gray-100 text-purple-600 rounded-lg hover:bg-gray-200 transition-colors text-center border border-purple-200 text-xs font-medium transform group-hover:scale-105 duration-300 origin-center"
                      >
                        Interested
                      </button>
                    </div>
                  </div>
                  
                  {/* Add glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/0 to-blue-500/0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabourHomePage;