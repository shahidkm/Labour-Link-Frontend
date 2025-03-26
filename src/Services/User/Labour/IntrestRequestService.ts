// src/services/api/interestRequestService.ts
import { axiosInstance } from './AxiosInstanse';
import { 
  InterestRequestData, 
  InterestRequestResponse 
}  from '../../../Types/IntrestRequestTypes';


export const interestRequestService = {
  async showInterest(data: InterestRequestData): Promise<InterestRequestResponse> {
    const response = await axiosInstance.post('/InterestRequest/create', data);
    return response.data;
  },
};