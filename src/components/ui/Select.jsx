/**
 * Reusable Select Component
 */

import React from "react";
import { ChevronDown } from "lucide-react";

export const Select = ({
  label,
  options,
  error,
  helperText,
  isLoading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          disabled={disabled || isLoading}
          className={`
            w-full px-3 py-2 appearance-none rounded-lg border bg-[#1D1F23] text-white
            border-gray-600 hover:border-gray-500 focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:border-transparent transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed text-sm
            ${error ? "border-red-500" : ""}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
      {helperText && <p className="text-sm text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
};

export default Select;
