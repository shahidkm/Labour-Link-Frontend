import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FootbarComponent from "../../../Components/User/UserFooter/FooterComponent";
import { Star, MapPin } from "lucide-react";
import EmployerNavbar from "../../../Components/User/UserNavbar/EmployerNavbar";
import EmployerFilterSidebar from "./FilterSidebar";
import { useLabourQuery, usePreferredLabourQuery } from "../../../Hooks/User/Employer/LabourDetailsHook";
import { useCreateConversation } from "../../../Hooks/User/Employer/Conversation";
import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";

// Type definitions
interface Notification {
  senderUserId: string;
  senderName: string;
  senderImageUrl: string;
  jobPostId: string;
  message: string;
  notificationType: string;
  isRead: boolean;
}

interface Labour {
  labourId: string;
  userId: string;
  labourName: string;
  profilePhotoUrl?: string;
  rating?: number | string;
  labourPreferredMuncipalities: string[] | string;
  labourSkills: string[] | string;
}

interface LabourCardProps {
  labour: Labour;
  isPreferred?: boolean;
}

const ClientHome: React.FC = () => {
  const { data: allLabours, isLoading: isAllLoading, isError: isAllError } = useLabourQuery();
  const { data: preferredLaboursData, isLoading: isPrefLoading, isError: isPrefError } = usePreferredLabourQuery();
  const navigate = useNavigate();
  const createConversation = useCreateConversation();
  const [messageSent, setMessageSent] = useState<Record<string, boolean>>({});

  // State for filtering
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const isLoading = isAllLoading || isPrefLoading || createConversation.isPending;
  const isError = isAllError || isPrefError;

  useEffect(() => {
    let connection: signalR.HubConnection | null = null;

    const connectSignalR = async () => {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:7024/nothub`, { withCredentials: true })
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        console.log("Connected to SignalR hub");

        // Listen for incoming notifications
        connection.on("ReceiveNotification", (notification: Notification) => {
          console.log("New notification received:", notification);
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={notification.senderImageUrl}
                      alt="Sender"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.senderName}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ));
        });
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    connectSignalR();

    // Clean up on unmount
    return () => {
      if (connection) {
        connection.off("ReceiveNotification");
        connection.stop();
        console.log("SignalR connection stopped");
      }
    };
  }, []);

  if (isLoading && !Object.keys(messageSent).length) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center">Error loading labour data</div>;

  // Ensure preferredLabours is an array
  const preferredLabours = Array.isArray(preferredLaboursData) 
    ? preferredLaboursData 
    : Array.isArray(preferredLaboursData?.data) 
      ? preferredLaboursData.data 
      : [];
  
  // Get IDs of preferred labours to filter them out from all labours
  const preferredIds = new Set(preferredLabours.map(l => l.labourId) || []);
  
  // Filter out preferred labours from all labours to avoid duplication
  const regularLabours = allLabours?.filter(labour => !preferredIds.has(labour.labourId)) || [];

  // Function to handle municipality filter changes
  const handleMunicipalityFilter = (municipalities: string[]) => {
    setSelectedMunicipalities(municipalities);
  };

  // Function to handle skill filter changes
  const handleSkillFilter = (skills: string[]) => {
    setSelectedSkills(skills);
  };

  // Filter labours based on selected municipalities and skills
  const filterLabours = (labours: Labour[]) => {
    return labours.filter(labour => {
      // Check municipality filter
      const municipalityMatch = selectedMunicipalities.length === 0 || 
        (Array.isArray(labour.labourPreferredMuncipalities) 
          ? labour.labourPreferredMuncipalities.some(m => selectedMunicipalities.includes(m))
          : selectedMunicipalities.includes(labour.labourPreferredMuncipalities));

      // Check skills filter
      const skillsMatch = selectedSkills.length === 0 || 
        (Array.isArray(labour.labourSkills) 
          ? labour.labourSkills.some(skill => selectedSkills.includes(skill))
          : selectedSkills.includes(labour.labourSkills));

      return municipalityMatch && skillsMatch;
    });
  };

  // Labour card component
  const LabourCard: React.FC<LabourCardProps> = ({ labour, isPreferred = false }) => {
    const handleViewDetails = () => {
      navigate(`/labour/${labour.labourId}`);
    };

    const handleMessageClick = () => {
      // Check if userId exists before sending message
      if (!labour.userId) {
        console.error("User ID is missing for labour:", labour);
        return;
      }
      
      // Create predefined message with labour name and skill
      const skills = Array.isArray(labour.labourSkills) 
        ? labour.labourSkills.join(', ') 
        : labour.labourSkills || 'your services';
      
      const message = `Hello ${labour.labourName}, I'm interested in discussing ${skills}. Are you available for work?`;
      
      // Send the message using the hook
      createConversation.mutate(
        { 
          user2Id: labour.userId,
          message: message
        },
        {
          onSuccess: () => {
            setMessageSent(prev => ({...prev, [labour.userId]: true}));
          },
          onError: (error) => {
            console.error("Error sending message:", error);
          }
        }
      );
    };

    return (
      <div className="bg-purple-50 rounded-xl p-4 h-[200px] relative shadow-sm hover:shadow-md transition-shadow duration-200">
        {isPreferred && (
          <div className="absolute top-2 right-2">
            {/* Optional preferred badge */}
          </div>
        )}
        <div className="flex items-center space-x-4">
          <img
            src={labour.profilePhotoUrl || "/default-avatar.png"} 
            alt={`${labour.labourName} avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate mb-2 text-purple-900">{labour.labourName}</h3>
             
              <div className="flex items-center shrink-0 ml-2 bg-purple-100 px-2 py-1 rounded-full">
                <span className="mr-1 text-purple-900 text-sm font-medium">{labour.rating || "N/A"}</span>
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1 mb-3">
              <MapPin className="h-4 w-4 text-purple-500 mr-1 shrink-0" />
              <span className="truncate">
                {Array.isArray(labour.labourPreferredMuncipalities) 
                  ? labour.labourPreferredMuncipalities.join(', ') 
                  : labour.labourPreferredMuncipalities || 'Not specified'}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="truncate">
                {Array.isArray(labour.labourSkills) 
                  ? labour.labourSkills.join(', ') 
                  : labour.labourSkills || 'Not specified'}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex flex-wrap gap-3 w-full justify-center">
            <button
              aria-label={`View details of ${labour.labourName}`}
              className="px-4 py-1.5 text-purple-600 border border-purple-600 rounded-full text-sm font-medium transition-colors duration-200 hover:bg-purple-50 flex-1 max-w-[120px]"
              onClick={handleViewDetails}
            >
              View details
            </button>
            <button
              aria-label={`Message ${labour.labourName}`}
              className={`px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm font-medium transition-all duration-200 hover:bg-purple-700 hover:shadow-sm flex-1 max-w-[120px] ${
                messageSent[labour.userId] ? "opacity-85" : ""
              }`}
              onClick={handleMessageClick}
              disabled={messageSent[labour.userId] || createConversation.isPending}
            >
              {messageSent[labour.userId] 
                ? "Message Sent" 
                : createConversation.isPending && createConversation.variables?.user2Id === labour.userId
                  ? "Sending..." 
                  : "Message"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Filter preferred and regular labours
  const filteredPreferredLabours = filterLabours(preferredLabours);
  const filteredRegularLabours = filterLabours(regularLabours);

  return (
    <div className="min-h-screen bg-white">
      <EmployerNavbar />
      <main className="max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <EmployerFilterSidebar 
            onMunicipalityFilter={handleMunicipalityFilter}
            onSkillFilter={handleSkillFilter}
            selectedMunicipalities={selectedMunicipalities}
            selectedSkills={selectedSkills}
          />
          <div className="flex-1">
            {filteredPreferredLabours.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-medium text-purple-900 mb-4">Preferred Labourers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPreferredLabours.map((labour) => (
                    <LabourCard key={`preferred-${labour.labourId}`} labour={labour} isPreferred={true} />
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h2 className="text-lg font-medium text-purple-900 mb-4">
                {filteredRegularLabours.length > 0 ? 'Available Labourers' : 'No Labourers Match Your Filters'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRegularLabours.map((labour) => (
                  <LabourCard key={`regular-${labour.labourId}`} labour={labour} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <FootbarComponent />
    </div>
  );
};

export default ClientHome;