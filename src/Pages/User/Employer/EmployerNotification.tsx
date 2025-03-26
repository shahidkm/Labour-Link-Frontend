import React, { useState } from "react";
import { IoSearch, IoNotifications, IoCheckmarkCircle, IoCloseCircle, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient, QueryObserverResult } from "@tanstack/react-query";

// Define the enum for interest request status
enum InterestRequestStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Rejected = "Rejected"
}

import UserNavbar from "../../../Components/User/UserNavbar/EmployerNavbar";


// Define the interfaces for the data
interface InterestRequest {
  id: string;
  jobPostId: string;
  labourUserId: string;
  labourName: string;
  labourImageUrl:string;
  employerUserId: string;
  employerImageUrl: string;
  employerName: string;
  status: InterestRequestStatus;
  withDrawRequest: boolean;
  isDelete: boolean;
  createdOn: string;
  updatedOn: string;
}

interface AcceptRequestPayload {
  jobPostId: string;
  interestRequestId: string;
  employerUserId: string;
  employerImageUrl: string;
  employerName: string;
  labourUserId: string;
  labourName: string;

}

interface RejectRequestPayload {
  id: string;
}

// Configure axios defaults
axios.defaults.withCredentials = true;

const EmployerNotifications: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch interest requests
  const { 
    data: interestRequests, 
    isLoading, 
    error 
  }: QueryObserverResult<InterestRequest[], Error> = useQuery({
    queryKey: ['interestRequests'],
    queryFn: async (): Promise<InterestRequest[]> => {
      try {
        const response: AxiosResponse<InterestRequest[]> = await axios.get(
          'https://localhost:7024/api/InterestRequest/from-Labours',
          { withCredentials: true }
        );
        console.log(111111111111111111111,response);
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        throw new Error(error.message);
      }
    }
  });

  // Accept interest request mutation
  const acceptMutation = useMutation<AxiosResponse, Error, AcceptRequestPayload>({
    mutationFn: async (payload: AcceptRequestPayload): Promise<AxiosResponse> => {
      // Create FormData object
      const formData = new FormData();
      
      // Append all payload fields to FormData
      formData.append('JobPostId', payload.jobPostId);
      formData.append('InterestRequestId', payload.interestRequestId);
      formData.append('EmployerName', payload.employerName);
      formData.append('LabourUserId', payload.labourUserId);
      formData.append('LabourName', payload.labourName);
  
      
      // If employerImageUrl is not empty, append it
      if (payload.employerImageUrl) {
        formData.append('EmployerImageUrl', payload.employerImageUrl);
      }

      return axios.post(
        'https://localhost:7024/api/InterestRequest/accept-request', 
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interestRequests'] });
    },
    onError: (error: Error) => {
      console.error("Error accepting request:", error.message);
    }
  });

  // Reject interest request mutation
  const rejectMutation = useMutation<AxiosResponse, Error, string>({
    mutationFn: async (requestId: string): Promise<AxiosResponse> => {
      const payload: RejectRequestPayload = { id: requestId };
      return axios.post(
        'https://localhost:7024/api/InterestRequest/reject-request', 
        payload,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interestRequests'] });
    },
    onError: (error: Error) => {
      console.error("Error rejecting request:", error.message);
    }
  });

  // Handle accept request
  const handleAccept = (request: InterestRequest): void => {
    const payload: AcceptRequestPayload = {
      jobPostId: request.jobPostId,
      interestRequestId: request.id,
      employerUserId: request.employerUserId,
      employerName: request.employerName,
      labourUserId: request.labourUserId,
      labourName: request.labourName,
      employerImageUrl: request.employerImageUrl
    };
    
    acceptMutation.mutate(payload);
  };

  // Handle reject request
  const handleReject = (requestId: string): void => {
    rejectMutation.mutate(requestId);
  };

  // Filter notifications based on search and status
  const filteredRequests: InterestRequest[] = interestRequests?.filter((request: InterestRequest) => {
    const matchesSearch = request.labourName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Get counts for each status
  const pendingCount = interestRequests?.filter(req => req.status === InterestRequestStatus.Pending).length || 0;
  const acceptedCount = interestRequests?.filter(req => req.status === InterestRequestStatus.Accepted).length || 0;
  const rejectedCount = interestRequests?.filter(req => req.status === InterestRequestStatus.Rejected).length || 0;

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Calculate the time elapsed since the request was made
  const getTimeElapsed = (dateString: string): string => {
    const requestDate = new Date(dateString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - requestDate.getTime();
    
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
      <UserNavbar />
      <div className="bg-gray-50 min-h-screen pb-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="pt-8 pb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Interest Requests</h1>
                <p className="text-gray-600 mt-1">Manage worker interest in your job postings</p>
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
                    placeholder="Search by name..."
                  />
                </div>
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              <button
                className={`py-2 px-4 rounded-full flex items-center ${
                  statusFilter === "all" 
                    ? "bg-purple-100 text-purple-700 font-medium border-2 border-purple-300" 
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setStatusFilter("all")}
              >
                <IoNotifications className="mr-2" />
                All Requests
                <span className="ml-2 bg-gray-200 text-gray-800 rounded-full px-2 py-0.5 text-xs">
                  {interestRequests?.length || 0}
                </span>
              </button>
              <button
                className={`py-2 px-4 rounded-full flex items-center ${
                  statusFilter === InterestRequestStatus.Pending 
                    ? "bg-yellow-100 text-yellow-700 font-medium border-2 border-yellow-300" 
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setStatusFilter(InterestRequestStatus.Pending)}
              >
                <span className="mr-2">⌛</span>
                Pending
                <span className="ml-2 bg-yellow-200 text-yellow-800 rounded-full px-2 py-0.5 text-xs">
                  {pendingCount}
                </span>
              </button>
              <button
                className={`py-2 px-4 rounded-full flex items-center ${
                  statusFilter === InterestRequestStatus.Accepted 
                    ? "bg-green-100 text-green-700 font-medium border-2 border-green-300" 
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setStatusFilter(InterestRequestStatus.Accepted)}
              >
                <IoCheckmarkCircle className="mr-2" />
                Accepted
                <span className="ml-2 bg-green-200 text-green-800 rounded-full px-2 py-0.5 text-xs">
                  {acceptedCount}
                </span>
              </button>
              <button
                className={`py-2 px-4 rounded-full flex items-center ${
                  statusFilter === InterestRequestStatus.Rejected 
                    ? "bg-red-100 text-red-700 font-medium border-2 border-red-300" 
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setStatusFilter(InterestRequestStatus.Rejected)}
              >
                <IoCloseCircle className="mr-2" />
                Rejected
                <span className="ml-2 bg-red-200 text-red-800 rounded-full px-2 py-0.5 text-xs">
                  {rejectedCount}
                </span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-8 bg-red-50 rounded-lg m-4">
                <p className="font-medium">Error loading interest requests</p>
                <p className="text-sm mt-1">Please try refreshing the page</p>
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredRequests.map((request: InterestRequest) => (
                  <div
                    key={request.id}
                    className="p-6 transition-all hover:bg-gray-50"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Left Section: Image and Name */}
                      <div className="flex items-center flex-grow">
                        <div className="relative">
                          <img
                            src={request.labourImageUrl}
                            alt={`${request.labourName}'s profile`}
                            className="rounded-full object-cover border border-gray-200 w-16 h-16"
                          />
                          <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                            request.status === InterestRequestStatus.Pending ? 'bg-yellow-400' : 
                            request.status === InterestRequestStatus.Accepted ? 'bg-green-400' : 'bg-red-400'
                          }`}></div>
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-lg text-gray-800">{request.labourName}</h3>
                          <div className="flex items-center mt-1">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              request.status === InterestRequestStatus.Pending ? 'bg-yellow-100 text-yellow-800' : 
                              request.status === InterestRequestStatus.Accepted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {request.status}
                            </span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-500">{getTimeElapsed(request.createdOn)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section: Actions */}
                      <div className="flex flex-wrap gap-2 md:gap-3 mt-4 md:mt-0">
                        {request.status === InterestRequestStatus.Pending && (
                          <>
                            <button
                              type="button"
                              className="flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm border border-green-200"
                              onClick={() => handleAccept(request)}
                              disabled={acceptMutation.isPending}
                            >
                              <IoCheckmarkCircle size={18} />
                              {acceptMutation.isPending ? 'Processing...' : 'Accept'}
                            </button>
                            
                            <button
                              type="button"
                              className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm border border-red-200"
                              onClick={() => handleReject(request.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <IoCloseCircle size={18} />
                              {rejectMutation.isPending ? 'Processing...' : 'Reject'}
                            </button>
                          </>
                        )}
                        
                        <button
                          type="button"
                          className="flex items-center justify-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm border border-purple-200"
                          onClick={() => navigate(`/job-details/${request.jobPostId}`)}
                        >
                          <IoEyeOutline size={18} />
                          View Details
                        </button>
                      </div>
                    </div>
                    
                    {/* Additional Request Information */}
                    <div className="mt-4 pl-20 text-sm text-gray-500">
                      <p>Request Date: {formatDate(request.createdOn)}</p>
                      {request.status !== InterestRequestStatus.Pending && (
                        <p>Response Date: {formatDate(request.updatedOn)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <IoNotifications size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">No interest requests found</h3>
                <p className="mt-1 text-gray-500 max-w-md">
                  {search ? 
                    `No results matching "${search}"` : 
                    "When workers express interest in your job postings, they'll appear here"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployerNotifications;