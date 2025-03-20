import axios from "axios";

export const fetchSearchSkills = async (searchParams: string) => {
  if (!searchParams) return []; 

  const { data } = await axios.get(
    `https://localhost:7234/api/Skill/getSkillsBySearchParams?searchParams=${searchParams}`
  );

  return data.data; // Assuming the API returns an array of skills
};

export const fetchAllSkill = async () => {
  const { data } = await axios.get(
    "https://localhost:7234/api/Skill/getAllSkill"
  );

  return data.data;
};

export const postAJob = async (formData: FormData) => {
  const response = await axios.post(
    "https://localhost:7299/api/Job/createjobpost",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log(response);
  return response.data;
};
