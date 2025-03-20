import React, { useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import axios from "axios";
import ContactsList from "./contactList";

interface ChatMessage {
  messageId?: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isYouSender?: boolean;
}

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

const NewChat: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [contacts, setContacts] = useState<ConversationViewDto[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [reciverName, setRecieverName] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // URLs for different services
  const SIGNALR_URL = "https://localhost:7160/chatHub";
  const CONVERSATION_API_URL = "https://localhost:7202/api/Conversation";
  const CHAT_HISTORY_URL = "https://localhost:7160/chatmessage/history";

  // Get current user ID from localStorage or your auth system
  const currentUserId = localStorage.getItem("userId") || "";

  const updateContactLastMessage = (
    contactId: string,
    lastMsg: string,
    timestamp: string
  ) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) => {
        if (contact.userId === contactId || contact.userId === receiverId) {
          return {
            ...contact,
            lastMessage: lastMsg,
            lastUpdated: timestamp,
          };
        }
        return contact;
      })
    );
  };

  // Connect to SignalR
  useEffect(() => {
    if (!receiverId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_URL, {
        // accessTokenFactory: () => localStorage.getItem("accessToken") || "",
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => console.log("Connected to SignalR!"))
      .catch((err) => console.error("Error connecting to SignalR:", err));

    newConnection.on(
      "ReceiveMessage",
      (senderId: string, receivedMessage: string) => {
        const newMessage: ChatMessage = {
          senderId,
          receiverId: currentUserId,
          message: receivedMessage,
          timestamp: new Date().toISOString(),
          isYouSender: false,
        };

        // Only add message if it's from the selected contact or to the selected contact
        if (
          senderId === receiverId ||
          (senderId === currentUserId && receiverId === receiverId)
        ) {
          setMessages((prev) => [...prev, newMessage]);
          updateContactLastMessage(
            receiverId,
            message,
            new Date().toISOString()
          );

          scrollToBottom();
        }
      }
    );

    setConnection(newConnection);

    return () => {
      if (
        newConnection &&
        newConnection.state === signalR.HubConnectionState.Connected
      ) {
        newConnection.stop();
      }
    };
  }, [receiverId, currentUserId]);

  useEffect(() => {
    fetchContacts();

    // Set up periodic refresh (every 30 seconds)
    const intervalId = setInterval(fetchContacts, 30000);

    return () => clearInterval(intervalId);
  }, [CONVERSATION_API_URL]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(
        `${CONVERSATION_API_URL}/Getuserconversation`,
        { withCredentials: true }
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        //   },
        // }
      );
      console.log(response);
      setContacts(response.data.data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle contact selection
  const handleContactSelect = async (
    contactUserId: string,
    contactUserName: string
  ) => {
    setReceiverId(contactUserId);
    setRecieverName(contactUserName);
    loadChatHistory(contactUserId);
  };

  // Load chat history when selecting a contact
  const loadChatHistory = async (contactUserId: string) => {
    setLoading(true);

    try {
      console.log(contactUserId);
      const response = await axios.get(
        `${CHAT_HISTORY_URL}?reciverId=${contactUserId}`,
        {
          withCredentials: true,
        }
      );
      setMessages(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading chat history:", err);
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!connection || !receiverId || !message.trim()) return;

    try {
      // Send via SignalR
      await connection.invoke("SendMessage", receiverId, message);

      // Add to local messages
      const newMessage: ChatMessage = {
        senderId: currentUserId,
        receiverId: receiverId,
        message: message,
        timestamp: new Date().toISOString(),
        isYouSender: true,
      };
      setMessages((prev) => [...prev, newMessage]);

      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex w-full h-screen overflow-hidden font-sans">
      <ContactsList
        selectedContactId={receiverId}
        onContactSelect={handleContactSelect}
        contacts={contacts}
      />

      <div className="flex flex-col flex-1 bg-white">
        {receiverId ? (
          <>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="m-0 text-base font-medium">{reciverName}</h3>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {loading ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Loading messages...
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isSentByMe =
                      msg.isYouSender !== undefined
                        ? msg.isYouSender
                        : msg.senderId === currentUserId;

                    return (
                      <div
                        key={msg.messageId || index}
                        className={`flex ${
                          isSentByMe ? "justify-end" : "justify-start"
                        } mb-3`}
                      >
                        <div
                          className={`
                            inline-block px-3 py-2 rounded-lg max-w-xs
                            ${
                              isSentByMe
                                ? "bg-purple-600 text-white rounded-br-sm"
                                : "bg-white text-gray-800 rounded-bl-sm"
                            }
                          `}
                        >
                          <p className="m-0 break-words">{msg.message}</p>
                          <p className="text-xs mt-1 text-right opacity-80">
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="flex px-4 py-3 border-t border-gray-200">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none"
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-5 py-2 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500 bg-gray-50">
            <p>Select a contact to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewChat;
