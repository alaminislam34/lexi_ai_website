"use client";

import { Send } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";

const SECONDARY_BG = "bg-secondary";
const PRIMARY_BG = "bg-primary";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "Casezy Assistant",
    type: "received",
    text: "Hi! I'm Casezy Assistant. I can summarize filings or suggest next steps. What would you like to ask today?",
  },
  {
    id: 2,
    sender: "You",
    type: "sent",
    text: "I'd like to get a quick summary of my recent case filings.",
  },
  {
    id: 3,
    sender: "Casezy Assistant",
    type: "received",
    text: "Got it. Which case are you referring to? (Demo message)",
  },
  {
    id: 4,
    sender: "You",
    type: "sent",
    text: "The Johnson V. Smith case, filed last Monday.",
  },
  {
    id: 5,
    sender: "Casezy Assistant",
    type: "received",
    text: "Understood. The primary recent filing was the 'Motion to Dismiss'. (Demo message)",
  },
  {
    id: 6,
    sender: "You",
    type: "sent",
    text: "Thank you. What's the next recommended action?",
  },
];

const useAutoResizeTextarea = (value) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      const minHeight = 42;
      const maxHeight = 5 * 24;

      let newHeight = ref.current.scrollHeight;

      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        ref.current.style.overflowY = "auto";
      } else {
        ref.current.style.overflowY = "hidden";
      }

      ref.current.style.height = `${Math.max(minHeight, newHeight)}px`;
    }
  }, [value]);

  return ref;
};

const MessageBubble = ({ message }) => {
  const isSent = message.type === "sent";
  const bubbleClasses = isSent
    ? `${PRIMARY_BG} text-white`
    : `${SECONDARY_BG} text-wrap`;

  const alignmentClasses = isSent
    ? "flex justify-end text-left"
    : "flex items-start text-left";

  return (
    <div className={alignmentClasses}>
         
      <p
        className={`rounded-lg py-2 px-3 max-w-11/12 sm:max-w-9/12 md:max-w-7/12 ${bubbleClasses}`}
      >
                {message.text}   
      </p>
       
    </div>
  );
};

export default function Ask_Casezy_Attorney() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const textareaRef = useAutoResizeTextarea(inputMessage);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendDemoReply = useCallback(() => {
    const newReply = {
      id: Date.now() + 1,
      sender: "Casezy Assistant",
      type: "received",
      text: "This is a demo reply from the assistant. Your API integration will replace this function. I suggest summarizing the 'Motion for Summary Judgment' filed last week.",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, newReply]);
    }, 500);
  }, []);

  const handleSendMessage = useCallback(() => {
    const text = inputMessage.trim();
    if (text === "") return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      type: "sent",
      text: text,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    sendDemoReply();
  }, [inputMessage, sendDemoReply]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto w-11/12 mt-28 text-white ">
      <div className="flex flex-col h-[85vh] ">
        <div className="pb-4 shrink-0 mb-4">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold">Casezy Assistant</p>
        </div>
        <div
          // ref={messagesEndRef}
          style={{ maxHeight: "100%", overflowY: "auto" }}
          className="flex-1 overflow-y-auto space-y-4 no-scrollbar"
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
               
        </div>
        <div
          className={`flex items-center p-4 sm:p-6 rounded-xl bg-secondary border border-white`}
        >
             
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the assistant...."
            className={`flex-1 py-3 w-full inline-block px-6 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-BG resize-none`}
            rows={1}
            style={{ overflowY: "hidden" }}
          />
                 
          <button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === ""}
            className={`py-3 px-6 max-w-[100px] flex items-center justify-center rounded-lg text-white bg-primary ${
              inputMessage.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Send />
          </button>
               
        </div>
      </div>
    </div>
  );
}
