import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaFilter } from 'react-icons/fa';

// Component Imports
import Navbar from '../User/Navbar';
import JobCard from './JobCard';
import FilterContent from './FilterContent';
import MobileFilterModal from './MobileFilterCombonent';
import JobCardSkeleton from './JobCardSkelton';

// Hook Imports
import { useJobPosts, useJobSearch } from '../../Hooks/User/Labour/JobHook';
import { useInterestRequest } from '../../Hooks/User/Labour/IntrestRequestHook';

// Type Imports
import { JobPost } from '../../Types/JobTypes';

import * as signalR from "@microsoft/signalr";

const LabourHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
  const [showMobileFilter, setShowMobileFilter] = useState<boolean>(false);

  interface Notification {
    senderUserId: string;
    senderName: string;
    senderImageUrl: string;
    jobPostId: string;
    message: string;
    notificationType: string;
    isRead: boolean;
  }

  useEffect(() => {
    let connection: signalR.HubConnection | null = null;

    const connectSignalR = async () => {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7024/nothub`, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        console.log("Connected to SignalR hub");

        connection.on("ReceiveNotification", (notification: Notification) => {
          console.log("New notification received:", notification);
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={notification.senderImageUrl}
                      alt="Sender"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.senderName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ));
        });
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    connectSignalR();

    return () => {
      if (connection) {
        connection.off("ReceiveNotification");
        connection.stop();
        console.log("SignalR connection stopped");
      }
    };
  }, []);

  // Hooks for job data and interactions
  const { 
    regularJobPosts, 
    preferredJobs, 
    labourDetails 
  } = useJobPosts();
  
  const { 
    data: searchedJobs, 
    isLoading: isSearchLoading 
  } = useJobSearch(searchTitle);
  
  const showInterestMutation = useInterestRequest();

  // Combine and process jobs with safe checks
  const combinedJobs = useMemo(() => {
    const preferred = preferredJobs.data || [];
    let regular = regularJobPosts.data || [];
    
    // Remove duplicates and ensure unique ids
    const preferredIds = new Set(preferred.map(job => job.jobId));
    regular = regular.filter(job => !preferredIds.has(job.jobId));
    
    return [...preferred, ...regular];
  }, [preferredJobs.data, regularJobPosts.data]);

  // Job filtering with safe checks
  const filteredJobs = useMemo(() => {
    const jobsToDisplay = searchTitle ? searchedJobs || [] : combinedJobs;
    return jobsToDisplay.filter((job) => 
      job && job.jobId && 
      (selectedJobTitles.length === 0 || selectedJobTitles.includes(job.title))
    );
  }, [searchTitle, searchedJobs, combinedJobs, selectedJobTitles]);

  // Show Interest Handler
  const handleShowInterest = useCallback((job: JobPost) => {
    if (!labourDetails.data) {
      toast.error('Please complete your profile first');
      return;
    }

    showInterestMutation.mutate({
      jobPostId: job.jobId,
      employerUserId: job.cleintId,
      employerName: job.fullName,
      employerImageUrl: job.profileImageUrl
    });
  }, [labourDetails.data, showInterestMutation]);

  // View Job Details Handler
  const handleViewDetails = useCallback((job: JobPost) => {
    navigate(`/job-details/${job.jobId}`);
  }, [navigate]);

  // Loading State
  if (regularJobPosts.isLoading || preferredJobs.isLoading) {
    return (
      <>
        <Navbar searchTitle={searchTitle} setSearchTitle={setSearchTitle} />
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
          <div className="flex w-full mt-16 justify-center">
            <div className="w-full p-4 md:p-6">
              <div className="
                grid grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-2 
                xl:grid-cols-3 
                gap-6 
                max-w-7xl 
                mx-auto 
                justify-center
              ">
                {[...Array(6)].map((_, index) => (
                  <JobCardSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar searchTitle={searchTitle} setSearchTitle={setSearchTitle} />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <div className="flex w-full mt-16 justify-center">
          {/* Filter Section for Desktop */}
          <div className="
            hidden md:block 
            w-1/4 max-w-xs 
            p-4 sticky top-16 
            h-[calc(100vh-4rem)] 
            overflow-y-auto 
            scrollbar-thin 
            scrollbar-track-gray-100 
            scrollbar-thumb-purple-300
          ">
            <FilterContent 
              selectedJobTitles={selectedJobTitles}
              setSelectedJobTitles={setSelectedJobTitles}
            />
          </div>

          {/* Job Listings */}
          <div className="w-full md:w-3/4 p-4 md:p-6">
            <div className="
              grid grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-2 
              xl:grid-cols-3 
              gap-6 
              max-w-7xl 
              mx-auto 
              justify-center
            ">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <JobCard 
                    key={`job-${job.jobId || index}`} 
                    job={job} 
                    onShowInterest={() => handleShowInterest(job)}
                    onViewDetails={() => handleViewDetails(job)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 p-8">
                  <p className="text-xl mb-4">No jobs available at the moment</p>
                  <p className="text-sm text-gray-400">
                    Please check back later or adjust your filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowMobileFilter(true)}
            className="md:hidden fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg z-20"
          >
            <FaFilter />
          </button>

          {/* Mobile Filter Modal */}
          {showMobileFilter && (
            <MobileFilterModal 
              selectedJobTitles={selectedJobTitles}
              setSelectedJobTitles={setSelectedJobTitles}
              onClose={() => setShowMobileFilter(false)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LabourHomePage;