import axios from 'axios';

const API_URL = 'https://your-api-url.com/api/reviews';

// Define types
interface Review {
  rating: number;
  comment: string;
  image?: string;
  fullName?: string;
  updatedAt: string;
}

interface AddReview {
  labourId: string;
  rating: number;
  comment: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Service functions
export const reviewService = {
  addReview: async (review: AddReview, image?: File, userId?: string) => {
    const formData = new FormData();
    formData.append('labourId', review.labourId);
    formData.append('rating', review.rating.toString());
    formData.append('comment', review.comment);
    if (image) formData.append('image', image);
    
    const response = await axios.post<ApiResponse<Review>>(`${API_URL}/add/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getReviews: async (labourId: string) => {
    const response = await axios.get<ApiResponse<Review[]>>(`${API_URL}/show/${labourId}`);
    return response.data.data;
  },

  updateReview: async (reviewId: string, updatedReview: AddReview, image?: File, userId?: string) => {
    const formData = new FormData();
    formData.append('rating', updatedReview.rating.toString());
    formData.append('comment', updatedReview.comment);
    if (image) formData.append('image', image);

    const response = await axios.put<ApiResponse<Review>>(`${API_URL}/update/${reviewId}/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  changeStatus: async (reviewId: string, userId: string) => {
    const response = await axios.patch<ApiResponse<string>>(`${API_URL}/status/${reviewId}/${userId}`);
    return response.data;
  },

  getRatings: async (labourId: string) => {
    const response = await axios.get<ApiResponse<number[]>>(`${API_URL}/ratings/${labourId}`);
    return response.data.data;
  },
};
