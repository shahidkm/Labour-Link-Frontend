import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NavbarTwo from "../../../Components/User/UserNavbar/Navbar2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLabourProfile } from "../../../Redux/userSlice";

// Define types based on the API response
interface Review {
  rating: number;
  comment: string;
  image: string;
  fullName: string;
  updatedAt: string;
}

interface LabourProfile {
  labourId: string;
  labourName: string;
  phoneNumber: string;
  preferedTime: string;
  aboutYourSelf: string;
  rating: number;
  profilePhotoUrl: string;
  labourWorkImages: string[];
  labourPreferredMuncipalities: string[];
  labourSkills: string[];
  reviews: Review[];
}

// Query keys for cache management
const queryKeys = {
  myProfile: () => ['myProfile'],
};

// Custom hook to fetch labour details
const useMyProfile = () => {
  return useQuery<LabourProfile>({
    queryKey: queryKeys.myProfile(),
    queryFn: async () => {
      const response = await axios.get(
        `https://localhost:7202/api/Labour/my-details`,
        {
          withCredentials: true, // Include cookies and credentials
        }
      );
      return response.data;
    },
  });
};

// Component to display labour reviews
const LabourReviews: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600 italic">No reviews available yet.</p>;
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {reviews.map((review, index) => (
        <div 
          key={index} 
          className="bg-white p-4 rounded-lg shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <div className="font-semibold text-gray-800">{review.fullName}</div>
              <div className="text-gray-500 text-sm ml-2">
                {new Date(review.updatedAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700 text-sm">{review.comment}</p>
          {review.image && (
            <div className="mt-2">
              <img 
                src={review.image} 
                alt="Review" 
                className="rounded-md max-h-24 object-cover border border-gray-200" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150?text=Image+Not+Available";
                  target.onerror = null;
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const MyProfile: React.FC = () => {
  const { data: profile, isLoading, error } = useMyProfile();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Save profile data to Redux when it loads
  useEffect(() => {
    if (profile) {
      dispatch(setLabourProfile({
        labourId: profile.labourId,
        labourName: profile.labourName,
        profilePhotoUrl: profile.profilePhotoUrl
      }));
    }
  }, [profile, dispatch]);

  // Calculate review stats
  const calculateReviewStats = () => {
    const stats = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    
    if (profile?.reviews && profile.reviews.length > 0) {
      profile.reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          stats[5 - review.rating]++;
        }
      });
    }
    
    return stats;
  };

  const reviewStats = calculateReviewStats();

  // Function to safely render work images with improved design
  const renderWorkImages = (): React.ReactNode => {
    if (!profile?.labourWorkImages || profile.labourWorkImages.length === 0) {
      return <p className="text-gray-600 text-sm">No work images available</p>;
    }
    
    return (
      <div className="grid grid-cols-3 gap-3">
        {profile.labourWorkImages.slice(0, 6).map((image, index) => (
          <div 
            key={index} 
            className="aspect-square overflow-hidden rounded-lg shadow-md border border-gray-200 group relative"
          >
            <img
              src={image}
              alt={`Work ${index + 1}`}
              className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/100?text=Image+Not+Available";
                target.onerror = null;
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <p>Error loading profile data. Please try again later.</p>
          <p className="text-sm mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <NavbarTwo/>
      
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col md:flex-row">
            {/* Left side - Profile information */}
            <div className="w-full md:w-1/2 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-60"></div>
                    <img
                      src={profile?.profilePhotoUrl}
                      alt="Profile"
                      className="relative w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/100?text=Profile";
                        target.onerror = null;
                      }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{profile?.labourName}</h2>
                    <div className="flex items-center mt-1">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`${i < Math.round(profile?.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({profile?.reviews?.length || 0})</span>
                    </div>
                    <p className="text-gray-600 flex items-center mt-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {profile?.phoneNumber}
                    </p>
                    <p className="text-gray-600 flex items-center mt-1 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Preferred Time: {profile?.preferedTime}
                    </p>
                  </div>
                </div>
                
                {/* Edit buttons positioned parallel to profile */}
                <div className="flex flex-col space-y-2">
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg flex items-center shadow-md transition-all duration-300 text-sm"
                    onClick={() => navigate("/edit-labour-profile")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                  {/* <button 
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg flex items-center shadow-md transition-all duration-300 text-sm"
                    onClick={() => navigate('/edit-portfolio')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Edit Portfolio
                  </button> */}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-5 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  About
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">{profile?.aboutYourSelf}</p>
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.labourSkills && profile.labourSkills.length > 0
                    ? profile.labourSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-xs font-medium shadow-sm">
                          {skill}
                        </span>
                      ))
                    : <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">No skills listed</span>}
                </div>
              </div>
              
              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preferred Municipalities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.labourPreferredMuncipalities && profile.labourPreferredMuncipalities.length > 0
                    ? profile.labourPreferredMuncipalities.map((municipality, index) => (
                        <span key={index} className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full text-xs font-medium shadow-sm">
                          {municipality}
                        </span>
                      ))
                    : <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">No preferred municipalities</span>}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Work Portfolio
                  </h3>
                  <button 
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    onClick={() => navigate('/edit-work-images')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </button>
                </div>
                {renderWorkImages()}
              </div>
            </div>
            
            {/* Right side - Reviews and Ratings */}
            <div className="w-full md:w-1/2 p-6 bg-gray-50 border-l border-gray-200">
              <div className="bg-white rounded-xl p-4 shadow-sm mb-5 border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Rating Summary
                </h2>
                
                <div className="flex items-center mb-3">
                  <div className="text-3xl font-bold text-gray-800 mr-2">
                    {profile?.rating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="flex mr-2">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-lg ${i < Math.round(profile?.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500">
                    ({profile?.reviews?.length || 0} reviews)
                  </div>
                </div>
                
                {[5, 4, 3, 2, 1].map((star, index) => (
                  <div key={star} className="flex items-center mb-1">
                    <span className="w-6 font-medium text-gray-700 text-xs">{star}⭐</span>
                    <div className="bg-gray-200 h-2 rounded-full w-full overflow-hidden shadow-inner mx-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(reviewStats[index] / (profile?.reviews?.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="w-6 text-right text-gray-600 text-xs">({reviewStats[index] || 0})</span>
                  </div>
                ))}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Customer Reviews
                  </h2>
                  
                  {profile?.reviews && profile.reviews.length > 0 && (
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => navigate('/all-reviews')}
                    >
                      View All
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                {profile?.reviews ? (
                  <LabourReviews reviews={profile.reviews} />
                ) : (
                  <p className="text-gray-600 italic text-sm">No reviews available yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;