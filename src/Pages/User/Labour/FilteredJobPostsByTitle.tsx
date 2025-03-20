// import React, { useState } from "react";
// import { MdWork, MdLocationOn } from "react-icons/md";
// import { useFetchJobPostByTitle } from "../../../Hooks/User/JobPostHooks";
// import { useNavigate } from "react-router-dom";

// const FilteredJobPostCard: React.FC = () => {
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const postsPerPage = 4;

//   // Fetching Job Posts by Title with Pagination
//   const { data, isLoading, error } = useFetchJobPostByTitle(title, currentPage, postsPerPage);

//   const jobPosts = data?.posts || [];
//   const totalPosts = data?.totalCount || 0;
//   const totalPages = Math.ceil(totalPosts / postsPerPage);

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//     }
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center">
//       {/* Search Input */}
//       <input
//         type="text"
//         placeholder="Search by Title"
//         value={title}
//         onChange={(e) => {
//           setTitle(e.target.value);
//           setCurrentPage(1); // Reset to first page on search
//         }}
//         className="border p-2 rounded-lg w-full mb-4"
//       />

//       {isLoading && <div>Loading...</div>}
//       {error && <div>Error loading posts!</div>}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {jobPosts.length > 0 ? (
//           jobPosts.map((post: any) => (
//             <div
//               key={post.JobId}
//               className="w-[280px] bg-[#f5efff] border rounded-lg p-4 shadow-lg"
//             >
//               <div className="flex items-center">
//                 <MdWork className="text-[#4b2065] mr-2 text-xl" />
//                 <h1 className="text-lg font-bold text-[#4b2065]">
//                   {post.Title || "Job Title"}
//                 </h1>
//               </div>

//               <div className="mt-1 flex items-center">
//                 <MdLocationOn className="text-[#4b2065] mr-1 text-lg" />
//                 <h2 className="text-sm text-[#4b2065]">
//                   {post.Location || "Location"}
//                 </h2>
//               </div>

//               <div className="flex items-center mt-3 space-x-2">
//                 <div className="w-[90px] h-[22px] bg-green-500 text-white rounded-lg flex items-center justify-center">
//                   <p className="text-xs">Rs {post.Wage}/ day</p>
//                 </div>
//                 <div className="w-[90px] h-[22px] bg-gray-300 text-gray-700 rounded-lg flex items-center justify-center">
//                   <p className="text-xs">{post.PreferredTime}</p>
//                 </div>
//               </div>

//               <div className="mt-1 text-xs flex items-center text-gray-500">
//                 <span className="w-[8px] h-[8px] bg-green-500 rounded-full mr-1"></span>
//                 Posted on {post.CreateAt}
//               </div>

//               <div className="mt-3 flex justify-between">
//                 <button
//                   onClick={() => navigate(`/post/${post.JobId}`)}
//                   className="bg-[#d6b1ff] hover:bg-[#b789ff] text-[#4b2065] font-semibold py-1 px-3 rounded-lg text-xs"
//                 >
//                   View details
//                 </button>
//                 <button className="bg-[#ae55f9] hover:bg-[#8e42c7] text-white font-semibold py-1 px-3 rounded-lg text-xs">
//                   Interested
//                 </button>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div>No job posts found.</div>
//         )}
//       </div>

//       {/* Pagination Controls */}
//       <div className="mt-4 flex space-x-4">
//         <button
//           onClick={goToPreviousPage}
//           disabled={currentPage === 1}
//           className={`px-4 py-2 rounded-lg ${
//             currentPage === 1
//               ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//               : "bg-[#d6b1ff] hover:bg-[#b789ff] text-[#4b2065]"
//           }`}
//         >
//           Previous
//         </button>
//         <span className="text-[#4b2065] font-bold">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={goToNextPage}
//           disabled={currentPage === totalPages}
//           className={`px-4 py-2 rounded-lg ${
//             currentPage === totalPages
//               ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//               : "bg-[#d6b1ff] hover:bg-[#b789ff] text-[#4b2065]"
//           }`}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FilteredJobPostCard;
