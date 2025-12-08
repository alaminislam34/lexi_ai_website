// src/components/MessageAndReceived.jsx
"use client";

import React from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { BiMessageAltDetail } from "react-icons/bi";

const PRIMARY_COLOR_CLASSES = "bg-blue-600 hover:bg-blue-700";
const SECONDARY_BG_COLOR = "bg-[#1D1F23]";
const TEXT_ELEMENT_BG = "bg-[#33363D]";

const MOCK_MESSAGES = [
  {
    id: 1,
    name: "Al Junaid",
    lastMessage: "something...",
    time: "12:36 PM",
    image: "/images/user.jpg", // Replace with actual path
    unread: true,
  },
  {
    id: 2,
    name: "Eleena",
    lastMessage: "something...",
    time: "12:36 PM",
    image: "/images/user.jpg", // Replace with actual path
    unread: true,
  },
];

const MOCK_QUOTES = [
  {
    id: 101,
    lawyerName: "Michael Smith",
    firm: "Doe Law PLLC",
    location: "Detroit, MI",
    budget: "$500",
    image: "/images/user.jpg",
  },
  {
    id: 102,
    lawyerName: "Michael Smith",
    firm: "Doe Law PLLC",
    location: "Detroit, MI",
    budget: "$500",
    image: "/images/user.jpg",
  },
  {
    id: 103,
    lawyerName: "Michael Smith",
    firm: "Doe Law PLLC",
    location: "Detroit, MI",
    budget: "$500",
    image: "/images/user.jpg",
  },
];

const MessageItem = ({ message }) => (
  <div
    className={`flex items-center p-4 shadow-[1px_1px_5px_0px_rgb(0,0,0,0.3)] hover:shadow-[1px_1px_5px_0px_rgb(0,0,0,0.6)] hover:bg-element transition duration-200 cursor-pointer ${
      message.unread ? "" : `hover:${TEXT_ELEMENT_BG}`
    }`}
  >
    {message.unread && (
      <span className="w-2 h-2 rounded-full bg-blue-500 mr-3 shrink-0" />
    )}

    <Image
      src={message.image}
      height={40}
      width={40}
      alt={message.name}
      className="w-10 h-10 rounded-full object-cover mr-3"
    />

    <div className="flex-1 min-w-0">
      <p className="text-white font-medium truncate">{message.name}</p>
      <p className="text-sm text-gray-400 truncate">{message.lastMessage}</p>
    </div>

    <div className="flex items-center space-x-2 shrink-0 ml-2">
      <span className="text-sm text-gray-500">{message.time}</span>
      <button
        className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-gray-700/50"
        aria-label="Options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const QuoteCard = ({ quote }) => (
  <div
    className={`p-4 rounded-xl hover:shadow-[2px_2px_6px_0px_rgb(255,255,255,0.1)] duration-300 bg-[#212121] border border-gray/20`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <Image
          src={quote.image}
          height={50}
          width={50}
          alt={quote.lawyerName}
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="text-white font-semibold text-lg truncate">
            {quote.lawyerName}
          </p>
          <p className="text-sm text-gray-400 truncate">
            {quote.firm} &bull; {quote.location}
          </p>
        </div>
      </div>

      <div
        className={`px-4 py-2 rounded-lg text-gray text-sm border border-gray-700/50`}
      >
        Budget
        <span className="block text-center mt-0.5">
          {quote.budget}
        </span>
      </div>
    </div>

    <button
      className={`w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${PRIMARY_COLOR_CLASSES}`}
    >
      View Details
    </button>
  </div>
);

export default function MessageAndReceived() {
  const totalUnread = MOCK_MESSAGES.filter((m) => m.unread).length;

  return (
    <div className={`min-h-screen text-white`}>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className={`rounded-xl overflow-hidden bg-secondary p-6`}>
          <div className="flex items-center p-5 border-b border-gray-700/50">
            <BiMessageAltDetail className="w-6 h-6 mr-3 text-blue-500" />
            <h2 className="text-xl font-bold">Messages</h2>
          </div>

          <div className="p-4 font-medium">
            You have{" "}
            <span className="font-bold  bg-red-500 text-white py-1 px-3 mx-1 rounded-full">
              {totalUnread}
            </span>{" "}
            unread messages.
          </div>

          <div className="divide-y divide-gray-700/50">
            {MOCK_MESSAGES.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>

          <div className="mt-6 w-full border-t border-gray-700/50">
            <button
              className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition duration-300 ${PRIMARY_COLOR_CLASSES}`}
            >
              View Messages
            </button>
          </div>
        </div>

        <div className="bg-secondary p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            Received Quotes
          </h2>

          <div className="flex flex-col gap-6">
            {MOCK_QUOTES.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
