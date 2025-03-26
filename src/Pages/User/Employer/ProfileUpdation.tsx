import { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetAllMuncipalities } from "../../../Hooks/Admin/MunicipalityHooks";
import { useUpdateEmployerProfile } from "../../../Hooks/User/Employer/ProfileHook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the Municipality type
interface Municipality {
  municipalityId: number;
  name: string;
}

const UpdateEmployerProfile = () => {
  const { data, isLoading, error } = useGetAllMuncipalities();
  const { mutate } = useUpdateEmployerProfile();
  const [fullName, setFullName] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle image selection
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

  // Handle drag events for the image upload area
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
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

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMunicipality) {
      toast.error("Please select a municipality.");
      return;
    }

    if (!profileImage) {
      toast.error("Please upload a profile image.");
      return;
    }

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("FullName", fullName);
    formData.append("PreferedMuncipality", selectedMunicipality.name);
    
    // Make sure to append the file with the correct field name "Image"
    formData.append("Image", profileImage, profileImage.name);

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
      onSuccess: (data) => {
        console.log("Success response:", data);
        toast.success("Profile updated successfully!");
        // Optionally reset form or redirect
      },
      onError: (error: any) => {
        console.error("Failed to update profile:", error);
        // Show more specific error message if available
        const errorMessage = error?.response?.data?.message || "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">Update Employer Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            {/* Profile Image Upload - New Rounded Div Design */}
            <div className="flex flex-col items-center mb-4">
              <div 
                className={`w-32 h-32 rounded-full overflow-hidden border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} cursor-pointer flex items-center justify-center relative`}
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
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs text-gray-500">
                      Click or drag to upload
                    </span>
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
              
              {profileImage && (
                <div className="mt-2 text-center">
                  <span className="text-xs text-gray-500">
                    {profileImage.name} ({Math.round(profileImage.size / 1024)} KB)
                  </span>
                  <button 
                    type="button" 
                    className="block mx-auto mt-1 text-xs text-red-500 hover:text-red-700"
                    onClick={() => {
                      setProfileImage(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>

            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="FullName" // Match API field name
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Municipality Dropdown */}
            <div>
              <label htmlFor="municipality" className="block text-sm font-medium text-gray-700">
                Select Municipality
              </label>
              {isLoading ? (
                <div>Loading municipalities...</div>
              ) : error ? (
                <div className="text-red-500">Error loading municipalities.</div>
              ) : (
                <Autocomplete
                  disablePortal
                  id="municipality"
                  options={data || []}
                  getOptionLabel={(option: Municipality) => option.name}
                  onChange={(_, value) => setSelectedMunicipality(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Municipality"
                      name="PreferedMuncipality" // Match API field name
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#B0BEC5" },
                          "&:hover fieldset": { borderColor: "#90A4AE" },
                          "&.Mui-focused fieldset": { borderColor: "#78909C" },
                        },
                        "& .MuiInputLabel-root": { color: "#9333EA" },
                        "& .MuiInputLabel-root.Mui-focused": { color: "#9333EA" },
                      }}
                      required
                    />
                  )}
                />
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployerProfile;