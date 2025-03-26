import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ComboBox from '../../../Components/User/Dropdown/MuncipalityDropdown';
import { useEmployerDetails, useUpdateEmployerProfile } from '../../../Hooks/User/Employer/ProfileHook';

interface Municipality {
  municipalityId: number;
  name: string;
}

const EmployerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading, isError, error } = useEmployerDetails();
  const { mutate } = useUpdateEmployerProfile();
  const [fullName, setFullName] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | undefined>(undefined);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && data) {
      setFullName(data.fullName || "");
      if (data.preferedMunicipality) {
        setSelectedMunicipality({ municipalityId: 1, name: data.preferedMunicipality });
      }
      
      // Set the current profile image URL as preview if available
      if (data.profileImageUrl) {
        setPreviewUrl(data.profileImageUrl);
      }
    }
  }, [isEditing, data]);

  const handleEditClick = () => setIsEditing(true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file.");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        return;
      }
      
      setProfileImage(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-purple-600', 'bg-purple-50');
    e.currentTarget.classList.remove('border-purple-300');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-purple-600', 'bg-purple-50');
    e.currentTarget.classList.add('border-purple-300');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-purple-600', 'bg-purple-50');
    e.currentTarget.classList.add('border-purple-300');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file.");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB.");
        return;
      }
      
      setProfileImage(file);
      
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMunicipality) {
      toast.error("Please select a municipality.");
      return;
    }

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("FullName", fullName);
    formData.append("PreferedMuncipality", selectedMunicipality.name);
    
    // Append image if a new one was selected
    if (profileImage) {
      formData.append("Image", profileImage, profileImage.name);
    }

    // Debug: Log FormData contents
    console.log("Form data being sent:");
    for (const pair of formData.entries()) {
      console.log(pair[0] + ": " + (pair[0] === "Image" ? "File object" : pair[1]));
    }
    
    if (profileImage) {
      console.log("Image details:", {
        name: profileImage.name,
        type: profileImage.type,
        size: profileImage.size + " bytes"
      });
    }

    mutate(formData, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setProfileImage(null); // Reset after successful update
      },
      onError: (error: any) => {
        console.error("Failed to update profile:", error);
        const errorMessage = error?.response?.data?.message || "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      }
    });
  };

  const handleSelectMunicipality = (municipality: Municipality | null) => {
    setSelectedMunicipality(municipality || undefined);
  };

  if (isLoading) {
    return <LoadingProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-md my-6 mx-4">
        <p className="text-red-700 font-medium mb-1">Failed to load profile data.</p>
        <p className="text-red-600 text-sm mb-1">{(error as Error)?.message || 'Please try again later.'}</p>
        <p className="text-gray-600 text-sm italic">Showing default information instead.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto my-8 border-t-4 border-purple-600">
      <h2 className="text-2xl font-semibold text-purple-800 mb-6 pb-2">Profile</h2>
      {isEditing ? (
        <EditProfileForm 
          fullName={fullName}
          setFullName={setFullName}
          selectedMunicipality={selectedMunicipality}
          onSelectMunicipality={handleSelectMunicipality}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          handleImageChange={handleImageChange}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          previewUrl={previewUrl}
          profileImage={profileImage}
          setProfileImage={setProfileImage}
          setPreviewUrl={setPreviewUrl}
          currentImageUrl={data?.profileImageUrl}
        />
      ) : (
        <RenderProfile data={data} onEditClick={handleEditClick} />
      )}
    </div>
  );
};

const RenderProfile: React.FC<{ data: any; onEditClick: () => void }> = ({ data, onEditClick }) => {
  // Default profile image if none is provided
  const profileImage = data.profileImageUrl || "https://via.placeholder.com/150";
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0 md:space-x-4">
      <div className="bg-purple-50 p-5 rounded-lg w-full md:w-3/4 shadow-sm">
        <div className="flex items-center mb-6">
          {/* Profile Image in rounded div */}
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-purple-500 flex-shrink-0 bg-white">
            <img 
              src={profileImage} 
              alt={`${data.fullName}'s profile`} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to a user icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%237e22ce'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /%3E%3C/svg%3E";
              }}
            />
          </div>
          <h3 className="text-xl font-medium text-purple-900">{data.fullName || "Your Name"}</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="text-purple-800">{data.phoneNumber || "Phone number not provided"}</p>
          </div>
          
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-purple-800">{data.preferedMunicipality || "No municipality selected"}</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={onEditClick}
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center w-full md:w-auto justify-center shadow-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Edit Profile
      </button>
    </div>
  );
};

interface EditProfileFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  selectedMunicipality: Municipality | undefined;
  onSelectMunicipality: (municipality: Municipality | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  previewUrl: string | null;
  profileImage: File | null;
  setProfileImage: React.Dispatch<React.SetStateAction<File | null>>;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
  currentImageUrl: string | undefined;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ 
  fullName, 
  setFullName, 
  onSelectMunicipality, 
  onSubmit, 
  onCancel,
  handleImageChange,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  previewUrl,
  profileImage,
  setProfileImage,
  setPreviewUrl,
  currentImageUrl
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
      {/* Profile Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-purple-700 mb-2">
          Profile Picture
        </label>
        <div className="flex flex-col items-center">
          <div 
            className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-300 cursor-pointer flex items-center justify-center relative mb-3"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById("profileImage")?.click()}
          >
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Profile Preview" 
                className="w-full h-full object-cover"
              />
            ) : currentImageUrl ? (
              <img 
                src={currentImageUrl} 
                alt="Current Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
            <input
              type="file"
              id="profileImage"
              name="Image" // Match API field name
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          
          <div className="text-center">
            <span className="text-xs text-purple-600 font-medium">
              Click or drag to upload profile picture
            </span>
            
            {profileImage && (
              <div className="mt-1">
                <span className="text-xs text-gray-500 block">
                  {profileImage.name} ({Math.round(profileImage.size / 1024)} KB)
                </span>
                <button 
                  type="button" 
                  className="text-xs text-red-500 hover:text-red-700 mt-1"
                  onClick={() => {
                    setProfileImage(null);
                    // If there was a current image, revert to it, else clear preview
                    setPreviewUrl(currentImageUrl || null);
                  }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-medium text-purple-700">
          Full Name
        </label>
        <input 
          id="fullName"
          type="text" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          placeholder="Enter your full name"
          className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          required
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-700">
          Preferred Municipality
        </label>
        <div className="w-full">
          <ComboBox onSelectMunicipality={onSelectMunicipality} />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-purple-100">
        <button 
          type="button" 
          onClick={onCancel}
          className="px-4 py-2 border border-purple-300 rounded-md text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 ease-in-out"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 ease-in-out shadow-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

const LoadingProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto my-8 animate-pulse border-t-4 border-purple-300">
      <div className="h-8 bg-purple-100 rounded w-1/4 mb-6"></div>
      <div className="flex mb-6">
        {/* Profile image skeleton */}
        <div className="w-16 h-16 bg-purple-100 rounded-full mr-4"></div>
        <div className="h-8 bg-purple-100 rounded w-1/3 self-center"></div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-purple-100 rounded w-3/4"></div>
        <div className="h-6 bg-purple-100 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default EmployerProfile;