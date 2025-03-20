import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { JobPost, ApiResponse, createJobPost }  from '../../../Services/User/Employer/CreateJob';

/**
 * Custom Hook Using React Query for job post creation
 * @returns A mutation result object for the job creation operation
 */
export const useCreateJobPost = (): UseMutationResult<ApiResponse, Error, JobPost> => {
  return useMutation<ApiResponse, Error, JobPost>({
    mutationFn: (jobData: JobPost) => createJobPost(jobData),
    onError: (error: Error) => {
      console.error('Mutation error:', error);
    }
  });
};

// Form validation errors interface
export interface FormErrors {
  Title?: string;
  Description?: string;
  Wage?: string;
  StartDate?: string;
  EndDate?:string;
  MuncipalityName?: string;
  Skill1Name?: string;
  Skill2Name?: string;
  image?: string;
  general?: string;
  auth?: string;
}

// Initial form state
export const initialFormState: JobPost = {
  Title: '',
  Description: '',
  Wage: 0,
  StartDate: '',
  EndDate: "",
  PrefferedTime: 'Day',
  MuncipalityName: "",
  Skill1Name: '',
  Skill2Name: '',
  image: null,
 
};

/**
 * Validates job form data
 * @param formData - The job data to validate
 * @returns Object containing validation errors if any
 */
export const validateJobForm = (formData: JobPost): FormErrors => {
  const errors: FormErrors = {};
  
  if (!formData.Title.trim()) {
    errors.Title = 'Title is required';
  } else if (formData.Title.length > 100) {
    errors.Title = 'Title must be less than 100 characters';
  }
  
  if (!formData.Description.trim()) {
    errors.Description = 'Description is required';
  } else if (formData.Description.length < 10) {
    errors.Description = 'Description must be at least 10 characters';
  } else if (formData.Description.length > 1000) {
    errors.Description = 'Description must be less than 1000 characters';
  }
  
  if (formData.Wage <= 0) {
    errors.Wage = 'Wage must be greater than 0';
  } else if (formData.Wage > 10000) {
    errors.Wage = 'Please enter a reasonable wage amount';
  }
  
  if (!formData.StartDate) {
    errors.StartDate = 'Start date is required';
  } else {
    const selectedDate: Date = new Date(formData.StartDate);
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.StartDate = 'Start date cannot be in the past';
    }
  }
  
  // Enhanced validation for Municipality
  if (!formData.MuncipalityName || formData.MuncipalityName.length <= 0) {
    errors.MuncipalityName = 'Please select a valid municipality';
    console.error('Municipality validation failed:', formData.MuncipalityName);
  }
  
  if (!formData.Skill1Name.trim()) {
    errors.Skill1Name = 'At least one skill is required';
  }
  
  if (!formData.image) {
    errors.image = 'Please upload an image';
  }
  
  return errors;
};