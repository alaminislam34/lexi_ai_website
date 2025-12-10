// src/components/MessageAndReceived.jsx
"use client";

import React from "react";
import Image from "next/image";
import { BiMessageAltDetail } from "react-icons/bi";
import { useAuth } from "@/app/providers/Auth_Providers/AuthProviders";
import Link from "next/link";
import { RiStarFill, RiStarLine } from "react-icons/ri";

const PRIMARY_COLOR_CLASSES = "bg-blue-600 hover:bg-blue-700";
const TEXT_ELEMENT_BG = "bg-[#33363D]";

const MOCK_MESSAGES = [
  {
    id: 1,
    name: "Al Junaid",
    lastMessage: "something...",
    time: "12:36 PM",
    image: "/images/user.jpg",
    unread: true,
  },
  {
    id: 2,
    name: "Eleena",
    lastMessage: "something...",
    time: "12:36 PM",
    image: "/images/user.jpg",
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
      className="md:w-10 w-8 md:h-10 h-8 rounded-full object-cover mr-3"
    />

    <div className="flex-1 min-w-0">
      <p className="text-white text-sm md:text-base font-medium truncate">
        {message.name}
      </p>
      <p className="text-xs md:text-sm text-gray-400 truncate">
        {message.lastMessage}
      </p>
    </div>

    <div className="flex items-center space-x-2 shrink-0 ml-2">
      <span className="text-sm text-gray-500">{message.time}</span>
    </div>
  </div>
);

export default function ConsultRequest() {
  const { setShowModal, showModal } = useAuth();
  const handleModal = (v) => {
    setShowModal(v);
  };

  console.log(showModal);
  const totalUnread = MOCK_MESSAGES.filter((m) => m.unread).length;

  return (
    <div className={`min-h-screen text-white`}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-secondary p-4 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            Clients Requests
          </h2>

          <div className="flex flex-col gap-2">
            {MOCK_QUOTES.map((quote, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl hover:shadow-[2px_2px_6px_0px_rgb(255,255,255,0.1)] duration-300 bg-[#212121] border border-gray/20`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={quote.image}
                      height={50}
                      width={50}
                      alt={quote.lawyerName}
                      className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm md:text-lg truncate">
                        {quote.lawyerName}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">
                        {quote.firm} &bull; {quote.location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 items-center gap-4">
                  <button
                    onClick={() => handleModal(true)}
                    className={`w-full py-2 rounded-lg text-white transition duration-300 border border-element hover:bg-element`}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleModal(true)}
                    className={`w-full py-2 rounded-lg text-white transition duration-300 bg-primary hover:bg-dark-primary`}
                  >
                    Send Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* score section */}
        <div className="p-6 bg-secondary rounded-2xl flex flex-col gap-2">
          <h1 className="text-grayF md:text-xl font-medium">Score</h1>
          <div className="flex flex-row gap-4 items-center">
            <RiStarFill className="text-3xl text-primary" />
            <RiStarFill className="text-3xl text-primary" />
            <RiStarFill className="text-3xl text-primary" />
            <RiStarFill className="text-3xl text-primary" />
            <RiStarLine className="text-3xl text-primary" />
            <p className="text-2xl">4</p>
          </div>
        </div>
        <div className={`rounded-xl overflow-hidden bg-secondary p-4`}>
          <div className="flex items-center py-4 border-b border-gray-700/50">
            <BiMessageAltDetail className="w-6 h-6 mr-3 text-blue-500" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>

          <div className="py-4">
            <p className="text-sm sm:text-base">
              You have
              <span className="text-xs sm:text-sm bg-red-500 text-white py-0.5 px-2 mx-1 rounded-full">
                {totalUnread}
              </span>
              unread messages.
            </p>
          </div>

          <div className="divide-y divide-gray-700/50">
            {MOCK_MESSAGES.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
          </div>

          <div className="mt-6 w-full border-t border-gray-700/50">
            <Link
              href={"/message"}
              className={`w-full py-2 inline-block text-center rounded-lg text-white text-sm sm:text-base md:text-lg transition duration-300 bg-primary hover:bg-dark-primary`}
            >
              View Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
