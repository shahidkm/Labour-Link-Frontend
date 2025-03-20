import axios from "axios";

export interface JobPosts {
  jobId: string;
  title: string;
  description: string;
  wage: number;
  startDate: Date;
  prefferedTime: string;
  muncipalityId: number;
  clientName?: string;
  clientImage?: string;
  status: string;
  skillId1: string;
  skillId2: string;
  image: string;
}

const BASE_URL = "https://localhost:7299/api/Job";

// Fetch all active job posts
export const fetchClientJobPosts = async (): Promise<JobPosts[]> => {
  const { data } = await axios.get("https://localhost:7299/api/Job/showallJobpost");
  console.log("All Job Posts:", data);
  return data.data;
};

// Fetch job post by ID
export const fetchJobPostById = async (id: string): Promise<JobPosts> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/getjobpostbyid`, {
      params: { id },
    });
    console.log(`Job Post with ID ${id}:`, data);
    return data.data;
  } catch (error) {
    console.error(`Error fetching job post with ID ${id}:`, error);
    throw new Error("Failed to fetch job post");
  }
};

// Fetch job posts by title without pagination
export const fetchJobPostByTitle = async (title: string): Promise<JobPosts[]> => {
  try {
    const { data } = await axios.get(
      `https://localhost:7299/api/Job/searchforjobpost?searchparam=${title}`
    );

    console.log(`Job Posts with Title "${title}":`, data);
    return data.data; // Ensure that `data.data` exists in API response
  } catch (error) {
    console.error(`Error fetching job posts by title "${title}":`, error);
    throw new Error("Failed to fetch job posts");
  }
};
