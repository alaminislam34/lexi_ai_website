"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Plus, Loader2 } from "lucide-react";
import AddEventModal from "./AddEventModal";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  parseISO,
} from "date-fns";

// logic to generate days (Removed dependency on MOCK_EVENTS here to keep it pure)
const generateCalendarDays = (date, events) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;

  while (day <= endDate || days.length < 42) {
    days.push({
      date: day,
      day: format(day, "d"),
      isCurrentMonth: isSameMonth(day, date),
      hasEvent: events.some((event) => isSameDay(parseISO(event.date), day)),
    });
    day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
  }
  return days;
};

const DayCell = ({ dayData, selectedDate, onSelectDay }) => {
  const { date, day, isCurrentMonth, hasEvent } = dayData;
  const isSelected = isSameDay(date, selectedDate);
  const isTodayDay = isToday(date);

  let cellClasses = `p-2.5 text-xs sm:text-sm md:text-base lg:text-lg rounded-md transition duration-150 cursor-pointer hover:bg-primary/40 h-full flex items-center justify-between`;

  if (isSelected) {
    cellClasses = `p-2.5 bg-primary/80 text-xs sm:text-sm md:text-base lg:text-lg rounded-md transition duration-150 cursor-pointer h-full flex items-center justify-between shadow-lg ring-2 ring-primary/80`;
  } else if (isCurrentMonth) {
    cellClasses += ` bg-BG text-white`;
  } else {
    cellClasses += ` bg-[#111827] text-gray-700/50 hover:text-white hover:bg-element`;
  }

  if (isTodayDay && !isSelected) {
    cellClasses += ` ring-1 ring-blue-400/80`;
  }

  return (
    <div className="aspect-video" onClick={() => onSelectDay(date)}>
      <div className={cellClasses}>
        <span className={`font-semibold ${isTodayDay && "text-blue-400"}`}>
          {day}
        </span>
        {hasEvent && (
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1"></span>
        )}
      </div>
    </div>
  );
};

const EventCard = ({ event }) => (
  <div className="flex items-start p-4 shadow-[1px_1px_5px_0px_rgb(220,220,220,0.1)] hover:shadow-[1px_1px_5px_0px_rgb(220,220,220,0.2)] border-gray/20 cursor-pointer">
    <div className="flex items-center text-blue-400 min-w-[120px]">
      <Clock className="w-5 h-5 mr-2" />
      <span className="font-semibold">
        {/* Formatting 14:30:00 to 02:30 PM if you prefer, or keep as is */}
        {event.time.slice(0, 5)}
      </span>
    </div>

    <div className="flex-1 min-w-0 mx-4">
      <p className="text-white font-semibold truncate">{event.title}</p>
      <p className="text-sm text-gray-400 truncate">{event.description}</p>
    </div>

    <div className="text-right shrink-0">
      <span className="text-sm text-gray-400">
        {format(parseISO(event.date), "MMM d, yyyy")}
      </span>
    </div>
  </div>
);

export default function Calendar() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // API Fetch Function
  const fetchEvents = async () => {
    try {
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const res = await axios.get(
        "http://3.141.14.219:8000/api/attorney/events/",
        {
          headers: { Authorization: `Bearer ${tokenData?.accessToken}` },
        },
      );
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const calendarDays = useMemo(
    () => generateCalendarDays(currentDate, events),
    [currentDate, events],
  );

  const selectedDayEvents = useMemo(() => {
    return events
      .filter((event) => isSameDay(parseISO(event.date), selectedDate))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, events]);

  const currentMonthLabel = format(currentDate, "MMMM yyyy");
  const nextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const prevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));

  const dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className={`bg-secondary p-6 min-h-screen`}>
      <div className={`max-w-5xl mx-auto`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
          <h2 className="sm:text-xl md:text-2xl font-semibold text-white flex items-center gap-3">
            {currentMonthLabel}
            {fetching && (
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            )}
          </h2>

          <div className="flex items-center justify-between space-x-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold bg-BG hover:bg-element duration-300 border-2 border-element text-xs truncate"
            >
              Add Event <Plus className="w-4 h-4" />
            </button>

            <div className="flex space-x-1">
              <button
                onClick={prevMonth}
                className="p-2 text-gray-400 hover:text-white transition hover:bg-gray-700/50"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 text-gray-400 hover:text-white transition hover:bg-gray-700/50"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {dayLabels.map((day) => (
            <div
              key={day}
              className="text-center text-sm md:text-base font-medium text-gray-400 p-2"
            >
              {day}
            </div>
          ))}
          {calendarDays.map((dayData, index) => (
            <DayCell
              key={index}
              dayData={dayData}
              selectedDate={selectedDate}
              onSelectDay={setSelectedDate}
            />
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-white mb-4">
          Events for {format(selectedDate, "MMM d, yyyy")}
        </h2>

        <div className="rounded-xl divide-y divide-gray-700/50 space-y-2">
          {selectedDayEvents.length > 0 ? (
            selectedDayEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="p-10 text-center text-gray-500 border border-dashed border-gray-700 rounded-xl">
              No events scheduled for this day.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddEventModal
          setShowModal={setShowModal}
          refreshEvents={fetchEvents} // Pass this to update list after adding
        />
      )}
    </div>
  );
}
