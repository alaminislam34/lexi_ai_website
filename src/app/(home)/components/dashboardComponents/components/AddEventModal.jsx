"use client";

import React, { useState } from "react";
import { CalendarIcon, Loader2, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-toastify";

// Standard class string for all inputs/selects (modern dark design)
const inputClasses =
  "w-full py-2 px-4 rounded-lg bg-[#27272A] text-white border border-[#3F3F46] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 placeholder-gray-500";

export default function AddEventModal({ setShowModal }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null); // Date object
  const [time, setTime] = useState(""); // "HH:MM" string
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time) {
      toast.error("Please select both date and time");
      return;
    }

    setLoading(true);

    try {
      // 1. Get the token from local storage
      const tokenData = JSON.parse(localStorage.getItem("token"));
      const accessToken = tokenData?.accessToken;

      if (!accessToken) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      // 2. Format Date to YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      // 3. Format Time to HH:mm:ss
      // API response showed seconds (14:30:00), so we add them here
      const formattedTime = time.length === 5 ? `${time}:00` : time;

      // 4. Prepare payload
      const payload = {
        title: title,
        description: description,
        date: formattedDate,
        time: formattedTime,
      };

      // 5. API Call
      const res = await axios.post(
        "http://10.10.7.19:8002/api/attorney/events/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Event added successfully!");
        setShowModal(false);
        // If you have a refresh function passed as a prop, call it here:
        // refreshEvents();
      }
    } catch (error) {
      console.error("Event Creation Error:", error);
      const errorMsg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to add event";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
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
                onChange={(selectedDate) => setDate(selectedDate)}
                className={`${inputClasses} w-full`}
                placeholderText="Select a date"
                dateFormat="EEEE, MMMM d, yyyy"
                id="date"
                wrapperClassName="w-full"
                required
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
              className={`w-full flex items-center bg-gray-700/50 justify-center py-2.5 rounded-lg text-white transition duration-300 hover:bg-gray-700`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center bg-blue-600 hover:bg-blue-700 justify-center py-2.5 rounded-lg text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
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
