import { Search, MapPin, Plus, Bell, MessageSquare} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSkillSearch } from "../../../Hooks/Admin/SkillHooks";
import { useMunicipalitySearch } from "../../../Hooks/Admin/MunicipalityHooks";
import { Link } from "react-router-dom";
import AccounDropdown from "../Dropdown/AccountDropdown";
import { useNavigate } from "react-router-dom";
const UserNavbar = () => {
  var navigate=useNavigate();
  const [formData, setFormData] = useState({ skill: "", muncipality: "" });
  const [debounceSkillSearch, setDebounceSkillSearch] = useState(
    formData.skill
  );
  const [debounceMunicipalitySearch, setDebounceMunicipalitySearch] = useState(
    formData.muncipality
  );
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [showMunicipalityDropdown, setShowMunicipalityDropdown] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSkillSearch(formData.skill);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.skill]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceMunicipalitySearch(formData.muncipality);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.muncipality]);

  const { data: skills = [], isLoading: isSkillLoading } =
    useSkillSearch(debounceSkillSearch);
  const { data: municipalities = [], isLoading: isMunicipalityLoading } =
    useMunicipalitySearch(debounceMunicipalitySearch);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "skill") {
      setShowSkillDropdown(value.length > 0);
    }
    if (name === "muncipality") {
      setShowMunicipalityDropdown(value.length > 0);
    }
  };

  const handleSelectSkill = (skill: string) => {
    setFormData((prev) => ({ ...prev, skill }));
    setShowSkillDropdown(false);
  };

  const handleSelectMunicipality = (muncipality: string) => {
    setFormData((prev) => ({ ...prev, muncipality }));
    setShowMunicipalityDropdown(false);
  };

  return (
    <header className="py-4 px-4 md:px-6 border-b bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
   
        <Link to="/employer/homepage">
          <div className="text-purple-600 font-bold text-xl pointer-cursor">
            Labour Link
          </div>
        </Link>

 
        <div className="flex flex-wrap items-center bg-white border rounded-full px-4 py-2 relative shadow-sm w-full md:w-auto mt-3 md:mt-0">
          <div className="relative flex-1 w-full md:w-auto">
         
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Skill, keyword..."
              className="w-full md:w-[180px] pl-8 pr-3 py-1 outline-none"
              value={formData.skill}
              name="skill"
            
              onChange={handleInputChange}
            />
            {showSkillDropdown && (
              <div className="absolute top-10 left-0 w-full bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {isSkillLoading ? (
                  <div className="p-3 text-gray-500 text-sm">Loading...</div>
                ) : skills.length > 0 ? (
                  skills.map(
                    (skill: { skillId: string; skillName: string }) => (
                      <div
                        key={skill.skillId}
                        className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSelectSkill(skill.skillName)}
                      >
                        {skill.skillName}
                      </div>
                    )
                  )
                ) : (
                  <div className="p-3 text-gray-500 text-sm">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

     
          <div className="h-4 w-px bg-gray-200 mx-2 hidden md:block" />

        
          <div className="relative flex-1 w-full md:w-auto mt-2 md:mt-0">
            <MapPin className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Location"
              className="w-full md:w-[180px] pl-8 pr-3 py-1 outline-none"
              name="muncipality"
              value={formData.muncipality}
             
              onChange={handleInputChange}
            />
            {showMunicipalityDropdown && (
              <div className="absolute top-10 left-0 w-full bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {isMunicipalityLoading ? (
                  <div className="p-3 text-gray-500 text-sm">Loading...</div>
                ) : municipalities.length > 0 ? (
                  municipalities.map(
                    (m: { municipalityId: Int32Array; name: string }) => (
                      <div
                        key={m.name}
                        className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleSelectMunicipality(m.name)}
                      >
                        {m.name}
                      </div>
                    )
                  )
                ) : (
                  <div className="p-3 text-gray-500 text-sm">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>

        
          <button className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm hover:bg-purple-700 transition mt-2 md:mt-0">
            Find Worker
          </button>
        </div>


        <div className="flex items-center space-x-4 mt-3 md:mt-0">
          
            <Plus className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" onClick={()=>navigate("/post-job")}/>
          
          <Bell className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" />
          <MessageSquare className="h-5 w-5 text-gray-600 cursor-pointer hover:text-purple-600" />

       
          <AccounDropdown />
        </div>
      </div>
    </header>
  );
};

export default UserNavbar;
