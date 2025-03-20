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

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
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
    formData.append("PreferedMuncipality", selectedMunicipality.name); // Using name instead of ID
    formData.append("Image", profileImage);

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
      },
      onError: (error) => {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile. Please try again.");
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">Update Employer Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 mb-2">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No Image</span>
                  </div>
                )}
              </div>
              <label htmlFor="profileImage" className="cursor-pointer text-blue-600 hover:text-blue-800">
                Upload Profile Image
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* Full Name Input */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
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
                <div>Loading...</div>
              ) : error ? (
                <div className="text-red-500">Error loading municipalities.</div>
              ) : (
                <Autocomplete
                  disablePortal
                  options={data || []}
                  getOptionLabel={(option: Municipality) => option.name}
                  onChange={(_, value) => setSelectedMunicipality(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="municipality"
                      variant="outlined"
                      label="Select Municipality"
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