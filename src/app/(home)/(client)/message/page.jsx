"use client";

import { ArrowLeft, MessageSquare, MoreVertical, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";

// --- Design Constants (Matching Previous Components) ---
const PRIMARY_COLOR_CLASSES = "bg-blue-500 hover:bg-blue-600"; // For the Send button
const SECONDARY_BG_COLOR = "bg-[#1D1F23]"; // Main panel background (used for headers and sidebars)
const TEXT_ELEMENT_BG = "bg-[#33363D]"; // Input field background, hover states
const APP_BG = "bg-[#12151B]"; // Overall page background (used for the chat history)

// --- Mock Data ---

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "AI Junaid",
    type: "received",
    text: "Hi! I can summarize filings or suggest next steps (general info). What would you like to do?",
    time: "12:38 PM",
  },
  {
    id: 2,
    sender: "You",
    type: "sent",
    text: "I'd like to get a quick summary of my recent case filings.",
    time: "12:38 PM",
  },
  {
    id: 3,
    sender: "AI Junaid",
    type: "received",
    text: "Sure! Please share the case number or title, and I'll provide a quick summary of the recent filings.",
    time: "12:39 PM",
  },
  {
    id: 4,
    sender: "You",
    type: "sent",
    text: "Thanks! I've found your case details. Here's a brief summary of the recent filings and updates.",
    time: "12:40 PM",
  },
  {
    id: 5,
    sender: "AI Junaid",
    type: "received",
    text: "I've processed the information. The key filing was the 'Motion for Summary Judgment' on Monday.",
    time: "12:40 PM",
  },
];

const MOCK_THREADS = [
  {
    id: "thread-1",
    name: "Jane Doe (Client)",
    lastMessage: "Need a quick update on the Johnson case...",
    time: "12:36 PM",
    image: "/images/user.jpg",
    messages: [
      {
        id: 101,
        sender: "You",
        type: "sent",
        text: "Hello Jane, I'll get that update for you shortly.",
        time: "10:00 AM",
      },
      {
        id: 102,
        sender: "Jane Doe",
        type: "received",
        text: "Thanks!",
        time: "10:05 AM",
      },
    ],
  },
  {
    id: "thread-2",
    name: "AI Junaid (Assistant)",
    lastMessage: MOCK_MESSAGES[MOCK_MESSAGES.length - 1].text,
    time: "12:40 PM",
    image: "/images/user.jpg",
    messages: MOCK_MESSAGES, // Use the existing messages for the selected thread
  },
  {
    id: "thread-3",
    name: "Partner Review",
    lastMessage: "Finalizing the draft today.",
    time: "12:00 PM",
    image: "/images/user.jpg",
    messages: [
      {
        id: 201,
        sender: "Partner",
        type: "received",
        text: "Please send the final brief by 4 PM.",
        time: "11:55 AM",
      },
    ],
  },
];

// --- Custom Hooks ---

// Auto-resizes the textarea based on content up to a max height
const useAutoResizeTextarea = (value) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      const minHeight = 42; // Approx 1 row height
      const maxHeight = 5 * 24; // Limit to 5 rows (approx 24px per row height)

      let newHeight = ref.current.scrollHeight;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
      }

      ref.current.style.height = `${Math.max(minHeight, newHeight)}px`;
    }
  }, [value]);

  return ref;
};

// --- Child Components (Unchanged logic, just used in main component) ---

const MessageBubble = ({ message }) => {
  const isSent = message.type === "sent";
  const bubbleClasses = isSent
    ? "bg-blue-600 text-white self-end rounded-br-none"
    : `${SECONDARY_BG_COLOR} text-gray-300 self-start rounded-tl-none`;

  return (
    <div
      className={`flex flex-col p-6 ${isSent ? "items-end" : "items-start"}`}
    >
      <div
        className={`p-3 rounded-xl shadow-md max-w-xs md:max-w-md ${bubbleClasses}`}
      >
        <p className="text-sm">{message.text}</p>
      </div>
      <span className="text-xs text-gray-500 mt-1 mr-1 mb-2">
        {message.time}
      </span>
    </div>
  );
};

const ThreadItem = ({ thread, isSelected, onSelect }) => (
  <div
    className={`flex items-center p-3 cursor-pointer transition duration-200 hover:${TEXT_ELEMENT_BG} border-l-4 ${
      isSelected ? "border-blue-500 bg-[#1A1C20]" : "border-transparent"
    }`}
    onClick={() => onSelect(thread.id)} // Handler to select this thread
  >
    <Image
      src={thread.image}
      height={40}
      width={40}
      alt={thread.name}
      className="w-10 h-10 rounded-full object-cover mr-3"
    />
    <div className="flex-1 min-w-0">
      <p className="text-white font-medium truncate">{thread.name}</p>
      <p className="text-sm text-gray-400 truncate">{thread.lastMessage}</p>
    </div>
    <span className="text-xs text-gray-500 shrink-0 ml-2">{thread.time}</span>
  </div>
);

