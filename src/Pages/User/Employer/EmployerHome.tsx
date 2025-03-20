import React from "react";
import { useNavigate } from "react-router-dom";
import FootbarComponent from "../../../Components/User/UserFooter/FooterComponent";
import { Star, MapPin } from "lucide-react";
import EmployerNavbar from "../../../Components/User/UserNavbar/EmployerNavbar";
import EmployerSkillSideBar from "../../../Components/User/UserNavbar/EmployerSkillSideBar";
import { useLabourQuery } from "../../../Hooks/User/Employer/LabourDetailsHook";
import { Labour } from "../../../Services/User/Employer/LaboursServices";

const ClientHome: React.FC = () => {
  const { data: labours, isLoading, isError } = useLabourQuery();
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading labour data</div>;

  const handleViewDetails = (labourId: string) => {
    navigate(`/labour/${labourId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <EmployerNavbar />
      <main className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <EmployerSkillSideBar />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {labours?.map((labour: Labour) => (
              <div key={labour.labourId} className="bg-purple-50 rounded-xl p-4 h-[200px]">
                <div className="flex items-center space-x-4">
                  <img
                    src={labour.profilePhotoUrl || "/default-avatar.png"} 
                    alt={`${labour.labourName} avatar`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate mb-2">{labour.labourName}</h3>
                      <div className="flex items-center shrink-0 ml-2">
                        <span className="mr-1">{labour.rating || "N/A"}</span>
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1 mb-3">
                      <MapPin className="h-4 w-4 text-gray-600 mr-1 shrink-0" />
                      <span className="truncate">{labour.labourPreferredMuncipalities}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span className="truncate">{labour.labourSkills || "Not specified"}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2 mt-3 flex justify-center">
                    <button
                      aria-label={`View details of ${labour.labourName}`}
                      className="px-4 py-1 text-purple-600 border border-purple-600 rounded-full text-sm"
                      onClick={() => handleViewDetails(labour.labourId)}
                    >
                      View details
                    </button>
                    <button
                      aria-label={`Message ${labour.labourName}`}
                      className="px-4 py-1 bg-purple-600 text-white rounded-full text-sm"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <FootbarComponent />
    </div>
  );
};

export default ClientHome;
