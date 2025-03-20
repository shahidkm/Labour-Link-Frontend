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
  
  // Set the selectedMunicipality type properly, starting as undefined
  const [selectedMunicipality, setSelectedMunicipality] = useState<Municipality | undefined>(undefined);

  useEffect(() => {
    if (isEditing && data) {
      setFullName(data.fullName || "");
      // Optionally set selectedMunicipality from the data if available
      if (data.preferedMunicipality) {
        setSelectedMunicipality({ municipalityId: 1, name: data.preferedMunicipality }); // Adjust based on your data
      }
    }
  }, [isEditing, data]);

  const handleEditClick = () => setIsEditing(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMunicipality) {
      toast.error("Please select a municipality.");
      return;
    }
    const profileData = {
      FullName: fullName,
      PreferedMuncipality: selectedMunicipality.name
    };
    mutate(profileData, {
      onSuccess: () => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      },
      onError: (error) => {
        console.error("Failed to update profile:", error);
        toast.error("Failed to update profile. Please try again.");
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
      <div className="error-message">
        <p>Failed to load profile data.</p>
        <p>{(error as Error)?.message || 'Please try again later.'}</p>
        <p>Showing default information instead.</p>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <h2>Profile</h2>
      {isEditing ? (
        <EditProfileForm 
          fullName={fullName}
          setFullName={setFullName}
          selectedMunicipality={selectedMunicipality}
          onSelectMunicipality={handleSelectMunicipality}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <RenderProfile data={data} onEditClick={handleEditClick} />
      )}
    </div>
  );
};

const RenderProfile: React.FC<{ data: any; onEditClick: () => void }> = ({ data, onEditClick }) => {
  return (
    <div className="profile-info">
      <div>
        <p>{data.fullName}</p>
        <p>{data.phoneNumber}</p>
        <p>{data.preferedMunicipality}</p>
      </div>
      <button onClick={onEditClick}>Edit Profile</button>
    </div>
  );
};

const EditProfileForm: React.FC<{
  fullName: string;
  setFullName: (name: string) => void;
  selectedMunicipality: Municipality | undefined;
  onSelectMunicipality: (municipality: Municipality | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}> = ({ fullName, setFullName,  onSelectMunicipality, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit}>
      <input 
        type="text" 
        value={fullName} 
        onChange={(e) => setFullName(e.target.value)} 
        placeholder="Enter full name"
      />
      <ComboBox onSelectMunicipality={onSelectMunicipality} />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

const LoadingProfileSkeleton: React.FC = () => {
  return (
    <div className="skeleton-loading">
      <div className="skeleton"></div>
      <div className="skeleton"></div>
      <div className="skeleton"></div>
    </div>
  );
};

export default EmployerProfile;