// --- Main Component ---

export default function MessageBoard() {
  const [currentThreadId, setCurrentThreadId] = useState(MOCK_THREADS[1].id);
  const [inputMessage, setInputMessage] = useState("");
  const [isThreadListVisible, setIsThreadListVisible] = useState(true); // New state for responsiveness
  const messagesEndRef = useRef(null);

  const textareaRef = useAutoResizeTextarea(inputMessage);

  const currentThread = MOCK_THREADS.find((t) => t.id === currentThreadId);
  // Ensure currentMessages is an array even if currentThread is null
  const currentMessages = currentThread ? currentThread.messages : [];

  // Handlers for responsiveness
  const handleSelectThread = useCallback((id) => {
    setCurrentThreadId(id);
    setIsThreadListVisible(false); // Hide list, show chat on small screens
  }, []);

  const handleGoBack = useCallback(() => {
    setIsThreadListVisible(true); // Show list on small screens
  }, []);

  // Scroll to Bottom of Messages on Load and New Message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  /**
   * Handle the "Send" button click or Enter key press.
   */
  const handleSendMessage = () => {
    const text = inputMessage.trim();
    if (text === "") {
      return;
    }

    // --- TEMPORARY MOCK LOGIC (REPLACE WITH API CALL) ---
    const newMessage = {
      id: Date.now(), // Unique ID
      sender: "You",
      type: "sent",
      text: text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    console.log("Simulating sending message:", newMessage);

    // In a real app, you would dispatch this message to update the MOCK_THREADS array
    // Since MOCK_THREADS is constant, we only simulate the send for now.

    setInputMessage("");
    setTimeout(scrollToBottom, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto w-full md:w-11/12 overflow-hidden pt-28">
      <div
        className={`flex h-[calc(100vh-64px)] md:h-[80vh] w-full text-white ${SECONDARY_BG_COLOR} rounded-xl shadow-2xl`}
      >
        <div
          className={`absolute inset-0 md:relative md:w-1/4 md:min-w-[300px] border-r border-gray-700/50 flex flex-col z-10 
                      ${SECONDARY_BG_COLOR}
                      ${isThreadListVisible ? "block" : "hidden md:block"}`}
        >
          <div className="flex items-center justify-start p-4 border-b border-gray-700/50">
            <Link
              href={"/"}
              className={`p-2 rounded-full text-gray-400 hover:text-white transition hidden md:block`}
              aria-label="Go back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <button
              className={`flex items-center ml-0 md:ml-4 px-4 py-2 rounded-lg text-white font-semibold ${PRIMARY_COLOR_CLASSES}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {MOCK_THREADS.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={thread.id === currentThreadId}
                onSelect={handleSelectThread}
              />
            ))}
          </div>
        </div>

        <div
          className={`absolute inset-0 md:relative flex-1 flex flex-col overflow-hidden 
                      ${isThreadListVisible ? "hidden md:flex" : "flex"}`}
        >
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-700/50 ${SECONDARY_BG_COLOR}`}
          >
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGoBack}
                className={`p-2 rounded-full text-gray-400 hover:text-white transition md:hidden`}
                aria-label="Back to threads"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <Image
                src={currentThread?.image || "/images/user.jpg"}
                height={40}
                width={40}
                alt={currentThread?.name || "Selected User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <h2 className="text-lg font-bold">
                {currentThread?.name || "Select a Thread"}
              </h2>
            </div>
            <div>
              <button
                className={`p-2 rounded-full text-gray-400 hover:text-white transition hover:${TEXT_ELEMENT_BG}`}
                aria-label="Options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            className={`flex-1 w-full overflow-y-auto p-2 md:p-6 flex flex-col ${APP_BG}`}
          >
            {currentMessages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`p-3 md:p-4 border-t border-gray-700/50 ${SECONDARY_BG_COLOR}`}
          >
            <div className="flex items-end space-x-3">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the assistant...."
                className={`flex-1 p-3 rounded-lg resize-none text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none ${TEXT_ELEMENT_BG}`}
                rows={1}
                style={{ overflowY: "hidden" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ""}
                className={`p-3 rounded-lg text-white transition duration-300 ${PRIMARY_COLOR_CLASSES} ${
                  inputMessage.trim() === ""
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
