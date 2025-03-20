import { useState } from "react";
import { useJobPosts, useDeleteJobPost } from "../../Hooks/Admin/JobPostHooks";
import { JobPost} from "../../Hooks/Admin/JobPostHooks";

const defaultImageUrl = "https://tse4.mm.bing.net/th?id=OIP.cOvSv7Qft0M7GYQHoLPi7AHaEK&pid=Api&P=0&h=180";

const JobPosts: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

  const { data, isLoading, error } = useJobPosts();
  const deleteJobPostMutation = useDeleteJobPost();

  // Ensure jobPosts is always an array
  const jobPosts: JobPost[] = Array.isArray(data) ? data : [];

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error loading job posts</p>;

  const openModal = (job: JobPost) => {
    setSelectedJob(job);
  };

  const closeModal = () => {
    setSelectedJob(null);
  };

  const handleDelete = (jobId: number) => {
    if (window.confirm("Are you sure you want to delete this job post?")) {
      deleteJobPostMutation.mutate(jobId);
    }
  };

  return (
    <div className="p-6 bg-blue-50 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Job Posts</h2>
      <div className="bg-white rounded-md shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="bg-gray-800 px-4 border">Job ID</th>
              <th className="bg-gray-800 px-4 border">Title</th>
              <th className="bg-gray-800 px-4 border">Created At</th>
              <th className="bg-gray-800 px-4 border">Status</th>
              <th className="bg-gray-800 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobPosts.length > 0 ? (
              jobPosts.map((job) => (
                <tr key={job.id} className="border-b hover:bg-blue-50 transition-all duration-300">
                  <td className="py-3 px-4">{job.id}</td>
                  <td className="py-3 px-4">{job.name}</td>
                  <td className="py-3 px-4">{new Date(job.CreateAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{job.Status}</td>
                  <td className="py-3 px-4 flex gap-3">
                    <button
                      onClick={() => openModal(job)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-blue-600"
                    >
                      View More
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-red-600 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No job posts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full h-auto flex flex-col justify-center transform transition-all duration-300 scale-95 hover:scale-100">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Job Details</h3>
            <div className="mb-4 flex justify-center">
              <img
                src={selectedJob.WorkImageUrl || defaultImageUrl}
                alt="Job Post"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            <p className="mb-2"><strong className="text-blue-600">Job ID:</strong> {selectedJob.id}</p>
            <p className="mb-2"><strong className="text-blue-600">Title:</strong> {selectedJob.name}</p>
            <p className="mb-2"><strong className="text-blue-600">Description:</strong> {selectedJob.Description}</p>
            <p className="mb-2"><strong className="text-blue-600">Wage:</strong> ${selectedJob.Wage}</p>
            <p className="mb-2"><strong className="text-blue-600">Start Date:</strong> {new Date(selectedJob.StartDate).toLocaleDateString()}</p>
            <p className="mb-4"><strong className="text-blue-600">Preferred Time:</strong> {selectedJob.PreferredTime}</p>
            <p className="mb-4"><strong className="text-blue-600">Status:</strong> {selectedJob.Status}</p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-lg hover:shadow-xl transition-shadow duration-300 hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPosts;
