import React from "react";
import { useParams } from "react-router-dom";
import { useFetchJobPostById } from "../../Hooks/User/Labour/JobPostHooks";
import { FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaClock, FaTasks, FaInfoCircle, FaUser } from "react-icons/fa";
import NavbarTwo from "../User/UserNavbar/Navbar2";

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { data: jobPost, isLoading, error } = useFetchJobPostById(jobId!);

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 border-4 border-t-purple-500 border-purple-200 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-purple-600 font-medium">Loading job details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center text-red-500">
        <FaInfoCircle className="text-4xl mx-auto mb-4" />
        <p className="font-semibold">Error loading job details</p>
      </div>
    </div>
  );

  return (
    <div className="w-screen min-h-screen bg-gray-100">
      <NavbarTwo />
      {/* Increased top margin with mt-10 and wider container with 95% width on larger screens */}
      <div className="w-11/12 md:w-[95%] mx-auto mt-20 py-8">
        {/* Floating Card Layout */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header with Color Bar */}
          <div className="h-3 bg-purple-500"></div>
          
          <div className="p-4 sm:p-6 md:p-8">
            {/* Job Title & Location - More responsive text size */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800">{jobPost?.title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-purple-500" />
                <span className="text-sm sm:text-base">{jobPost?.muncipalityName || "Location"}</span>
              </div>
            </div>
            
            {/* Content Grid - Improved responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {/* Left Column - Details */}
              <div className="md:col-span-2">
                {/* Info Cards Row - Now better on small screens */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-purple-50 p-4 rounded shadow-sm">
                    <div className="flex items-center mb-1 text-purple-600">
                      <FaMoneyBillWave className="mr-2" />
                      <span className="text-sm">Wage</span>
                    </div>
                    <p className="text-lg sm:text-xl font-medium">₹ {jobPost?.wage}/day</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded shadow-sm">
                    <div className="flex items-center mb-1 text-purple-600">
                      <FaClock className="mr-2" />
                      <span className="text-sm">Timing</span>
                    </div>
                    <p className="text-lg sm:text-xl font-medium truncate">{jobPost?.prefferedTime || "Flexible"}</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded shadow-sm">
                    <div className="flex items-center mb-1 text-purple-600">
                      <FaCalendarAlt className="mr-2" />
                      <span className="text-sm">Date</span>
                    </div>
                    <p className="text-sm font-medium">{new Date(jobPost?.startDate).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Description - More spacing */}
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2">1</span>
                    Job Description
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-5 rounded shadow-sm">
                    <p className="text-gray-700 text-sm sm:text-base">{jobPost?.description}</p>
                  </div>
                </div>
                
                {/* Status - More spacing */}
                <div className="mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2">2</span>
                    Job Status
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-5 rounded shadow-sm">
                    <div className="flex items-center">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        jobPost?.status === "Open" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {jobPost?.status}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills - More spacing */}
                <div>
                  <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center mr-2">3</span>
                    Skills Required
                  </h2>
                  <div className="bg-gray-50 p-4 md:p-5 rounded shadow-sm">
                    <div className="space-y-2 md:space-y-3">
                      {jobPost?.skillId1 && (
                        <div className="flex items-center">
                          <FaTasks className="text-purple-500 mr-2" />
                          <span className="text-sm sm:text-base">{jobPost.skillId1}</span>
                        </div>
                      )}
                      {jobPost?.skillId2 && (
                        <div className="flex items-center">
                          <FaTasks className="text-purple-500 mr-2" />
                          <span className="text-sm sm:text-base">{jobPost.skillId2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Image and Apply */}
              <div>
                {/* User Profile Section */}
                <div className="bg-purple-50 p-4 rounded-lg shadow-sm mb-6">
                  <h3 className="font-medium text-purple-700 mb-3 text-base md:text-lg">Posted by</h3>
                  <div className="flex items-center">
                    {jobPost?.userImage ? (
                      <img 
                        src={jobPost.userImage} 
                        alt="User Profile" 
                        className="w-12 h-12 rounded-full object-cover border-2 border-purple-300"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
                        <FaUser className="text-purple-500 text-lg" />
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="font-medium text-gray-800">{jobPost?.userName || "User"}</p>
                      <p className="text-xs text-gray-500">Job Provider</p>
                    </div>
                  </div>
                </div>
                
                {/* Image - Larger and centered better on mobile */}
                {jobPost?.image && (
                  <div className="bg-white rounded shadow-sm p-2 mb-6 mx-auto max-w-sm md:max-w-full">
                    <img
                      src={jobPost.image}
                      alt={jobPost.title}
                      className="w-full h-56 sm:h-64 md:h-72 object-cover rounded"
                    />
                  </div>
                )}
                
                {/* Apply Button - Larger and more prominent */}
                <button className="w-full py-3 md:py-4 bg-purple-500 hover:bg-purple-600 text-white font-medium text-base md:text-lg rounded shadow-md hover:shadow-lg transition duration-200 mb-6 md:mb-8">
                  Apply Now
                </button>
                
                {/* Job Posted Info - Better spacing and mobile friendly */}
                <div className="bg-gray-50 p-4 md:p-5 rounded shadow-sm">
                  <h3 className="font-medium text-gray-800 mb-2 md:mb-3 text-base md:text-lg">Job Information</h3>
                  <p className="text-sm md:text-base text-gray-600">
                    <span className="block mb-1 md:mb-2">
                      <strong>Posted on:</strong> {new Date(jobPost?.startDate).toLocaleDateString()}
                    </span>
                    {/* <span className="block mb-1 md:mb-2">
                      <strong>Job ID:</strong> {jobId}
                    </span> */}
                    <span className="block">
                      <strong>Status:</strong> {jobPost?.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;