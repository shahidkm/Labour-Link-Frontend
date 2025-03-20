import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUpdateProfile, useAddMunicipality, useAddSkill, useAddWorkImage, useDeleteMunicipality, useDeleteSkill, useDeleteWorkImage } from '../../../Hooks/User/Labour/LabourProfileHook';
import SkillDropdown from '../../../Components/User/Dropdown/SkillDropDown';
import ComboBox from '../../../Components/User/Dropdown/MuncipalityDropdown';
import axios from 'axios';
import NavbarTwo from '../../../Components/User/UserNavbar/Navbar2';

const EditLabourProfile: React.FC = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['labourProfile'],
        queryFn: async () => {
            const response = await axios.get('https://localhost:7202/api/Labour/my-details');
            return response.data;
        },
    });

    const updateProfile = useUpdateProfile();
    const deleteWorkImage = useDeleteWorkImage();
    const deleteSkill = useDeleteSkill();
    const addWorkImage = useAddWorkImage();
    const addSkill = useAddSkill();
    const deleteMunicipality = useDeleteMunicipality();
    const addMunicipality = useAddMunicipality();

    const [FullName, setFullName] = useState('');
    const [AboutYourSelf, setAboutYourself] = useState('');
    const [ PreferedTime, setPreferredTime] = useState('Day');
    const [ProfileImage, setProfileImage] = useState<File | null>(null);
    const [WorkImage, setWorkImage] = useState<File | null>(null);

    React.useEffect(() => {
        if (data?.labourProfileCompletion) {
            setFullName(data.labourProfileCompletion.fullName || '');
            setAboutYourself(data.labourProfileCompletion.aboutYourSelf || '');
            setPreferredTime(data.labourProfileCompletion.preferedTime || 'Day');
        }
    }, [data]);

    const handleProfileUpdate = () => {
        updateProfile.mutate({ FullName, AboutYourSelf, PreferedTime, Image: ProfileImage });
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-600 text-sm">Loading...</div>;
    if (error) {
        const errorMessage = (error as any).response?.data?.message || error.message || 'Error loading profile';
        return <div className="flex justify-center items-center h-screen text-red-500 text-sm">{errorMessage}</div>;
    }

    if (!data) return <div className="flex justify-center items-center h-screen text-gray-600 text-sm">No profile data available</div>;

    const handleWorkImageUpload = () => {
        if (WorkImage) {
            addWorkImage.mutate(WorkImage);
            setWorkImage(null);
        }
    };

    return (
        <div>
            <NavbarTwo />
            <div className="mt-[50px]  bg-white min-h-screen flex flex-col items-center">
                <div className="flex justify-center items-center p-4 ">
                    <div className="bg-white rounded-xl shadow-md flex flex-col md:flex-row w-[1200px]">
                        {/* Profile Section */}
                        <div className="p-4 w-full md:w-1/3 flex flex-col items-center border-r">
                            <div className="relative w-32 h-32 rounded-full bg-purple-200 p-1 mb-3 flex items-center justify-center cursor-pointer">
                                <label htmlFor="profileImage" className="absolute text-white font-bold text-xl">+</label>
                                <img
                                    src={ProfileImage ? URL.createObjectURL(ProfileImage) : data?.profilePhotoUrl || '/default-avatar.png'}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <input type="file" id="profileImage" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <label className="text-sm font-semibold">Full Name</label>
                            <input type="text" value={FullName} onChange={(e) => setFullName(e.target.value)} className="border p-1 rounded w-64 text-sm mb-2" />
                            <label className="text-sm font-semibold">About</label>
                            <textarea value={AboutYourSelf} onChange={(e) => setAboutYourself(e.target.value)} className="border p-1 rounded w-64  text-sm mb-2" />
                            <label className="text-sm font-semibold">Preferred Time</label>
                            <select value={PreferedTime} onChange={(e) => setPreferredTime(e.target.value as 'Day' | 'Night' | 'Both')} className="border p-1 rounded w-64  text-sm mb-2">
                                <option value="Day">Day</option>
                                <option value="Night">Night</option>
                                <option value="Both">Both</option>
                            </select>
                            <button onClick={handleProfileUpdate} className="bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-700 text-sm mt-2">Save</button>
                        </div>

                        {/* Skills & Municipalities */}
                        <div className="p-4 w-full md:w-2/3">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                            <ul className="flex flex-wrap gap-1 mb-3">
                                {data?.labourSkills?.map((skill: string, index: number) => (
                                    <li key={skill + index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                                        {skill}
                                        <button onClick={() => deleteSkill.mutate(skill)} className="ml-1 text-red-500 text-xs">x</button>
                                    </li>
                                ))}
                            </ul>
                            <SkillDropdown onSelectSkill={(skillId) => addSkill.mutate(skillId)} />

                            <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-4">Municipalities</h3>
                            <ul className="flex flex-wrap gap-1 mb-3">
                                {data?.labourPreferredMuncipalities?.map((municipality: string, index: number) => (
                                    <li key={municipality + index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                                        {municipality}
                                        <button onClick={() => deleteMunicipality.mutate(Number(municipality))} className="ml-1 text-red-500 text-xs">x</button>
                                    </li>
                                ))}
                            </ul>
                            <ComboBox onSelectMunicipality={(municipality) => addMunicipality.mutate(municipality.municipalityId)} />

                          
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-4 text-center">
  Work Images
</h3>
<div className="flex justify-center px-4">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 w-full max-w-4xl">
    {data?.labourWorkImages?.map((image: string, index: number) => (
      <div
        key={image + index}
        className="relative rounded-md shadow-sm w-full max-w-[200px] mx-auto overflow-hidden"
      >
        <img
          src={image}
          alt="Work"
          className="w-full h-auto rounded-md object-cover"
        />
        <button
          onClick={() => deleteWorkImage.mutate(image)}
          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-xs flex justify-center items-center rounded-full shadow-md hover:bg-red-600"
        >
          ×
        </button>
      </div>
    ))}
  </div>
</div>


                            <div className="mt-3">
                                <input type="file" id="workImageInput" onChange={(e) => setWorkImage(e.target.files?.[0] || null)} className="hidden" />
                                <button onClick={() => document.getElementById('workImageInput')?.click()} className="bg-blue-400 text-white px-3 py-1 rounded-lg text-sm">Choose Work Image</button>
                                <button onClick={handleWorkImageUpload} className="bg-green-400 text-white px-3 py-1 rounded-lg text-sm ml-2" disabled={!WorkImage}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditLabourProfile;
