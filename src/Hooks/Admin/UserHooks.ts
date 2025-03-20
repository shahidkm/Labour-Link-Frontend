import { useQuery } from "@tanstack/react-query";
import { fetchUsers,fetchUsersbyId } from "../../Services/Admin/UserServices";


// interface User {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   active: boolean;
//   createdAt:Date;
//   profileCompleted:boolean;
//   isActive:boolean;
//   userType:string;
// }






export const useUsers = () => {
  return useQuery({
    queryKey: ["users"], 
    queryFn: () => fetchUsers(),

  });
};


export const useUserId=(UserId:number)=>{
    return useQuery({
queryKey:["users",UserId],
queryFn:()=>fetchUsersbyId(UserId),
enabled:!!UserId
    })
}