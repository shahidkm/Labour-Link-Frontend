import React from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

interface Review {
  rating: number;
  comment: string;
  image: string;
  fullName: string;
  updatedAt: string;
}

interface ReviewsResponse {
  data?: Review[];
}

// Custom hook to encapsulate review fetching logic
const useReviews = (labourId: string | undefined): {
  reviews: Review[];
  isLoading: boolean;
  isError: boolean;
  error: Error | AxiosError | null;
} => {
  const fetchReviews = async (id: string): Promise<Review[]> => {
    try {
      const response = await axios.get<ReviewsResponse>(
        `https://localhost:7202/api/Review/getreviewsofspecificlabour?Labourid=${id}`
      );

      console.log("Fetched Response:", response.data);
      
      // Type-safe access to response data
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error; // Let react-query handle the error
    }
  };

  const result: UseQueryResult<Review[], Error | AxiosError> = useQuery({
    queryKey: ["labourReviews", labourId],
    queryFn: () => (labourId ? fetchReviews(labourId) : Promise.resolve([])),
    enabled: !!labourId, // Ensure valid ID before fetching
  });

  return {
    reviews: result.data || [],
    isLoading: result.isLoading,
    isError: result.isError,
    error: result.error
  };
};

const LabourReviews: React.FC = () => {
  const { labourId } = useParams<{ labourId?: string }>();
  const { reviews, isLoading, isError, error } = useReviews(labourId);

  if (!labourId) {
    return <p className="text-center text-red-500">Invalid Labour ID.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-6">
        <p>Failed to load reviews.</p>
        <p className="text-sm">{error?.message || "Unknown error occurred"}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-6">
      {reviews.length > 0 ? (
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide p-4">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              className="min-w-[300px] max-w-sm bg-white shadow-lg rounded-lg p-4"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={review.image}
                alt={review.fullName}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="mt-3">
                <h3 className="text-lg font-semibold">{review.fullName}</h3>
                <p className="text-gray-500 text-sm">{new Date(review.updatedAt).toDateString()}</p>
                <p className="text-gray-700 mt-2">{review.comment}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="ml-1 text-gray-700">{review.rating}/5</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No reviews available.</p>
      )}
    </div>
  );
};

export default LabourReviews;