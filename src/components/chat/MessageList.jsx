import { useEffect, useRef } from "react";

const SECONDARY_BG_COLOR = "bg-[#1D1F23]";

const formatTime = (value) => {
  if (value) return value;
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function MessageList({ messages, loggedUserId }) {
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex-1 w-full overflow-y-auto p-2 md:p-6 flex flex-col bg-BG"
      style={{ maxHeight: "100%", overflowY: "auto" }}
    >
      {messages.map((message) => {
        const isSent = Number(message.sender_id) === Number(loggedUserId);
        const bubbleClasses = isSent
          ? "bg-blue-600 text-white self-end rounded-br-none"
          : `${SECONDARY_BG_COLOR} text-gray-300 self-start rounded-tl-none`;

        return (
          <div
            key={message.id}
            className={`flex flex-col p-6 ${isSent ? "items-end" : "items-start"}`}
          >
            <div className={`p-3 rounded-xl shadow-md max-w-xs md:max-w-md ${bubbleClasses}`}>
              <p className="text-sm">{message.content}</p>
            </div>
            <span className="text-xs text-gray-500 mt-1 mr-1 mb-2">{formatTime(message.time)}</span>
          </div>
        );
      })}
    </div>
  );
}
