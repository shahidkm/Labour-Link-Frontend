// import React from "react";
// import { useForm } from "react-hook-form";
// import { FaLock, FaUser, FaKey } from "react-icons/fa";

// type FormData = {
//   email: string;
//   password: string;
// };

// const AdminLogin = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = (data: FormData) => {
//     console.log("Login Data:", data);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] px-4">
//       <img src="/assets/Logo.png" alt="Logo" className="w-24 h-24 mb-6" />

//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-300">
//         <div className="text-center">
//           {/* Lock Icon */}
//           <div className="bg-blue-500 p-3 rounded-full shadow-md inline-block">
//             <FaLock className="text-3xl text-white" />
//           </div>

//           <h1 className="text-2xl font-bold text-gray-800 mt-3">Admin Login</h1>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
//           <div>
//             <div className="relative flex items-center">
//               <FaUser className="absolute left-3 text-gray-500 text-lg" />
//               <input
//                 {...register("email", {
//                   required: "Email is required",
//                   pattern: {
//                     value: /^\S+@\S+\.\S+$/,
//                     message: "Enter a valid email address",
//                   },
//                 })}
//                 type="email"
//                 placeholder="Email"
//                 className="w-full pl-10 pr-4 h-10 border border-gray-300 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
//               />
//             </div>
//             <p className="text-red-500 text-sm h-5">{errors.email?.message}</p>
//           </div>

//           <div>
//             <div className="relative flex items-center">
//               <FaKey className="absolute left-3 text-gray-500 text-lg" />
//               <input
//                 {...register("password", {
//                   required: "Password is required",
//                   pattern: {
//                     value:
//                       /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,15}$/,
//                     message:
//                       "Must have 1 uppercase, 1 lowercase, 1 number, 1 special character, and be 8-15 chars long",
//                   },
//                 })}
//                 type="password"
//                 placeholder="Password"
//                 className="w-full pl-10 pr-4 h-10 border border-gray-300 bg-gray-100 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
//               />
//             </div>
//             <p className="text-red-500 text-sm h-5">
//               {errors.password?.message}
//             </p>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition shadow-md font-medium"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;