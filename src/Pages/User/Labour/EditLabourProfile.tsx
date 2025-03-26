import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SkillDropdown from '../../../Components/User/Dropdown/SkillDropDown';
import ComboBox from '../../../Components/User/Dropdown/MuncipalityDropdown';
import axios from 'axios';
import NavbarTwo from '../../../Components/User/UserNavbar/Navbar2';


const EditLabourProfile: React.FC = () => {
    const queryClient = useQueryClient();
    
    // Profile data query
    const { data, isLoading, error } = useQuery({
        queryKey: ['labourProfile'],
        queryFn: async () => {
            try {
                const response = await axios.get('https://localhost:7202/api/Labour/my-details');
                return response.data;
            } catch (error) {
                console.error('Error fetching profile:', error);
                throw error;
            }
        },
    });

    // Integrated mutations with proper parameter naming and auto-invalidation
    const updateProfile = useMutation({
        mutationFn: async ({ FullName, AboutYourSelf, PreferedTime, Image }: { 
            FullName: string; 
            AboutYourSelf: string; 
            PreferedTime: string; 
            Image: File | null 
        }) => {
            const formData = new FormData();
            formData.append('FullName', FullName);
            formData.append('AboutYourSelf', AboutYourSelf);
            formData.append('PreferedTime', PreferedTime);
            if (Image) formData.append('Image', Image);
            
            await axios.patch('https://localhost:7202/api/Labour/edit/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
        }
    });

    const deleteWorkImageMutation = useMutation({
        mutationFn: async (workImageUrl: string) => {
            await axios.delete(`https://localhost:7202/api/Labour/delete/workimage?WorkImage=${encodeURIComponent(workImageUrl)}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
        }
    });

    const deleteSkillMutation = useMutation({
        mutationFn: async (skillName: string) => {
            await axios.delete(`https://localhost:7202/api/Labour/delete/skill?skillName=${encodeURIComponent(skillName)}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
        }
    });

    const deleteMunicipalityMutation = useMutation({
        mutationFn: async (municipalityName: string) => {
            await axios.delete(`https://localhost:7202/api/Labour/delete/municipality?municipalityName=${encodeURIComponent(municipalityName)}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
        }
    });

    const addSkillMutation = useMutation({
        mutationFn: async (skillName: string) => {
            await axios.post(`https://localhost:7202/api/Labour/aad/skill?skillName=${encodeURIComponent(skillName)}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
        }
    });

    const addMunicipalityMutation = useMutation({
        mutationFn: async (municipalityName: string) => {
            await axios.post(`https://localhost:7202/api/Labour/add/municipality?municipalityName=${encodeURIComponent(municipalityName)}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
        }
    });

    const addWorkImageMutation = useMutation({
        mutationFn: async (imageFile: File) => {
            const formData = new FormData();
            formData.append("image", imageFile);
        
            await axios.post("https://localhost:7202/api/Labour/add/workimage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labourProfile'] });
        }
    });

    // State
    const [fullName, setFullName] = useState('');
    const [aboutYourSelf, setAboutYourself] = useState('');
    const [preferedTime, setPreferedTime] = useState('Day');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [workImage, setWorkImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Initialize form data when profile data is loaded
    useEffect(() => {
        if (data?.labourProfileCompletion) {
            setFullName(data.labourProfileCompletion.fullName || '');
            setAboutYourself(data.labourProfileCompletion.aboutYourSelf || '');
            setPreferedTime(data.labourProfileCompletion.preferedTime || 'Day');
        }
    }, [data]);

    // Utility function to show success/error messages
    const showMessage = (message: string, isError = false) => {
        if (isError) {
            setErrorMessage(message);
            setTimeout(() => setErrorMessage(''), 3000);
        } else {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    // Handler functions - now don't manually invalidate queries
    const handleProfileUpdate = async () => {
        try {
            setIsSubmitting(true);
            await updateProfile.mutateAsync({ 
                FullName: fullName, 
                AboutYourSelf: aboutYourSelf, 
                PreferedTime: preferedTime, 
                Image: profileImage 
            });
            showMessage('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMsg = (error as any)?.response?.data?.message || 'Failed to update profile';
            showMessage(errorMsg, true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteWorkImage = async (workImageUrl: string) => {
        try {
            await deleteWorkImageMutation.mutateAsync(workImageUrl);
            showMessage('Work image deleted successfully');
        } catch (error) {
            console.error('Error deleting work image:', error);
            const errorMsg = (error as any)?.response?.data?.message || 'Failed to delete work image';
            showMessage(errorMsg, true);
        }
    };

    const handleDeleteSkill = async (skillName: string) => {
        try {
            console.log("Deleting skill with name:", skillName); // Debug log
            await deleteSkillMutation.mutateAsync(skillName);
            showMessage('Skill deleted successfully');
        } catch (error) {
            console.error('Error deleting skill:', error);
            const errorMsg = (error as any)?.response?.data?.message || 'Failed to delete skill';
            showMessage(errorMsg, true);
        }
    };

    const handleDeleteMunicipality = async (municipalityName: string) => {
        try {
            await deleteMunicipalityMutation.mutateAsync(municipalityName);
            showMessage('Municipality deleted successfully');
        } catch (error) {
            console.error('Error deleting municipality:', error);
            const errorMsg = (error as any)?.response?.data?.message || 'Failed to delete municipality';
            showMessage(errorMsg, true);
        }
    };

    const handleAddSkill = async (skillName: string) => {
        try {
            await addSkillMutation.mutateAsync(skillName);
            showMessage('Skill added successfully');
        } catch (error) {
            console.error('Error adding skill:', error);
            const errorMsg = (error as any)?.response?.data?.message || 'Failed to add skill';
            showMessage(errorMsg, true);
        }
    };

    const handleAddMunicipality = async (municipalityName: string) => {
        try {
            await addMunicipalityMutation.mutateAsync(municipalityName);
            showMessage('Municipality added successfully');
        } catch (error) {
            console.error('Error adding municipality:', error);
            const errorMsg = (error as any)?.response?.data?.message || 'Failed to add municipality';
            showMessage(errorMsg, true);
        }
    };

    const handleWorkImageUpload = async () => {
        if (!workImage) return;
        
        try {
            await addWorkImageMutation.mutateAsync(workImage);
            setWorkImage(null);
            showMessage('Work image uploaded successfully');
        } catch (error) {
            console.error('Error uploading work image:', error);
            const errorMsg = (error as any)?.response?.data?.message || 'Failed to upload work image';
            showMessage(errorMsg, true);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen text-gray-600 text-sm">Loading...</div>;
    if (error) {
        const errorMsg = (error as any).response?.data?.message || (error as Error).message || 'Error loading profile';
        return <div className="flex justify-center items-center h-screen text-red-500 text-sm">{errorMsg}</div>;
    }

    if (!data) return <div className="flex justify-center items-center h-screen text-gray-600 text-sm">No profile data available</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarTwo />
            
            {/* Status Messages */}
            {errorMessage && (
                <div className="fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md z-50">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md z-50">
                    {successMessage}
                </div>
            )}
            
            <div className="container mx-auto pt-16 pb-8 px-4">
                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Profile Section */}
                        <div className="p-6 w-full lg:w-1/3 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 w-full text-center">Personal Information</h2>
                            
                            <div className="relative w-32 h-32 rounded-full bg-purple-100 p-1 mb-6 flex items-center justify-center cursor-pointer group">
                                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white text-sm font-medium">Change Photo</span>
                                </div>
                                <img
                                    src={profileImage ? URL.createObjectURL(profileImage) : data?.profilePhotoUrl || '/default-avatar.png'}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <input type="file" id="profileImage" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            
                            <div className="w-full max-w-xs space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={fullName} 
                                        onChange={(e) => setFullName(e.target.value)} 
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                    <textarea 
                                        value={aboutYourSelf} 
                                        onChange={(e) => setAboutYourself(e.target.value)} 
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                                    <select 
                                        value={preferedTime} 
                                        onChange={(e) => setPreferedTime(e.target.value)} 
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="Day">Day</option>
                                        <option value="Night">Night</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>
                                
                                <button 
                                    onClick={handleProfileUpdate} 
                                    disabled={isSubmitting}
                                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>
                        </div>

                        {/* Skills & Municipalities */}
                        <div className="p-6 w-full lg:w-2/3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Skills Section */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2 mb-4 min-h-16">
                                        {data?.labourSkills?.length > 0 ? (
                                            data.labourSkills.map((skill: string, index: number) => (
                                                <div key={skill + index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                                                    {skill}
                                                    <button 
                                                        onClick={() => handleDeleteSkill(skill)} 
                                                        className="ml-2 w-4 h-4 flex items-center justify-center bg-blue-200 hover:bg-blue-300 rounded-full text-blue-800"
                                                        disabled={deleteSkillMutation.isPending}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No skills added yet</p>
                                        )}
                                    </div>
                                    <SkillDropdown onSelectSkill={handleAddSkill} />
                                </div>

                                {/* Municipalities Section */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Municipalities</h3>
                                    <div className="flex flex-wrap gap-2 mb-4 min-h-16">
                                        {data?.labourPreferredMuncipalities?.length > 0 ? (
                                            data.labourPreferredMuncipalities.map((municipality: any, index: number) => {
                                                // Handle both string and object formats
                                                const municipalityName = typeof municipality === 'object' ? 
                                                    municipality.name : 
                                                    municipality;
                                                    
                                                return (
                                                    <div key={`municipality-${index}`} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
                                                        {municipalityName}
                                                        <button 
                                                            onClick={() => handleDeleteMunicipality(municipalityName)} 
                                                            className="ml-2 w-4 h-4 flex items-center justify-center bg-green-200 hover:bg-green-300 rounded-full text-green-800"
                                                            disabled={deleteMunicipalityMutation.isPending}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p className="text-gray-500 text-sm">No municipalities added yet</p>
                                        )}
                                    </div>
                                    <ComboBox onSelectMunicipality={municipality => handleAddMunicipality(municipality.name)} />
                                </div>
                            </div>

                            {/* Work Images Section */}
                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Images</h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {data?.labourWorkImages?.length > 0 ? (
                                        data.labourWorkImages.map((image: string, index: number) => (
                                            <div key={`work-image-${index}`} className="relative group overflow-hidden rounded-lg aspect-square shadow-sm">
                                                <img
                                                    src={image}
                                                    alt={`Work sample ${index+1}`}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <button
                                                    onClick={() => handleDeleteWorkImage(image)}
                                                    disabled={deleteWorkImageMutation.isPending}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white text-xs flex justify-center items-center rounded-full shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full">
                                            <p className="text-gray-500 text-sm text-center">No work images uploaded yet</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 flex items-center gap-2 flex-wrap">
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            id="workImageInput" 
                                            onChange={(e) => setWorkImage(e.target.files?.[0] || null)} 
                                            className="hidden" 
                                            accept="image/*"
                                        />
                                        <button 
                                            onClick={() => document.getElementById('workImageInput')?.click()} 
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Select Image
                                        </button>
                                    </div>
                                    
                                    <button 
                                        onClick={handleWorkImageUpload} 
                                        disabled={!workImage || addWorkImageMutation.isPending}
                                        className={`bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition-colors ${(!workImage || addWorkImageMutation.isPending) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {addWorkImageMutation.isPending ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                    
                                    {workImage && (
                                        <span className="text-sm text-gray-600">
                                            Selected: {workImage.name}
                                        </span>
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

export default EditLabourProfile;