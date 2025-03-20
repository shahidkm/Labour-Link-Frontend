// src/components/UpdateJobForm.tsx
import { useState } from "react";
import { useUpdateJob } from "../../../Hooks/User/Employer/PostHooks";
import SkillDropdown from "../../../Components/User/Dropdown/SkillDropDown";
import ComboBox from "../../../Components/User/Dropdown/MuncipalityDropdown";



const UpdateJobPostForm: React.FC = () => {
    const [jobId, setJobId] = useState("");
    const [jobData, setJobData] = useState({
      title: "",
      description: "",
      wage: 0,
      startDate: "",
      prefferedTime: "",
      municipalityId:0,
      skillName1: "",
      skillName2: "",
    });
  
    const { mutate, isSuccess, isError, error } = useUpdateJob();
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setJobData({ ...jobData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!jobId) return alert("Please enter a Job ID!");
      mutate({ jobId, jobData });
    };
  
    return (

      <div>
      
      <div className="max-w-3xl w-full mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Update Job Post
        </h2>
  
        {/* <div className="mb-4">
          <label className="block text-gray-600 font-medium">Job ID:</label>
          <input
            type="text"
            name="jobId"
            placeholder="Enter Job ID"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div> */}
  
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium">Title:</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div>
            <label className="block text-gray-600 font-medium">Wage:</label>
            <input
              type="number"
              name="wage"
              value={jobData.wage}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div className="col-span-2">
            <label className="block text-gray-600 font-medium">Description:</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
            />
          </div>
  
          <div>
            <label className="block text-gray-600 font-medium">Start Date:</label>
            <input
              type="datetime-local"
              name="startDate"
              value={jobData.startDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div>
            <label className="block text-gray-600 font-medium">Preferred Time:</label>
            <input
              type="text"
              name="prefferedTime"
              value={jobData.prefferedTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
  
          <div>
            <label className="block text-gray-600 font-medium">Municipality:</label>
            <ComboBox
              onSelectMunicipality={(value) =>
                setJobData({ ...jobData, municipalityId:value.municipalityId })
              }
            />
          </div>
  
          <div>
            <label className="block text-gray-600 font-medium">Primary Skill:</label>
            <SkillDropdown
              onSelectSkill={(value) =>
                setJobData({ ...jobData, skillName1: value })
              }
            />
          </div>
  
          <div>
            <label className="block text-gray-600 font-medium">Secondary Skill:</label>
            <SkillDropdown
              onSelectSkill={(value) =>
                setJobData({ ...jobData, skillName2: value })
              }
            />
          </div>
  
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Update Job
            </button>
          </div>
        </form>
  
        {isSuccess && <p className="text-green-500 mt-2">Job updated successfully!</p>}
        {isError && <p className="text-red-500 mt-2">Error: {error?.message}</p>}
      </div>
      </div>
    );
  };
  
  export default UpdateJobPostForm;
