import { useState, useRef, useEffect } from "react";
import { useUpdateProfile } from "../../../Hooks/User/Labour/LabourProfileHook";
import NavbarTwo from "../../../Components/User/UserNavbar/Navbar2";

const preferredTimeOptions = ["Day", "Night", "Both"] as const;

const UpdateProfile = () => {
  const [FullName, setFullName] = useState("");
  const [ AboutYourSelf, setAboutYourself] = useState("");
  const [Image, setImage] = useState<File | null>(null);
  const [PreferedTime, setPreferredTime] = useState<"Day" | "Night" | "Both">(
    "Day"
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { mutate, isError, isSuccess } = useUpdateProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ FullName,  AboutYourSelf, Image, PreferedTime });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  // Disable scrolling on mount
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto"; // Reset to normal when the component unmounts
    };
  }, []);

  return (
    <div>
      <NavbarTwo />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload Circle */}
            <div
              className="relative w-32 h-32 bg-gray-300 rounded-full overflow-hidden cursor-pointer flex items-center justify-center mx-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              {Image ? (
                <img
                  src={URL.createObjectURL(Image)}
                  alt="Uploaded"
                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-gray-600">Upload Image</span>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <input
              type="text"
              value={FullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={AboutYourSelf}
              onChange={(e) => setAboutYourself(e.target.value)}
              placeholder="About Yourself"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={PreferedTime}
              onChange={(e) => setPreferredTime(e.target.value as "Day" | "Night" | "Both")}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {preferredTimeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full p-2 bg-purple-400 text-white rounded-md hover:bg-purple-700 transition"
            >
              Update Profile
            </button>
            {isSuccess && <p className="text-green-600">Profile updated successfully!</p>}
            {isError && <p className="text-red-600">Failed to update profile.</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
