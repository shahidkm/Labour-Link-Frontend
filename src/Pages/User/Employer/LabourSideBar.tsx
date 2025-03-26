import React, { useState } from "react";
import { Filter, X } from "lucide-react";
import { useSkillSearch } from "../../../Hooks/Admin/SkillHooks";
import { useMunicipalitySearch } from "../../../Hooks/Admin/MunicipalityHooks";

// Define the interfaces for API data types
interface Skill {
  skillId: string;
  skillName: string;
}

interface Municipality {
  municipalityId: number;
  name: string;
}

interface FilterSidebarProps {
  onFilterApply: (skills: string[], municipalities: string[]) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterApply, 
  isMobile = false,
  onClose
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [municipalitySearch, setMunicipalitySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: skills = [], isLoading: isSkillLoading } = useSkillSearch(skillSearch);
  const { data: municipalities = [], isLoading: isMunicipalityLoading } = useMunicipalitySearch(municipalitySearch);

  const handleSkillSelect = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter(skill => skill !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleMunicipalitySelect = (municipalityName: string) => {
    if (selectedMunicipalities.includes(municipalityName)) {
      setSelectedMunicipalities(selectedMunicipalities.filter(m => m !== municipalityName));
    } else {
      setSelectedMunicipalities([...selectedMunicipalities, municipalityName]);
    }
  };

  const applyFilters = () => {
    setIsLoading(true);
    try {
      // Call the parent component's filter apply function
      onFilterApply(selectedSkills, selectedMunicipalities);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setSelectedMunicipalities([]);
  };

  return (
    <div className={`bg-white rounded-lg shadow ${isMobile ? "p-4" : "p-6"}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Filters</h2>
          <button onClick={onClose} className="text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {!isMobile && (
        <div className="flex items-center mb-6">
          <Filter className="h-5 w-5 text-purple-600 mr-2" />
          <h2 className="text-lg font-medium">Filter Options</h2>
        </div>
      )}

      {/* Skills Section */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Skills</h3>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search skills..."
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
          />
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {selectedSkills.map(skill => (
            <div key={skill} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center">
              {skill}
              <button
                onClick={() => handleSkillSelect(skill)}
                className="ml-1 text-purple-800 hover:text-purple-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="max-h-40 overflow-y-auto border rounded-md">
          {isSkillLoading ? (
            <div className="p-2 text-gray-500 text-sm">Loading...</div>
          ) : skills.length > 0 ? (
            skills.map((skill: Skill) => (
              <div 
                key={skill.skillId}
                className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  selectedSkills.includes(skill.skillName) ? "bg-purple-50" : ""
                }`}
                onClick={() => handleSkillSelect(skill.skillName)}
              >
                {skill.skillName}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm">No skills found</div>
          )}
        </div>
      </div>

      {/* Municipalities Section */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Locations</h3>
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search locations..."
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={municipalitySearch}
            onChange={(e) => setMunicipalitySearch(e.target.value)}
          />
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {selectedMunicipalities.map(municipality => (
            <div key={municipality} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs flex items-center">
              {municipality}
              <button
                onClick={() => handleMunicipalitySelect(municipality)}
                className="ml-1 text-purple-800 hover:text-purple-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        <div className="max-h-40 overflow-y-auto border rounded-md">
          {isMunicipalityLoading ? (
            <div className="p-2 text-gray-500 text-sm">Loading...</div>
          ) : municipalities.length > 0 ? (
            municipalities.map((m: Municipality) => (
              <div 
                key={m.name}
                className={`p-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  selectedMunicipalities.includes(m.name) ? "bg-purple-50" : ""
                }`}
                onClick={() => handleMunicipalitySelect(m.name)}
              >
                {m.name}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500 text-sm">No locations found</div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2">
        <button
          onClick={applyFilters}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-2 rounded-md text-sm hover:bg-purple-700 transition disabled:bg-purple-300"
        >
          {isLoading ? "Applying..." : "Apply Filters"}
        </button>
        <button
          onClick={clearFilters}
          className="w-full border border-purple-600 text-purple-600 py-2 rounded-md text-sm hover:bg-purple-50 transition"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;