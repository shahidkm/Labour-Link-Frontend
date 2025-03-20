import axios from "axios";

interface Municipality {
  municipalityId: number;
  name: string;
  state?: string;
  isActive: boolean;
}

export const fetchMunicipalities = async (
  page: number,
  limit: number
): Promise<Municipality[]> => {
  const { data } = await axios.get(
    `https://localhost:7234/api/Muncipality/muncipalities?_page=${page}&_limit=${limit}`
  );
  // console.log(data);
  
  return data.data; 
};

export const addMunicipality = async (newMunicipality: {
  name: string;
  state: string;
}) => {
  const { data } = await axios.post<Municipality>(
    "https://localhost:7234/api/Muncipality/addmuncipality",
    newMunicipality
  );
  return data;
};

export const deleteMuncipality = async (Id: number) => {
  await axios.delete(
    `https://localhost:7234/api/Muncipality/deletemuncipality${Id}`
  );
  return Id;
};

export const fetchAllMuncipality = async () => {
  const { data } = await axios.get(
    "https://localhost:7234/api/Muncipality/muncipalities",
    { withCredentials: true } // This is crucial for sending cookies/authorization headers
  );
  console.log(data);

  return data.data;
};



// export const editMunicipality = async ({ Id:number, name:string, region }) => {
//   const response = await axios.put(`${API_URL}/EditMunicipality/${id}`, { name, region });
//   return response.data;
// };

// ✅ Fetch municipalities by state with pagination
export const fetchMunicipalitiesByState = async (
  state: string,
  page: number,
  pageSize: number
): Promise<{ data: Municipality[]; totalPages: number }> => {
  const response = await axios.get<{ data: Municipality[]; totalPages: number }>(
    `https://localhost:7234/api/Muncipality/muncipalities${state}?page=${page}&pageSize=${pageSize}`
  );
  return response.data;
};