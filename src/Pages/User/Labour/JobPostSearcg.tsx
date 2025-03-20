import React, { useState } from "react";
import { useFetchJobPostByTitle } from "../../../Hooks/User/Labour/JobPostHooks";
import Navbar from "../../../Components/User/Navbar";
import { JobPosts } from "../../../Services/User/Labour/JobPostsServices";
const JobPostSearch: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState<string>("");
  
  const { data, isLoading, isError, error } = useFetchJobPostByTitle(searchTitle);

  return (
    <div>
      {/* Navbar Component */}
      <Navbar searchTitle={searchTitle} setSearchTitle={setSearchTitle} />
      
      {/* Search Results */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search Jobs by Title..."
          className="w-full p-2 pl-10 border rounded-lg focus:ring focus:ring-purple-300"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />

        {/* Loading state */}
        {isLoading && <p>Loading job posts...</p>}

        {/* Error state */}
        {isError && <p>Error loading job posts: {error instanceof Error ? error.message : "Unknown error"}</p>}

        {/* No results found */}
        {searchTitle && !isLoading && !data?.length && <p>No job posts found for "{searchTitle}"</p>}

        {/* Display job posts */}
        {data && data.length > 0 && (
          <ul>
            {data.map((jobPost:JobPosts) => (
              <li key={jobPost.jobId} className="border p-4 mb-4">
                <h3 className="text-lg font-semibold">{jobPost.title}</h3>
                <p>{jobPost.description}</p>
                {/* Add more details as needed */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JobPostSearch;
