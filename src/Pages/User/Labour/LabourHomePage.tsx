// import React from "react";
// import { useFetchClientJobPosts } from "../../../Hooks/User/Labour/JobPostHooks";
// import { FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { JobPosts } from "../../../Services/User/Labour/JobPostsServices";

// const LabourHomePage: React.FC = () => {
//   const { data: jobPosts, isLoading, error } = useFetchClientJobPosts();
//   const navigate = useNavigate();

//   if (isLoading) return <p className="text-center text-purple-600">Loading jobs...</p>;
//   if (error) return <p className="text-center text-red-500">Error loading jobs</p>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {jobPosts?.map((job: JobPosts) => (
//           <div key={job.jobId} className="bg-purple-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
//             {/* Job Title */}
//             <div className="flex items-center gap-2 text-purple-700 font-bold text-lg">
//               <FaBriefcase />
//               {job.title}
//             </div>

//             {/* Job Location */}
//             <div className="flex items-center gap-2 text-gray-600 mt-1">
//               <FaMapMarkerAlt />
//               <span>{job.muncipalityName || "Location not provided"}</span>
//             </div>

//             {/* Wage & Preferred Time */}
//             <div className="flex justify-between items-center mt-3">
//               <div className="bg-green-300 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold w-1/2 text-center">
//                 ₹ {job.wage} / day
//               </div>
//               <div className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg text-sm font-semibold w-1/2 text-center">
//                 {job.preferredTime || "Time not specified"}
//               </div>
//             </div>

//             {/* Posted Date */}
//             <p className="text-gray-500 text-sm mt-2">
//               Posted on {job.startDate ? new Date(job.startDate).toDateString() : "Unknown Date"}
//             </p>

//             {/* Action Buttons */}
//             <div className="mt-4 flex gap-3">
//               <button
//                 onClick={() => navigate(`/job/${job.jobId}`)}
//                 className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition"
//               >
//                 View Details
//               </button>
//               <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
//                 Interested
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default LabourHomePage;
