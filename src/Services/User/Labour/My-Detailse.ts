
import { axiosInstance } from './AxiosInstanse';
import { LabourDetails } from '../../../Types/LabourTypes';

export const labourService = {
  async getLabourDetails(): Promise<LabourDetails> {
    const response = await axiosInstance.get('/Labour/my-details');
    return response.data;
  },
};