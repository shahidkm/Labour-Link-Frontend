import axios from "axios";

const API_URL = "https://localhost:7299/api/Job/jobpostbyclient"; 

export interface JobPost {
  jobId: string;
  title: string;
  description: string;
  wage: number;
  startDate: string;
  endDate:string;
  prefferedTime: string;
  municipalityId: number;
  status: string;
  skillId1: string;
  skillId2: string;
  image: string;
  createdDate:Date;
}

export const fetchJobs = async (): Promise<JobPost[]> => {
  try {
    const response = await axios.get<JobPost[]>(API_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return [];
  }
};

export interface JobUpdateData {
  title: string;
  description: string;
  wage: number;
  startDate: string;
  prefferedTime: string;
  municipalityId: number;
  skillName1: string;
  skillName2: string;
}

export const updateJob = async (jobId: string, jobData: JobUpdateData) => {
  const response = await axios.put(`${API_URL}/update/${jobId}`, jobData);
  return response.data;
};
