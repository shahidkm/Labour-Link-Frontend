
export interface InterestRequestData {
    jobPostId: string;
    labourName: string;
    labourImageUrl: string;
    employerUserId: string;
    employerName: string;
    employerImageUrl: string;
  }
  
  export interface InterestRequestResponse {
    success: boolean;
    message: string;
  }