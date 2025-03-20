import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export enum PreferredTimeType {
  DAY = 'Day',
  NIGHT = 'Night',
  BOTH = 'Both'
}

export interface JobPost {
  Title: string;
  Description: string;
  Wage: number;
  StartDate: string;
  EndDate: string;
  PrefferedTime: PreferredTimeType;
  MuncipalityName: string;
  Skill1Name: string;
  Skill2Name: string;
  image: File | undefined;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

const JobForm: React.FC = () => {
  const [formData, setFormData] = useState<JobPost>({
    Title: '',
    Description: '',
    Wage: 0,
    StartDate: '',
    EndDate: '',
    PrefferedTime: PreferredTimeType.BOTH,
    MuncipalityName: '',
    Skill1Name: '',
    Skill2Name: '',
    image: undefined
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // React Query mutation
  const createJobPost = async (formDataToSend: FormData): Promise<ApiResponse> => {
    const response = await axios.post<ApiResponse>('https://localhost:7299/api/Job/createjobpost', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    
    return response.data;
  };

  // Fixed mutation implementation for React Query v4/v5
  const mutation = useMutation({
    mutationFn: createJobPost,
    onSuccess: (data) => {
      setSuccess(true);
      // Reset form after successful submission
      setFormData({
        Title: '',
        Description: '',
        Wage: 0,
        StartDate: '',
        EndDate: '',
        PrefferedTime: PreferredTimeType.BOTH,
        MuncipalityName: '',
        Skill1Name: '',
        Skill2Name: '',
        image: undefined
      });
      setImagePreview(null);
    },
    onError: (error) => {
      console.error('Error posting job:', error);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Wage' ? parseFloat(value) : value
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreferredTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      PrefferedTime: e.target.value as PreferredTimeType
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    // Create FormData object to handle file upload
    const formDataToSend = new FormData();
    
    // Append all job post fields to FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value) {
        formDataToSend.append(key, value);
      } else if (key !== 'image') {
        formDataToSend.append(key, String(value));
      }
    });

    // Use react-query mutation to send the request
    mutation.mutate(formDataToSend);
  };

  return (
    <div className="max-w-5xl mx-auto p-3 bg-purple-50 rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row">
        {/* Form Section */}
        <div className="w-full lg:w-2/3 px-3">
          <h2 className="text-2xl font-bold mb-4 text-purple-700">Post a New Job</h2>
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              Job posted successfully!
            </div>
          )}
          
          {mutation.isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 flex items-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
              </svg>
              Failed to post job. Please try again.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
            <div>
              <label htmlFor="Title" className="block text-sm font-medium mb-1 text-gray-700">Job Title</label>
              <input
                type="text"
                id="Title"
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                required
                placeholder="e.g. Senior Web Developer"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label htmlFor="Description" className="block text-sm font-medium mb-1 text-gray-700">Job Description</label>
              <textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the job responsibilities and requirements"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="Wage" className="block text-sm font-medium mb-1 text-gray-700">Hourly Wage</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="Wage"
                  name="Wage"
                  value={formData.Wage}
                  onChange={handleChange}
                  required
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  className="w-full pl-6 pr-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="StartDate" className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
                <input
                  type="date"
                  id="StartDate"
                  name="StartDate"
                  value={formData.StartDate}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="EndDate" className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
                <input
                  type="date"
                  id="EndDate"
                  name="EndDate"
                  value={formData.EndDate}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="PrefferedTime" className="block text-sm font-medium mb-1 text-gray-700">Preferred Time</label>
              <select
                id="PrefferedTime"
                name="PrefferedTime"
                value={formData.PrefferedTime}
                onChange={handlePreferredTimeChange}
                required
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {Object.values(PreferredTimeType).map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="MuncipalityName" className="block text-sm font-medium mb-1 text-gray-700">Municipality</label>
              <input
                type="text"
                id="MuncipalityName"
                name="MuncipalityName"
                value={formData.MuncipalityName}
                onChange={handleChange}
                required
                placeholder="e.g. New York"
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label htmlFor="Skill1Name" className="block text-sm font-medium mb-1 text-gray-700">Primary Skill</label>
                <input
                  type="text"
                  id="Skill1Name"
                  name="Skill1Name"
                  value={formData.Skill1Name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. JavaScript"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="Skill2Name" className="block text-sm font-medium mb-1 text-gray-700">Secondary Skill</label>
                <input
                  type="text"
                  id="Skill2Name"
                  name="Skill2Name"
                  value={formData.Skill2Name}
                  onChange={handleChange}
                  placeholder="e.g. React"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium mb-1 text-gray-700">Upload Image</label>
              <div className="flex flex-col md:flex-row md:space-x-3">
                <div className="flex items-center justify-center w-full mb-2 md:mb-0 md:w-1/2">
                  <label className="flex flex-col w-full h-16 border-2 border-purple-300 border-dashed hover:bg-purple-50 hover:border-purple-500 rounded-lg cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-2">
                      <svg className="w-5 h-5 text-purple-400 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="pt-1 text-xs tracking-wider text-purple-400 group-hover:text-purple-600">
                        {formData.image ? formData.image.name : 'Attach job image'}
                      </p>
                    </div>
                    <input 
                      type="file" 
                      id="image" 
                      name="image" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                </div>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="md:w-1/2">
                    <div className="h-16 md:h-full w-full rounded-lg border border-gray-300 overflow-hidden relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-3">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
              >
                {mutation.isPending ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </span>
                ) : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Information Section */}
        <div className="w-full lg:w-1/3 mt-6 lg:mt-0 px-3">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-3 text-purple-700">Why Post a Job With Us?</h3>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">Reach qualified candidates quickly</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">Easy-to-use platform with responsive design</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">Targeted matching based on skills</p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-purple-600">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-2 text-sm text-gray-700">Flexible scheduling options</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <h4 className="font-semibold text-purple-800 mb-1 text-sm">Tips for a Great Job Post</h4>
              <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                <li>Be specific about required skills</li>
                <li>Include details about work environment</li>
                <li>Clearly state compensation</li>
                <li>Add a high-quality image</li>
                <li>Specify suitable work hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;