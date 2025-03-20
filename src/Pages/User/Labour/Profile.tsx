import React, { useState, useRef } from "react";
import { useAddProfile } from "../../../Hooks/User/Labour/LabourProfileHook";
import ComboBox from "../../../Components/User/Dropdown/MuncipalityDropdown";
import SkillDropdown from "../../../Components/User/Dropdown/SkillDropDown";
import NavbarTwo from "../../../Components/User/UserNavbar/Navbar2";

export const ProfileSettings: React.FC = () => {
  const { mutate } = useAddProfile();

  const [profile, setProfile] = useState({
    FullName: "",
    PhoneNumber: "",
    PreferedTime: "",
    AboutYourSelf: "",
    ProfileImage: null as File | null,
    LabourPreferredMunicipalities: [] as string[],
    LabourWorkImages: [] as File[],
    LabourSkills: [] as string[],
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
    if (files) {
      setProfile((prev) => ({
        ...prev,
        LabourWorkImages: [...prev.LabourWorkImages, ...Array.from(files)].slice(0, 2),
      }));
    }
  };

  const handleWorkImageClick = () => {
    workImageInputRef.current?.click();
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

  const addMunicipality = (municipality: { municipalityId: number; name: string }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new object with properties in the specified order
    const orderedProfile = {
      FullName: profile.FullName,
      PhoneNumber: profile.PhoneNumber,
      PreferedTime: profile.PreferedTime,
      AboutYourSelf: profile.AboutYourSelf,
      ProfileImage: profile.ProfileImage,
      LabourPreferredMunicipalities: profile.LabourPreferredMunicipalities,
      LabourWorkImages: profile.LabourWorkImages,
      LabourSkills: profile.LabourSkills,
    };
    
    console.log("Sending data:", orderedProfile.ProfileImage);
    mutate(orderedProfile);
  };

  return (
    <div>
      <NavbarTwo />
      <div className="bg-purple-50 min-h-screen mt-[50px]">
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
                          w-24 h-24 rounded-md overflow-hidden cursor-pointer 
                          ${profile.LabourWorkImages[index] ? 'border border-green-400' : 'border border-dashed border-gray-300'} 
                          hover:border-purple-400 transition-all duration-300 flex items-center justify-center bg-gray-50
                        `}
                        onClick={handleWorkImageClick}
                      >
                        {profile.LabourWorkImages[index] ? (
                          <img
                            src={URL.createObjectURL(profile.LabourWorkImages[index])}
                            alt="Work Sample"
                            className="w-full h-full object-cover"
                          />
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