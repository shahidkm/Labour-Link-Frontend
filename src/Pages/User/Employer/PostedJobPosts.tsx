import React from "react";
import { useJobs } from "../../../Hooks/User/Employer/PostHooks";
import { Skeleton } from "@mui/material";
import { JobPost } from "../../../Services/User/Employer/PostedJobPosts";
import UserNavbar from "../../../Components/User/UserNavbar/EmployerNavbar";

const PostedJobPosts: React.FC = () => {
  const { data: jobs, isLoading, error } = useJobs();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Job Listings</h2>
        <div className="grid gap-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-52 w-full bg-gray-200 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 font-semibold">Error: {error.message}</p>;
  }

  return (
    <div>
      <UserNavbar />
      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Latest Job Listings</h2>
        {jobs && jobs.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.jobId} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No job listings available.</p>
        )}
      </div>
    </div>
  );
};

interface JobCardProps {
  job: JobPost;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    e.currentTarget.src = "https://tse2.mm.bing.net/th?id=OIP.6L7shpwxVAIr279rA0B1JQHaE7&pid=Api&P=0&h=180";
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-lg">
      <img
        src={job.image}
        alt={job.title}
        className="w-full h-44 object-cover"
        onError={handleImageError}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
        <p className="text-gray-600 text-sm mt-1 truncate">{job.description}</p>
        <p className="text-lg font-semibold text-blue-600 mt-2">${job.wage}/hr</p>
        <p className="text-xs text-gray-500 mt-1">📅 {new Date(job.startDate).toDateString()}</p>
        <p className="text-xs text-gray-500">⏰ {job.prefferedTime}</p>
        <span
          className={`inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full ${
            job.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {job.status}
        </span>
      </div>
    </div>
  );
};

export default PostedJobPosts;
