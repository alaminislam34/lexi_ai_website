"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";

const CARD_BG = "bg-[#1D1F23]";
const TEXT_ELEMENT_BG = "bg-[#33363D]";
const PRIMARY_COLOR = "bg-blue-600 hover:bg-blue-700";

const getCalendarDays = () => {
  const days = [];
  const startDay = 26;

  for (let i = startDay; i <= 31; i++) {
    days.push({ day: i, isCurrentMonth: false, date: `Oct ${i}` });
  }

  for (let i = 1; i <= 30; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      isSelected: i === 16,
      date: `Nov ${i}`,
    });
  }

  for (let i = 1; i <= 6; i++) {
    days.push({ day: i, isCurrentMonth: false, date: `Dec ${i}` });
  }

  return days;
};

const MOCK_CALENDAR_DAYS = getCalendarDays();

const MOCK_EVENTS = [
  {
    id: 1,
    time: "09:00 AM",
    title: "Client Consultation",
    description: "Initial meeting with Johnson case",
    date: "16th Nov, 2026",
  },
  {
    id: 2,
    time: "11:30 AM",
    title: "Client Consultation",
    description: "Initial meeting with Johnson case",
    date: "9th Feb, 2026",
  },
  {
    id: 3,
    time: "09:00 AM",
    title: "Client Consultation",
    description: "Initial meeting with Johnson case",
    date: "9th Feb, 2026",
  },
];

const DayCell = ({ dayData }) => {
  const { day, isCurrentMonth, isSelected } = dayData;

  let cellClasses = `p-2.5 text-sm md:text-base lg:text-lg rounded-lg transition duration-150 cursor-pointer 
                       hover:bg-primary/40 h-full flex items-center`;

  if (isSelected) {
    cellClasses = `p-2.5 bg-primary text-sm md:text-base lg:text-lg rounded-lg transition duration-150 cursor-pointer h-full flex items-center`;
  } else if (isCurrentMonth) {
    cellClasses += ` ${TEXT_ELEMENT_BG} text-white`;
  } else {
    cellClasses += ` bg-[#111827] hover:${TEXT_ELEMENT_BG}`;
  }

  return (
    <div className="aspect-square">
      <div className={cellClasses}>
        <span className="font-semibold">{day}</span>
      </div>
    </div>
  );
};

const EventCard = ({ event }) => (
  <div className={`flex items-start p-4 border-b border-gray-700/50`}>
    <div className="flex items-center text-blue-400 min-w-[120px]">
      <Clock className="w-5 h-5 mr-2" />
      <span className="font-semibold">{event.time}</span>
    </div>

    <div className="flex-1 min-w-0 mx-4">
      <p className="text-white font-semibold truncate">{event.title}</p>
      <p className="text-sm text-gray-400 truncate">{event.description}</p>
    </div>

    <div className="text-right shrink-0">
      <span className="text-sm text-gray-400">{event.date}</span>
    </div>
  </div>
);

export default function Calendar() {
  const currentMonth = "November 2025";

  const dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className={`min-h-screen bg-secondary p-6`}>
      <div className={`max-w-5xl mx-auto`}>
        <div className="flex items-center justify-between py-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">{currentMonth}</h2>

          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-BG border-2 border-element text-xs truncate`}
            >
              Add Event
              <Plus className="w-4 h-4 mr-2" />
            </button>

            <div className="flex space-x-2">
              <button
                className="p-1 md:p-2 rounded-full text-gray-400 hover:text-white transition hover:bg-gray-700/50"
                aria-label="Previous month"
              >
                <ChevronLeft className="font-bold" />
              </button>
              <button
                className="p-1 md:p-2 rounded-full text-gray-400 hover:text-white transition hover:bg-gray-700/50"
                aria-label="Next month"
              >
                <ChevronRight className="font-bold" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {dayLabels.map((day) => (
            <div key={day} className="text-center font-medium text-gray p-2">
              {day}
            </div>
          ))}

          {MOCK_CALENDAR_DAYS.map((dayData, index) => (
            <DayCell key={index} dayData={dayData} />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">Upcoming Events</h2>

        <div
          className={`rounded-xl shadow-2xl ${CARD_BG} divide-y divide-gray-700/50`}
        >
          {MOCK_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}
