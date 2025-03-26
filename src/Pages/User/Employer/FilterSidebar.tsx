import React, { useState } from 'react';
import SkillDropdown from '../../../Components/User/Dropdown/SkillDropDown';
import ComboBox from '../../../Components/User/Dropdown/MuncipalityDropdown';
import { Municipality } from '../../../Types/Municipality';

interface EmployerFilterSidebarProps {
  onMunicipalityFilter: (municipalities: string[]) => void;
  onSkillFilter: (skills: string[]) => void;
  selectedMunicipalities: string[];
  selectedSkills: string[];
}

const EmployerFilterSidebar: React.FC<EmployerFilterSidebarProps> = ({
  onMunicipalityFilter,
  onSkillFilter,
  selectedMunicipalities,
  selectedSkills
}) => {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Handle Municipality Selection
  const handleMunicipalitySelect = (municipality: Municipality) => {
    const municipalityName = municipality.name;
    
    // Update selected municipalities
    const newSelectedMunicipalities = selectedMunicipalities.includes(municipalityName)
      ? selectedMunicipalities.filter(m => m !== municipalityName)
      : [...selectedMunicipalities, municipalityName];
    
    setSelectedMunicipality(municipalityName);
    onMunicipalityFilter(newSelectedMunicipalities);
  };

  // Handle Skill Selection
  const handleSkillSelect = (skillName: string) => {
    // Update selected skills
    const newSelectedSkills = selectedSkills.includes(skillName)
      ? selectedSkills.filter(s => s !== skillName)
      : [...selectedSkills, skillName];
    
    setSelectedSkill(skillName);
    onSkillFilter(newSelectedSkills);
  };

  // Clear All Filters
  const clearFilters = () => {
    setSelectedMunicipality(null);
    setSelectedSkill(null);
    onMunicipalityFilter([]);
    onSkillFilter([]);
  };

  return (
    <aside className="w-full lg:w-64 bg-purple-50 p-4 rounded-xl space-y-6">
      {/* Municipalities Filter */}
      <div>
        <h3 className="text-purple-900 font-semibold mb-3">Municipalities</h3>
        <div className="w-full">
          <ComboBox 
            onSelectMunicipality={handleMunicipalitySelect} 
            className="w-full" 
          />
        </div>
        {selectedMunicipalities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedMunicipalities.map(municipality => (
              <span 
                key={municipality} 
                className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {municipality}
                <button 
                  onClick={() => handleMunicipalitySelect({ name: municipality, municipalityId: 0 })}
                  className="ml-2 text-purple-600 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Skills Filter */}
      <div>
        <h3 className="text-purple-900 font-semibold mb-3">Skills</h3>
        <div className="w-full">
          <SkillDropdown 
            onSelectSkill={handleSkillSelect} 
          
          />
        </div>
        {selectedSkills.length > 0 && (
          <div className=" mt-2 flex flex-wrap gap-2">
            {selectedSkills.map(skill => (
              <span 
                key={skill} 
                className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {skill}
                <button 
                  onClick={() => handleSkillSelect(skill)}
                  className="ml-2 text-purple-600 hover:text-purple-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {(selectedMunicipalities.length > 0 || selectedSkills.length > 0) && (
        <div className="pt-4 border-t border-purple-200">
          <button
            onClick={clearFilters}
            className="w-full bg-purple-100 text-purple-700 py-2 rounded-full hover:bg-purple-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </aside>
  );
};

export default EmployerFilterSidebar;