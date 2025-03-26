
import { axiosInstance } from './AxiosInstanse';
import { JobPost, JobPostDetails } from '../../../Types/JobTypes';

export const jobService = {
  async getActiveJobPosts(): Promise<JobPost[]> {
    const response = await axiosInstance.get('https://localhost:7299/api/Job/showallJobpostactive');
    return response.data.data;
  },

  async getPreferredJobs(): Promise<JobPost[]> {
    const response = await axiosInstance.get('/Preffered/getthejob');
    return response.data.data.map((job: JobPost) => ({ ...job, isPreferred: true }));
  },

  async searchJobsByTitle(title: string): Promise<JobPost[]> {
    if (!title.trim()) return [];
    const response = await axiosInstance.get(`/Job/searchJobByTitle/${title}`);
    return response.data.data || [];
  },
};