import React, { useState } from "react";
import { IoSearch, IoCheckmarkCircle, IoMailOutline, IoEyeOutline, IoNotifications } from "react-icons/io5";
import { MdOutlineMessage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import NavbarTwo from "../../../Components/User/UserNavbar/Navbar2";
// Define the enum for interest request status
enum InterestRequestStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Rejected = "Rejected"
}

// Define the interface for the interest request data
interface InterestRequest {
  id: string;
  jobPostId: string;
  labourUserId: string;
  labourName: string;
  employerUserId: string;
  employerImageUrl:string;
  employerName: string;
  status: InterestRequestStatus;
  withDrawRequest: boolean;
  isDelete: boolean;
  createdOn: string;
  updatedOn: string;
}

// Configure axios defaults
axios.defaults.withCredentials = true;



const LabourNotifications: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const navigate = useNavigate();

  // Fetch accepted interest requests
  const { 
    data: acceptedRequests, 
    isLoading, 
    error,
    refetch 
  }: QueryObserverResult<InterestRequest[], Error> = useQuery({
    queryKey: ['acceptedInterestRequests'],
    queryFn: async (): Promise<InterestRequest[]> => {
      try {
        const response: AxiosResponse<InterestRequest[]> = await axios.get(
          'https://localhost:7024/api/InterestRequest/get/accepted-interest-request',
          { withCredentials: true }
        );
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        throw new Error(error.message);
      }
    }
  });

  // Handle dismiss notification
  const handleDismiss = (id: string): void => {
    // In a real app, you might want to call an API to mark the notification as read or dismissed
    console.log(`Notification ${id} dismissed`);
    
    // Then refetch the data
    refetch();
  };

  // Filter notifications based on search (by employer name)
  const filteredNotifications: InterestRequest[] = acceptedRequests?.filter((request: InterestRequest) =>
    request.employerName.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate the time elapsed since the request was accepted
  const getTimeElapsed = (dateString: string): string => {
    const acceptedDate = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - acceptedDate.getTime();
    
    const seconds = Math.floor(diffInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <>
      <NavbarTwo />
      <div className="bg-gray-50 min-h-screen pb-12 mt-20">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="pt-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Accepted Job Requests</h1>
                <p className="text-gray-600 mt-1">View employers who have accepted your interest requests</p>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <IoSearch className="text-gray-500" size={18} />
                  </span>
                  <input
                    type="text"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by employer..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg m-4">
                  <p className="font-medium">Error loading notifications</p>
                  <p className="text-sm mt-1">Please try refreshing the page</p>
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((request) => (
                    <div
                      key={request.id}
                      className="p-6 transition-all hover:bg-gray-50 relative"
                    >
                      <button
                        type="button"
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors rounded-full p-1 hover:bg-gray-100"
                        onClick={() => handleDismiss(request.id)}
                        aria-label="Dismiss notification"
                      >
                        <AiOutlineClose size={18} />
                      </button>
                      
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Left Section: Image and Employer Info */}
                        <div className="flex items-start flex-grow">
                          <div className="relative">
                            <img
                              src={request.employerImageUrl}
                              alt={`${request.employerName}'s profile`}
                              className="rounded-full object-cover border border-gray-200 w-16 h-16"
                            />
                            <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white"></div>
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-lg text-gray-800">{request.employerName}</h3>
                            <div className="flex items-center mt-1">
                              <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                                Request Accepted
                              </span>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-xs text-gray-500">{getTimeElapsed(request.updatedOn)}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">
                              Your job interest request has been accepted! You can now start a conversation with the employer.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions Section */}
                      <div className="mt-4 ml-20 flex flex-wrap gap-3">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm border border-purple-200"
                          onClick={() => navigate(`/messages/${request.employerUserId}`)}
                        >
                          <IoMailOutline size={18} />
                          Message Employer
                        </button>
                        
                        <button
                          type="button"
                          className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm border border-gray-200"
                          onClick={() => navigate(`/job-details/${request.jobPostId}`)}
                        >
                          <IoEyeOutline size={18} />
                          View Job Details
                        </button>
                      </div>
                      
                      {/* Additional Info */}
                      <div className="mt-4 ml-20 text-xs text-gray-500">
                        <p>Accepted on: {formatDate(request.updatedOn)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <IoCheckmarkCircle size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">No accepted job requests</h3>
                  <p className="mt-1 text-gray-500 max-w-md">
                    {search ? 
                      `No results matching "${search}"` : 
                      "When employers accept your interest in their job postings, they'll appear here"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabourNotifications;