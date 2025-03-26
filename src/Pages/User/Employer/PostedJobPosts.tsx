import React, { useState, useEffect, ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import { Search, Calendar, Clock, DollarSign, Filter, Edit, Users, X, User } from 'lucide-react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../../Components/User/UserNavbar/EmployerNavbar';
// Define the JobPost interface
interface JobPost {
  jobId: string;
  title: string;
  description: string;
  wage: number;
  startDate: string;
  endDate: string;
  prefferedTime: string;
  muncipalityId: string;
  status: string;
  skillId1: string;
  skillId2: string;
  image: string;
  createdDate: string;
}

// API response interface
interface ApiResponse {
  statusCode: number;
  message: string;
  data: JobPost[];
}

// Skeleton component props
interface SkeletonProps {
  className: string;
}

// Badge component props
interface BadgeProps {
  children: React.ReactNode;
  variant: 'success' | 'error' | 'info' | 'default';
}

// Button component props
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

// Chip component props
interface ChipProps {
  label: string;
  onClick: () => void;
  active: boolean;
}

// Job List Item component props
interface JobListItemProps {
  job: JobPost;
}

// Edit Job Modal props
interface EditJobModalProps {
  job: JobPost;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Job Update Data interface
interface JobUpdateData {
  title: string;
  description: string;
  wage: number;
  startDate: string;
  endDate: string;
  prefferedTime: string;
  muncipalityId: string;
  skillId1: string;
  skillId2: string;
}


// Fetch jobs function
const fetchJobs = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>("https://localhost:7299/api/Job/jobpostbyclient", { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching job posts:", error);
    throw error;
  }
};

// Custom hook for jobs
const useJobs = () => {
  return useQuery<ApiResponse, Error>({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    staleTime: 1000 * 60 * 5,
  });
};

// Skeleton component
const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>;
};

// Badge component
const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  const getColorClass = (): string => {
    switch (variant) {
      case 'success':
        return 'bg-purple-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-indigo-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (

    
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getColorClass()}`}>
      {children}
    </span>
  );
};

// Button component
const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = "primary", 
  className = "",
  type = "button",
  disabled = false
}) => {
  const getButtonClass = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'secondary':
        return 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200';
      case 'outline':
        return 'bg-white hover:bg-purple-50 text-purple-700 border border-purple-200';
      default:
        return 'bg-purple-600 hover:bg-purple-700 text-white';
    }
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`px-4 py-2 rounded-md transition-colors ${getButtonClass()} ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

// Chip component
const Chip: React.FC<ChipProps> = ({ label, onClick, active }) => {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
        active ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
};

// Edit Job Modal component
const EditJobModal: React.FC<EditJobModalProps> = ({ job, isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<JobUpdateData>({
    title: '',
    description: '',
    wage: 0,
    startDate: '',
    endDate: '',
    prefferedTime: '',
    muncipalityId: '',
    skillId1: '',
    skillId2: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      // Format dates to YYYY-MM-DD for input fields
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        title: job.title,
        description: job.description,
        wage: job.wage,
        startDate: formatDate(job.startDate),
        endDate: formatDate(job.endDate),
        prefferedTime: job.prefferedTime,
        muncipalityId: job.muncipalityId,
        skillId1: job.skillId1,
        skillId2: job.skillId2
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'wage' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.patch(
        `https://localhost:7299/api/Job/updatejobpost?jobId=${job.jobId}`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error updating job:', err);
      setError('Failed to update job post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-purple-100">
          <h2 className="text-xl font-bold text-purple-900">Edit Job Post</h2>
          <button 
            onClick={onClose}
            className="text-purple-500 hover:text-purple-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="wage" className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Wage ($)
            </label>
            <input
              type="number"
              id="wage"
              name="wage"
              value={formData.wage}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="prefferedTime" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Time
            </label>
            <select
              id="prefferedTime"
              name="prefferedTime"
              value={formData.prefferedTime}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select time preference</option>
              <option value="Day">Day</option>
              <option value="Night">Night</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div>
            <label htmlFor="muncipalityId" className="block text-sm font-medium text-gray-700 mb-1">
              Municipality
            </label>
            <input
              type="text"
              id="muncipalityId"
              name="muncipalityId"
              value={formData.muncipalityId}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="skillId1" className="block text-sm font-medium text-gray-700 mb-1">
                Primary Skill
              </label>
              <input
                type="text"
                id="skillId1"
                name="skillId1"
                value={formData.skillId1}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="skillId2" className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Skill
              </label>
              <input
                type="text"
                id="skillId2"
                name="skillId2"
                value={formData.skillId2}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-purple-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors disabled:opacity-70"
            >
              {isSubmitting ? 'Updating...' : 'Update Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Job List Item component (replaces JobCard)
const JobListItem: React.FC<JobListItemProps> = ({ job }) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.src = "https://tse2.mm.bing.net/th?id=OIP.6L7shpwxVAIr279rA0B1JQHaE7&pid=Api&P=0&h=180";
  };

  return (
    <>
    
    <UserNavbar/>
      <div className="flex flex-col md:flex-row bg-white rounded-xl overflow-hidden shadow border border-purple-100 mb-6 hover:shadow-md transition-all duration-300">
      <div className="md:w-1/3 relative">
        <img
          src={job.image}
          alt={job.title}
          className="w-full h-full object-contain md:object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-3 right-3">
          <Badge variant={job.status === "Active" ? "success" : "error"}>
            {job.status}
          </Badge>
        </div>
      </div>
      
      <div className="p-5 md:w-2/3 flex flex-col">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-purple-900 mb-2">{job.title}</h3>
          <p className="text-gray-600 mb-4">{job.description}</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-gray-700">
              <DollarSign size={18} className="mr-2 text-purple-600" />
              <span className="font-semibold">${job.wage}/Day</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock size={18} className="mr-2 text-purple-600" />
              <span>{job.prefferedTime}</span>
            </div>
            
            <div className="flex items-center text-gray-700 col-span-2">
              <Calendar size={18} className="mr-2 text-purple-600" />
              <span>{formatDate(job.startDate)} - {formatDate(job.endDate)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 pt-4 border-t border-purple-100">
          <Button 
            variant="secondary" 
            className="flex items-center justify-center"
            onClick={() => document.dispatchEvent(new CustomEvent('openEditModal', { detail: job }))}
          >
            <Edit size={16} className="mr-1" /> Edit
          </Button>
          <Button variant="outline" className="flex items-center justify-center">
            <Users size={16} className="mr-1" /> Applicants
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

// Main component
const PostedJobPosts: React.FC = () => {
  // Move useNavigate hook to the top level - fixes the Rules of Hooks error
  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useJobs();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  
  // Extract jobs from the API response structure
  const jobs: JobPost[] = data?.data || [];
  
  // Filter jobs based on search term and status
  const filteredJobs: JobPost[] = jobs.filter((job) => {
    const matchesSearch: boolean = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus: boolean = filterStatus === "All" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Handle filter status change
  const setStatusFilter = (status: string): void => {
    setFilterStatus(status);
  };

  // Listen for edit modal events
  useEffect(() => {
    const handleOpenEditModal = (e: Event) => {
      const customEvent = e as CustomEvent<JobPost>;
      setSelectedJob(customEvent.detail);
      setEditModalOpen(true);
    };

    document.addEventListener('openEditModal', handleOpenEditModal);
    
    return () => {
      document.removeEventListener('openEditModal', handleOpenEditModal);
    };
  }, []);

  // Handle successful job update
  const handleJobUpdateSuccess = () => {
    refetch(); // Refresh job data
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-purple-50 min-h-screen">
        <div className="mb-8">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-10 w-full mb-6" />
        </div>
        <div className="space-y-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl overflow-hidden shadow flex flex-col md:flex-row">
              <Skeleton className="h-64 md:h-auto md:w-1/3" />
              <div className="p-4 md:w-2/3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-red-700 mb-2">Error Loading Jobs</h3>
          <p className="text-red-600">{error.message}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-purple-50 min-h-screen">      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-purple-800">Your Job Listings</h2>
            <p className="text-purple-600 mt-1">Manage and monitor your posted job opportunities</p>
          </div>
          <Button className="mt-4 md:mt-0" onClick={() => navigate("/post-job")}>
            + Post New Job
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-purple-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-3 py-2 w-full border border-purple-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Chip 
                label="All Jobs" 
                onClick={() => setStatusFilter("All")} 
                active={filterStatus === "All"} 
              />
              <Chip 
                label="Active" 
                onClick={() => setStatusFilter("Active")} 
                active={filterStatus === "Active"} 
              />
              <Chip 
                label="Inactive" 
                onClick={() => setStatusFilter("Inactive")} 
                active={filterStatus === "Inactive"} 
              />
            </div>
          </div>
        </div>
        
        {filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <JobListItem key={job.jobId} job={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter size={24} className="text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">No Jobs Found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== "All" 
                ? "Try adjusting your search or filters to see more results." 
                : "You haven't posted any jobs yet. Click 'Post New Job' to get started."}
            </p>
          </div>
        )}
      </div>
      
      {/* Edit Job Modal */}
      {selectedJob && (
        <EditJobModal
          job={selectedJob}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSuccess={handleJobUpdateSuccess}
        />
      )}
    </div>
  );
};

export default PostedJobPosts;