"use client";

import React, { useState } from "react";
import { CalendarIcon, ChevronDown, Loader2, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Standard class string for all inputs/selects (modern dark design)
const inputClasses =
  "w-full py-2 px-4 rounded-lg bg-[#27272A] text-white border border-[#3F3F46] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 placeholder-gray-500";

// Primary blue color class for the submit button
const PRIMARY_COLOR_CLASSES = "bg-blue-600 hover:bg-blue-700";

export default function AddEventModal({ setShowModal }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null); // Date object
  const [time, setTime] = useState(""); // "HH:MM" string
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Combine date and time for API if needed
    const eventDateTime = date
      ? new Date(date).setHours(
          parseInt(time.split(":")[0] || 0),
          parseInt(time.split(":")[1] || 0)
        )
      : null;

    console.log({ title, date, time, eventDateTime, description });

    setTimeout(() => {
      setLoading(false);
      setShowModal(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative bg-[#1A1A1A] text-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700/50 pb-3">
          <h2 className="text-xl font-bold">Add Event</h2>
          <button
            onClick={() => setShowModal(false)}
            className="p-2 text-gray-400 hover:text-white transition rounded-full hover:bg-[#333333]"
            aria-label="Close Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm mb-2 text-gray-300">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
              placeholder="Enter event title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm mb-2 text-gray-300 w-full"
            >
              Date
            </label>
            <div className="relative">
              <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                className={`${inputClasses} w-full`}
                placeholderText="Select a date"
                dateFormat="EEEE, MMMM d, yyyy"
                id="date"
                wrapperClassName="w-full"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="time" className="block text-sm mb-2 text-gray-300">
              Time
            </label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm mb-2 text-gray-300"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClasses} resize-none`}
              rows={3}
              placeholder="Add description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`w-full flex items-center bg-gray/20 justify-center py-2.5 rounded-lg text-white transition duration-300`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center bg-primary justify-center py-2.5 rounded-lg text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
