"use client";

import React, { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";
import AddEventModal from "./AddEventModal";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, isSameMonth, isSameDay, isToday, parseISO } from "date-fns";

// --- MOCK DATA FOR EVENTS ---
// Updated MOCK_EVENTS to use ISO date strings for easier parsing and filtering
const MOCK_EVENTS = [
    {
        id: 1,
        time: "09:00 AM",
        title: "Client Consultation",
        description: "Initial meeting with Johnson case",
        date: "2025-12-16", // December 16, 2025 (Current Month)
    },
    {
        id: 2,
        time: "11:30 AM",
        title: "Team Sync-up",
        description: "Review Q1 goals and deliverables",
        date: "2026-03-05", // March 5, 2026 (Future Month)
    },
    {
        id: 3,
        time: "03:00 PM",
        title: "Product Demo",
        description: "Presentation to potential investors",
        date: "2025-12-16", // December 16, 2025 (Current Month)
    },
    {
        id: 4,
        time: "10:00 AM",
        title: "Annual Review",
        description: "Performance review with manager",
        date: "2026-10-25", // October 25, 2026 (Future Month)
    },
    {
        id: 5,
        time: "01:00 PM",
        title: "Budget Planning",
        description: "Q3 2026 budget allocation",
        date: "2026-07-01", // July 1, 2026 (Future Month)
    },
];

// --- CALENDAR LOGIC ---

/**
 * Generates the calendar grid (42 days) for a given date, including 
 * days from the previous and next month to fill the first and last week.
 * @param {Date} date - The date within the month to display.
 * @returns {Array} Array of day objects for the 42-day grid.
 */
const generateCalendarDays = (date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    // Start grid on the Monday of the first week of the month
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // weekStartsOn: 1 (Monday)
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const days = [];
    let day = startDate;

    // Generate 42 days (6 weeks * 7 days)
    while (day <= endDate) {
        days.push({
            date: day,
            day: format(day, "d"),
            isCurrentMonth: isSameMonth(day, date),
            hasEvent: MOCK_EVENTS.some(event => isSameDay(parseISO(event.date), day))
        });
        day = new Date(day.setDate(day.getDate() + 1));
    }

    // Ensure it's exactly 42 days for a consistent 6x7 grid (important for calendar layout)
    while (days.length < 42) {
        days.push({
            date: day,
            day: format(day, "d"),
            isCurrentMonth: false,
            hasEvent: MOCK_EVENTS.some(event => isSameDay(parseISO(event.date), day))
        });
        day = new Date(day.setDate(day.getDate() + 1));
    }

    return days;
};

// Initial date set to the current date for context, but you can set it to the mock month if needed:
// const INITIAL_DATE = new Date(2025, 10, 16); // November 16, 2025 for your original mock
const INITIAL_DATE = new Date(2025, 11, 10); // December 10, 2025 as the detected current date


const DayCell = ({ dayData, selectedDate, onSelectDay }) => {
    const { date, day, isCurrentMonth, hasEvent } = dayData;
    const isSelected = isSameDay(date, selectedDate);
    const isTodayDay = isToday(date);

    let cellClasses = `p-2.5 text-xs sm:text-sm md:text-base lg:text-lg rounded-md transition duration-150 cursor-pointer hover:bg-primary/40 h-full flex items-center justify-between`;
    
    if (isSelected) {
        cellClasses = `p-2.5 bg-primary/10 text-xs sm:text-sm md:text-base lg:text-lg rounded-md transition duration-150 cursor-pointer h-full flex items-center justify-between shadow-lg ring-2 ring-primary/80`;
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
                <span className={`font-semibold ${isTodayDay && 'text-blue-400'}`}>{day}</span>
                {hasEvent && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full ml-1"></span>
                )}
            </div>
        </div>
    );
};

const EventCard = ({ event }) => (
    <div
        className={`flex items-start p-4 shadow-[1px_1px_5px_0px_rgb(220,220,220,0.1)] hover:shadow-[1px_1px_5px_0px_rgb(220,220,220,0.2)] border-gray/20 cursor-pointer`}
    >
        <div className="flex items-center text-blue-400 min-w-[120px]">
            <Clock className="w-5 h-5 mr-2" />
            <span className="font-semibold">{event.time}</span>
        </div>

        <div className="flex-1 min-w-0 mx-4">
            <p className="text-white font-semibold truncate">{event.title}</p>
            <p className="text-sm text-gray-400 truncate">{event.description}</p>
        </div>

        <div className="text-right shrink-0">
            <span className="text-sm text-gray-400">{format(parseISO(event.date), "MMM d, yyyy")}</span>
        </div>
    </div>
);

export default function Calendar() {
    const [showModal, setShowModal] = useState(false);
    // State to manage the currently viewed month
    const [currentDate, setCurrentDate] = useState(INITIAL_DATE);
    // State to manage the selected day (defaults to today or the initial date)
    const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);

    // Memoize the generation of calendar days to avoid unnecessary re-runs
    const calendarDays = useMemo(() => generateCalendarDays(currentDate), [currentDate]);

    // Format the current month for display
    const currentMonthLabel = format(currentDate, "MMMM yyyy");

    // Memoized events for the selected day
    const selectedDayEvents = useMemo(() => {
        return MOCK_EVENTS.filter(event => isSameDay(parseISO(event.date), selectedDate))
            .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time
    }, [selectedDate]);

    // Handlers for month navigation
    const nextMonth = useCallback(() => {
        setCurrentDate(prevDate => addMonths(prevDate, 1));
    }, []);

    const prevMonth = useCallback(() => {
        setCurrentDate(prevDate => subMonths(prevDate, 1));
    }, []);

    const dayLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

    return (
        <div className={` bg-secondary p-6`}>
            {/* Calendar Header and Navigation */}
            <div className={`max-w-5xl mx-auto`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
                    <h2 className=" sm:text-xl md:text-2xl font-semibold text-white">
                        {currentMonthLabel}
                    </h2>

                    <div className="flex items-center justify-between space-x-2">
                        <button
                            onClick={() => setShowModal(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold bg-BG border-2 border-element text-xs truncate`}
                        >
                            Add Event
                            <Plus className="w-4 h-4" />
                        </button>

                        <div className="flex space-x-1">
                            <button
                                onClick={prevMonth}
                                className="p-1 md:p-2 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition hover:bg-gray-700/50"
                                aria-label="Previous month"
                            >
                                <ChevronLeft size={20} className="font-bold" />
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-1 md:p-2 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition hover:bg-gray-700/50"
                                aria-label="Next month"
                            >
                                <ChevronRight size={20} className="font-bold" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                    {dayLabels.map((day) => (
                        <div key={day} className="text-center text-sm md:text-base font-medium text-gray p-2">
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
            <br />
            
            {/* Events Section */}
            <div className="max-w-4xl mx-auto mt-12">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Events for {format(selectedDate, "MMM d, yyyy")}
                </h2>

                <div
                    className={`rounded-xl shadow-2xl divide-y divide-gray-700/50 space-y-2 overflow-y-auto`}
                >
                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-400">
                            No events scheduled for this day.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && <AddEventModal setShowModal={setShowModal} />}
        </div>
    );
}