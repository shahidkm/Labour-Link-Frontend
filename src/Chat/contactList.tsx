import React, { useState } from "react";
// import axios from "axios";

interface ConversationViewDto {
  id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  profilePhotoUrl?: string;
  lastMessage: string;
  lastUpdated: string;
  isBlocked: boolean;
  blockedByUserId?: string;
}

interface ContactsListProps {
  selectedContactId: string;
  onContactSelect: (contactId: string, contactUserName: string) => void;

  contacts: ConversationViewDto[];
  // apiUrl: string;
}

const ContactsList: React.FC<ContactsListProps> = ({
  selectedContactId,
  onContactSelect,
  contacts,
  // apiUrl,
}) => {
  // const [contacts, setContacts] = useState<ConversationViewDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch contacts when component mounts
  // useEffect(() => {
  //   fetchContacts();

  //   // Set up periodic refresh (every 30 seconds)
  //   const intervalId = setInterval(fetchContacts, 30000);

  //   return () => clearInterval(intervalId);
  // }, [apiUrl]);

  // // Fetch contacts list
  // const fetchContacts = async () => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/Getuserconversation`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //       },
  //     });
  //     console.log(response);
  //     setContacts(response.data.data);
  //   } catch (err) {
  //     console.error("Error fetching contacts:", err);
  //   }
  // };

  // Format date for contact list
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  // Filter contacts based on search query
  const filteredContacts = contacts.filter((contact) =>
    contact.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-200 rounded-full outline-none text-sm"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`flex items-center p-3 cursor-pointer border-b border-gray-100 hover:bg-gray-100 transition-colors ${
              selectedContactId === contact.userId ? "bg-purple-50" : ""
            }`}
            onClick={() => onContactSelect(contact.userId, contact.fullName)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              {contact.profilePhotoUrl ? (
                <img
                  src={contact.profilePhotoUrl}
                  alt={contact.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                  {contact.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{contact.fullName}</div>
              <div className="text-sm text-gray-500 truncate">
                {contact.lastMessage}
              </div>
            </div>
            <div className="text-xs text-gray-500 ml-2 min-w-[55px] text-right">
              {formatDate(contact.lastUpdated)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsList;
