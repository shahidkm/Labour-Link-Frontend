// import React, { useState } from "react";
// import { useFetchClientJobPosts, useFetchJobPostByTitle } from "../../../Hooks/User/Labour/JobPostHooks";
// import { FaBriefcase, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

// const JobListPage = () => {
//   const { data: jobPosts, isLoading, error } = useFetchClientJobPosts();
//   const [searchTitle, setSearchTitle] = useState("");
//   const [jobTitleInput, setJobTitleInput] = useState("");
//   const [locationInput, setLocationInput] = useState("");
//   const [selectedJobTitles, setSelectedJobTitles] = useState<string[]>([]);
//   const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

//   // Fetch jobs by title
//   const { data: searchedJobs } = useFetchJobPostByTitle(searchTitle);

//   if (isLoading) return <p className="text-center text-purple-600">Loading jobs...</p>;
//   if (error) return <p className="text-center text-red-500">Error loading jobs</p>;

//   // Handle adding job titles (max 3)
//   const handleAddJobTitle = (value: string) => {
//     if (!value.trim()) return;
//     setSelectedJobTitles((prev) => [...new Set([...prev, value])].slice(-3));
//     setJobTitleInput("");
//   };

//   // Handle adding locations (max 3)
//   const handleAddLocation = (value: string) => {
//     if (!value.trim()) return;
//     setSelectedLocations((prev) => [...new Set([...prev, value])].slice(-3));
//     setLocationInput("");
//   };

//   // Determine displayed jobs
//   const jobsToDisplay = searchTitle ? searchedJobs : jobPosts;

//   // Apply sidebar filters
//   const filteredJobs = jobsToDisplay?.filter((job) => {
//     const matchesTitle = selectedJobTitles.length === 0 || selectedJobTitles.includes(job.title);
//     const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(job.muncipalityId.toString());
//     return matchesTitle && matchesLocation;
//   });

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* 🔹 Navbar with Search */}
//       <nav className="bg-white p-4 shadow-md flex justify-between items-center rounded-lg">
//         <h1 className="text-purple-600 text-3xl font-bold">Labour Link</h1>
//         <div className="relative w-1/3">
//           <input
//             type="text"
//             placeholder="Search Jobs by Title..."
//             className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-purple-300"
//             value={searchTitle}
//             onChange={(e) => setSearchTitle(e.target.value)}
//           />
//           <FaSearch className="absolute left-3 top-3 text-gray-500" />
//         </div>
//       </nav>

//       <div className="flex gap-6 mt-6 flex-col md:flex-row">
//         {/* 🔹 Sidebar Filters */}
//         <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow-md">
//           <h2 className="font-semibold text-lg text-purple-700">Filter by</h2>
          
//           {/* Job Title Filter */}
//           <div className="mt-4">
//             <h3 className="font-semibold">Job Title</h3>
//             <input
//               type="text"
//               value={jobTitleInput}
//               onChange={(e) => setJobTitleInput(e.target.value)}
//               placeholder="Add Job Title"
//               className="w-full p-2 border rounded-lg mb-2 focus:ring focus:ring-purple-300"
//             />
//             <button
//               onClick={() => handleAddJobTitle(jobTitleInput)}
//               className="w-full bg-purple-500 text-white py-1 rounded-lg hover:bg-purple-600 transition"
//             >
//               Add
//             </button>
//             {selectedJobTitles.map((title) => (
//               <label key={title} className="flex items-center gap-2 mt-2">
//                 <input
//                   type="checkbox"
//                   checked={selectedJobTitles.includes(title)}
//                   onChange={() =>
//                     setSelectedJobTitles((prev) =>
//                       prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
//                     )
//                   }
//                 />
//                 {title}
//               </label>
//             ))}
//           </div>

//           {/* Location Filter */}
//           <div className="mt-4">
//             <h3 className="font-semibold">Location</h3>
//             <input
//               type="text"
//               value={locationInput}
//               onChange={(e) => setLocationInput(e.target.value)}
//               placeholder="Add Location"
//               className="w-full p-2 border rounded-lg mb-2 focus:ring focus:ring-purple-300"
//             />
//             <button
//               onClick={() => handleAddLocation(locationInput)}
//               className="w-full bg-purple-500 text-white py-1 rounded-lg hover:bg-purple-600 transition"
//             >
//               Add
//             </button>
//             {selectedLocations.map((loc) => (
//               <label key={loc} className="flex items-center gap-2 mt-2">
//                 <input
//                   type="checkbox"
//                   checked={selectedLocations.includes(loc)}
//                   onChange={() =>
//                     setSelectedLocations((prev) =>
//                       prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
//                     )
//                   }
//                 />
//                 {loc}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* 🔹 Job Listings */}
//         <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredJobs?.map((job) => (
//             <div key={job.jobId} className="bg-purple-100 p-4 rounded-lg shadow-md hover:shadow-lg transition">
//               <div className="flex items-center gap-2 text-purple-700 font-bold">
//                 <FaBriefcase />
//                 {job.title}
//               </div>
//               <div className="flex items-center gap-2 text-gray-600">
//                 <FaMapMarkerAlt />
//                 {job.muncipalityId}
//               </div>
//               <p className="text-green-600 font-semibold">₹ {job.wage}/day</p>
//               <p className="text-gray-500">{job.preferredTime}</p>
//               <p className="text-gray-500">Posted on Sun May 12 2025</p>
//               <div className="mt-3 flex gap-2">
//                 <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">
//                   View Details
//                 </button>
//                 <button className="px-4 py-2 bg-purple-300 text-purple-800 rounded-lg hover:bg-purple-400 transition">
//                   Interested
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobListPage;
