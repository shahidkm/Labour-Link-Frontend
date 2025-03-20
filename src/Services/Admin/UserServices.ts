import axios from "axios";


interface User {
  phoneNumber: string;
  labourName: string;
  labourId: string;
  name: string;
}


export const fetchUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(
  "https://localhost:7202/api/Labour/all/lLabours"
  );
  console.log(data)
  return data;
};


export const fetchUsersbyId = async (UserId: number): Promise<User[]> => {
    const { data } = await axios.get<User[]>(
      `https://jsonplaceholder.typicode.com/users?UserId=${UserId}`
    );
    return data;
  };