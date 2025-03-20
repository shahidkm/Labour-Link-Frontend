import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import EmployerNavbar from "../../../Components/User/UserNavbar/EmployerNavbar";
import LabourReviews from "./LabourReview";
import { 
  useLabourProfile, 
  useLabourRatings, 
  useSubmitReview
} from "../../../Hooks/User/Employer/LabourDetailsHook";
const LabourProfileTwo: React.FC = () => {
  const { labourId } = useParams<{ labourId:undefined }>();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Use custom hooks for data fetching
  const { data: profile, isLoading } = useLabourProfile(labourId);
  const { data: reviewData } = useLabourRatings(labourId);
  const submitReviewMutation = useSubmitReview(queryClient);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size exceeds 5MB limit. Please select a smaller image.");
        return;
      }
      
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file.");
        return;
      }
      
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleReviewSubmit = async (): Promise<void> => {
    if (!rating || !comment) {
      toast.error("Please provide a rating and a comment.");
      return;
    }
    
    if (!labourId) {
      toast.error("Labour ID not found.");
      return;
    }

    try {
      // Create review data object
      const reviewData = {
        labourId,
        rating,
        comment,
        image
      };

      // Submit the review using the mutation
      await submitReviewMutation.mutateAsync(reviewData);
      
      toast.success("Review submitted successfully!");
      // Reset form after successful submission
      setRating(0);
      setComment("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Review submission error:", error);
      
      if (error instanceof Error) {
        toast.error(`Failed to submit review: ${error.message}`);
      } else {
        toast.error("Failed to submit review. Please try again later.");
      }
    }
  };
  
  // Function to safely render work images with error handling
  const renderWorkImages = (): React.ReactNode => {
    if (!profile?.labourWorkImages || profile.labourWorkImages.length === 0) {
      return <p className="text-gray-600">No work images available</p>;
    }
    
    return profile.labourWorkImages.map((image, index) => (
      <div key={index} className="overflow-hidden rounded-lg shadow-md group">
        <img
          src={image}
          alt={`Work ${index + 1}`}
          className="w-full h-32 object-cover transform transition duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/150?text=Image+Not+Available";
            target.onerror = null; // Prevent infinite fallback loop
          }}
        />
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <EmployerNavbar/>
      
      <div className="container mx-auto mt-2 px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col md:flex-row">
            {/* Left sidebar - Profile information */}
            <div className="p-8 w-full md:w-1/3 flex flex-col items-center border-r border-gray-200 bg-gradient-to-b from-blue-50 to-white">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-60"></div>
                <img
                  src={profile?.profilePhotoUrl}
                  alt="Profile"
                  className="relative w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/150?text=Profile";
                    target.onerror = null;
                  }}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-6">{profile?.labourName || profile?.labourProfileCompletion.fullName}</h2>
              <p className="text-gray-600 flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {profile?.phoneNumber || profile?.labourProfileCompletion.phoneNumber}
              </p>

              <div className="w-full mt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Work Portfolio
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {renderWorkImages()}
                </div>
              </div>
            </div>
       
            <div className="p-8 w-full md:w-2/3">
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Details
                </h2>
                <div className="bg-blue-50 rounded-lg p-4 mb-5">
                  <p className="text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <strong>Preferred Time:</strong> <span className="ml-2">{profile?.preferedTime || profile?.labourProfileCompletion.preferedTime}</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About
                  </h3>
                  <p className="text-gray-700">{profile?.aboutYourSelf || profile?.labourProfileCompletion.aboutYourSelf}</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Core Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile?.labourSkills && profile.labourSkills.length > 0
                      ? profile.labourSkills.map((skill, index) => (
                          <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium shadow-sm transition-transform hover:scale-105">
                            {skill}
                          </span>
                        ))
                      : <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">No skills listed</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preferred Municipalities
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile?.labourPreferredMuncipalities && profile.labourPreferredMuncipalities.length > 0
                      ? profile.labourPreferredMuncipalities.map((municipality, index) => (
                          <span key={index} className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-sm font-medium shadow-sm transition-transform hover:scale-105">
                            {municipality}
                          </span>
                        ))
                      : <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">No preferred municipalities</span>}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                  <h2 className="text-xl font-bold text-gray-800 mb-5 text-center flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Overall Review
                  </h2>
                  {[5, 4, 3, 2, 1].map((star, index) => (
                    <div key={star} className="flex items-center mb-3">
                      <span className="w-10 font-medium text-gray-700">{star} ⭐</span>
                      <div className="bg-gray-200 h-4 rounded-full w-full overflow-hidden shadow-inner">
                        <div
                          className="bg-gradient-to-r from-purple-400 to-purple-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${((reviewData?.data?.[index] || 0) * 20)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 w-10 text-right text-gray-600">({reviewData?.data?.[index] || 0})</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Add a Review
                  </h3>
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">Your Rating:</p>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <span 
                          key={num} 
                          className={`cursor-pointer text-2xl transition-all duration-300 transform hover:scale-110 ${num <= rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                          onClick={() => setRating(num)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 mb-4 transition-all duration-300"
                    rows={3}
                    placeholder="Share your experience with this professional..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  
                  <div className="mb-4">
                    <label className="bg-blue-50 text-blue-600 py-2 px-4 rounded-lg cursor-pointer inline-block transition-colors hover:bg-blue-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Photo
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                    {image && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">{image.name} ({(image.size / 1024).toFixed(1)} KB)</span>
                        {imagePreview && (
                          <div className="mt-2 relative">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="h-24 w-auto rounded border border-gray-200" 
                            />
                            <button 
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              onClick={() => {
                                setImage(null);
                                setImagePreview(null);
                              }}
                              type="button"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transform hover:-translate-y-1"
                    onClick={handleReviewSubmit}
                    disabled={submitReviewMutation.isPending}
                  >
                    {submitReviewMutation.isPending ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : "Submit Review"}
                  </button>
                </div>

                <div>
                  <h1 className="text-2xl font-bold mb-4">Labour Reviews</h1>
                  {labourId ? (
                    <LabourReviews labourId={labourId} />
                  ) : (
                    <p className="text-red-500">Labour ID not found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourProfileTwo;