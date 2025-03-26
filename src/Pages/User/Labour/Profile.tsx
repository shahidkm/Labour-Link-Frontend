import React, { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import axios from "axios";
import ComboBox from "../../../Components/User/Dropdown/MuncipalityDropdown";
import SkillDropdown from "../../../Components/User/Dropdown/SkillDropDown";
import NavbarTwo from "../../../Components/User/UserNavbar/Navbar2";
import { updateProfileCompletion } from "../../../Redux/userSlice";
import { useNavigate } from "react-router-dom";
// Profile details interface
export interface ProfileDetails {
  FullName: string;
  PhoneNumber: string;
  PreferedTime: string;
  AboutYourSelf: string;
  ProfileImage: File | null; 
  LabourPreferredMunicipalities: string[];
  LabourWorkImages: File[];
  LabourSkills: string[];
}

// Municipality interface
interface Municipality {
  municipalityId: number;
  name: string;
}

// API function
export const AddProfile = async (Profile: ProfileDetails): Promise<ProfileDetails> => {
  console.log("Sending data:", Profile);
  
  try {
    // Create FormData for handling file uploads
    const formData = new FormData();
    
    // Append text fields
    formData.append("FullName", Profile.FullName);
    formData.append("PhoneNumber", Profile.PhoneNumber);
    formData.append("PreferedTime", Profile.PreferedTime);
    formData.append("AboutYourSelf", Profile.AboutYourSelf);
    
    // Append arrays (municipalities and skills)
    Profile.LabourPreferredMunicipalities.forEach((municipality, index) => {
      formData.append(`LabourPreferredMunicipalities[${index}]`, municipality);
    });
    
    Profile.LabourSkills.forEach((skill, index) => {
      formData.append(`LabourSkills[${index}]`, skill);
    });
    
    // Append profile image if it exists
    if (Profile.ProfileImage) {
      formData.append("ProfileImage", Profile.ProfileImage);
    }
    
    // Append work images as simple files with numeric index
    Profile.LabourWorkImages.forEach((image) => {
      // Send work images as just files without any additional properties
      formData.append("LabourWorkImages", image);
    });
    
    const response = await axios.post(
      "https://localhost:7202/api/Labour/complete/profile", 
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      }
    );
    
    console.log("Response data:", response.data);
    return response.data;
  } catch (ex) {
    console.error("Error in AddProfile:", ex);
    throw ex; // Re-throw the exception to be handled by the caller
  }
};

// Custom hook for adding profile
export const useAddProfile = () => {
  const dispatch = useDispatch();
  
  return useMutation<ProfileDetails, Error, ProfileDetails>({
    mutationFn: AddProfile,
    onSuccess: () => {
      // Update the profile completion status to true upon successful profile addition
      dispatch(updateProfileCompletion(true));
    },
    onError: () => {
      // Also update profile completion status to true even if there's an error
      dispatch(updateProfileCompletion(true));
    }
  });
};

// Main component
export const ProfileSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { mutate } = useAddProfile();

  const [profile, setProfile] = useState<ProfileDetails>({
    FullName: "",
    PhoneNumber: "",
    PreferedTime: "",
    AboutYourSelf: "",
    ProfileImage: null,
    LabourPreferredMunicipalities: [],
    LabourWorkImages: [],
    LabourSkills: [],
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workImageInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile((prev) => ({ ...prev, ProfileImage: file }));
    }
  };

  const handleWorkImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Create a new array with the files to avoid mutation issues
      const newWorkImages = Array.from(files);
      
      // Check if adding these new images would exceed the limit of 2
      const totalImages = [...profile.LabourWorkImages, ...newWorkImages];
      const imagesToAdd = totalImages.slice(0, 2); // Only take up to 2 images
      
      setProfile((prev) => ({
        ...prev,
        LabourWorkImages: imagesToAdd,
      }));
    }
  };

  const handleWorkImageClick = () => {
    workImageInputRef.current?.click();
  };

  const removeWorkImage = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      LabourWorkImages: prev.LabourWorkImages.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !profile.LabourSkills.includes(skill)) {
      setProfile((prev) => ({
        ...prev,
        LabourSkills: [...prev.LabourSkills, skill],
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      LabourSkills: prev.LabourSkills.filter((s) => s !== skill),
    }));
  };

  const addMunicipality = (municipality: Municipality) => {
    if (municipality && !profile.LabourPreferredMunicipalities.includes(municipality.name)) {
      setProfile((prev) => ({
        ...prev,
        LabourPreferredMunicipalities: [...prev.LabourPreferredMunicipalities, municipality.name],
      }));
    }
  };

  const removeMunicipality = (municipality: string) => {
    setProfile((prev) => ({
      ...prev,
      LabourPreferredMunicipalities: prev.LabourPreferredMunicipalities.filter((m) => m !== municipality),
    }));
  };

  var navigate=useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Set profile completed to true immediately when button is clicked
    dispatch(updateProfileCompletion(true));
    // Send the profile data to the API
    mutate(profile);
    navigate("/labour-home-page")
  };

  return (
    <div>
      <NavbarTwo />
      <div className="bg-purple-50 min-h-screen mt-[80px]">
        <div className="container mx-auto py-6 px-3">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-400 p-4">
              <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
              <p className="text-purple-100 text-sm">Set up your professional profile to connect with employers</p>
            </div>

            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-center mb-6">
                <div
                  className="relative w-24 h-24 bg-gray-100 rounded-full overflow-hidden cursor-pointer flex items-center justify-center border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {profile.ProfileImage ? (
                    <img
                      src={URL.createObjectURL(profile.ProfileImage)}
                      alt="Profile"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500 group-hover:text-purple-500 transition-colors duration-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      <span className="text-xs mt-1">Profile Photo</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="ml-0 sm:ml-4 mt-3 sm:mt-0">
                  <h3 className="text-base font-semibold text-gray-800">Profile Picture</h3>
                  <p className="text-gray-500 text-xs">Upload a clear profile picture to enhance your visibility</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-purple-700 border-b border-purple-200 pb-1 mb-3">Personal Information</h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            name="FullName"
                            value={profile.FullName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Your full name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            name="PhoneNumber"
                            value={profile.PhoneNumber}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            placeholder="Your contact number"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Preferred Working Time</label>
                          <select
                            name="PreferedTime"
                            value={profile.PreferedTime}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white"
                          >
                            <option value="">Select preferred time</option>
                            <option value="Day">Day Shift</option>
                            <option value="Night">Night Shift</option>
                            <option value="Both">Flexible (Both)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-purple-700 border-b border-purple-200 pb-1 mb-3">Skills & Expertise</h3>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Add Your Skills</label>
                        <SkillDropdown onSelectSkill={addSkill} />
                        <div className="flex flex-wrap mt-2">
                          {profile.LabourSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full m-1 text-xs cursor-pointer flex items-center hover:bg-purple-200 transition-colors duration-200"
                              onClick={() => removeSkill(skill)}
                            >
                              {skill}
                              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-purple-700 border-b border-purple-200 pb-1 mb-3">Preferred Locations</h3>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Add Municipalities</label>
                        <ComboBox onSelectMunicipality={addMunicipality} />
                        <div className="flex flex-wrap mt-2">
                          {profile.LabourPreferredMunicipalities.map((municipality, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-full m-1 text-xs cursor-pointer flex items-center hover:bg-green-200 transition-colors duration-200"
                              onClick={() => removeMunicipality(municipality)}
                            >
                              {municipality}
                              <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                              </svg>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-purple-700 border-b border-purple-200 pb-1 mb-3">Professional Summary</h3>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">About Yourself</label>
                        <textarea
                          name="AboutYourSelf"
                          value={profile.AboutYourSelf}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          rows={4}
                          placeholder="Describe your experience, skills, and what makes you stand out..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 mb-6">
                  <h3 className="text-base font-semibold text-purple-700 border-b border-purple-200 pb-1 mb-3">Work Samples</h3>
                  <p className="text-xs text-gray-500 mb-2">Upload images of your previous work (Maximum 2 images)</p>
                  
                  <div className="flex space-x-3">
                    {[...Array(2)].map((_, index) => (
                      <div
                        key={index}
                        className={`
                          relative w-24 h-24 rounded-md overflow-hidden cursor-pointer 
                          ${index < profile.LabourWorkImages.length ? 'border border-green-400' : 'border border-dashed border-gray-300'} 
                          hover:border-purple-400 transition-all duration-300 flex items-center justify-center bg-gray-50
                        `}
                        onClick={handleWorkImageClick}
                      >
                        {index < profile.LabourWorkImages.length ? (
                          <>
                            <img
                              src={URL.createObjectURL(profile.LabourWorkImages[index])}
                              alt={`Work Sample ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full transform translate-x-1/4 -translate-y-1/4 hover:bg-red-600"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the parent onClick
                                removeWorkImage(index);
                              }}
                              type="button"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <span className="text-xs mt-1">Add image</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <input
                    ref={workImageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleWorkImagesUpload}
                    className="hidden"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    {profile.LabourWorkImages.length}/2 images uploaded
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm rounded-md shadow hover:from-purple-700 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
                 
                 >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;