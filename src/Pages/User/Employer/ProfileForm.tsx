import { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetAllMuncipalities } from "../../../Hooks/Admin/MunicipalityHooks";
import { useAddEmployerProfile } from "../../../Hooks/User/Employer/ProfileHook";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Municipality {
  municipalityId: number;
  name: string;
}

export default function ProfileForm() {
  const { data, isLoading, error } = useGetAllMuncipalities();
  const { mutate: addProfile } = useAddEmployerProfile();
  const [FullName, setFullName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMunicipality) {
      toast.error("Please select a municipality.");
      return;
    }

    // Prepare plain object data to pass into the mutation
    const plainData = {
      FullName,
      PhoneNumber,
      PreferedMunicipality: selectedMunicipality.name,
      ProfileImage: profileImage || new File([], ""), // Ensure ProfileImage exists
    };

    // Log data being sent to API
    console.log("Sending data to API:", plainData);

    addProfile(plainData, {
      onSuccess: (response) => {
        // Log API response
        console.log("API Response (Success):", response);
        toast.success("Profile added successfully!");
        // Reset form after successful submission
        setFullName("");
        setPhoneNumber("");
        setSelectedMunicipality(null);
        setProfileImage(null);
        setPreviewUrl(null);
      },
      onError: (error: any) => {
        // Log error response
        console.error("API Response (Error):", error);
        toast.error(error.response?.data?.message || "Failed to add profile. Please try again.");
      },
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-2xl">
      <h2 className="text-xl font-bold text-center text-purple-700 mb-4">Add Employer Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-4">
          <div 
            className="w-24 h-24 rounded-full bg-gray-200 mb-2 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-purple-300"
            onClick={triggerFileInput}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            type="button" 
            onClick={triggerFileInput}
            className="text-sm text-purple-600 hover:text-purple-800"
          >
            {profileImage ? "Change Profile Image" : "Upload Profile Image"}
          </button>
        </div>

        {/* Full Name Field */}
        <input
          type="text"
          placeholder="Full Name"
          value={FullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* Phone Number Field */}
        <input
          type="text"
          placeholder="Phone Number"
          value={PhoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />

        {/* Municipality Dropdown */}
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
              />
            )}
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
       onClick={()=>("client-home-page")} >
          Submit
        </button>
      </form>
    </div>
  );
}
