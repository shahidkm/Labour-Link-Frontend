
export interface JobPost {
    cleintId: string;
    jobId: string;
    title: string;
    fullName: string;
    profileImageUrl: string;
    muncipalityId: string;
    wage: number;
    prefferedTime: string;
    isPreferred?: boolean;
    createdDate: string;
  }
  
  export interface JobPostDetails extends JobPost {
    description: string;
    startDate: Date;
    status: string;
    skillId1: string;
    skillId2: string;
    image: string;
  }