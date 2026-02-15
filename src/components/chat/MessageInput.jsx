import { Send } from "lucide-react";
import { useEffect, useRef } from "react";

export default function MessageInput({ value, onChange, onSend }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";

      const minHeight = 42;
      const maxHeight = 5 * 24;

      let newHeight = textareaRef.current.scrollHeight;
      if (newHeight > maxHeight) newHeight = maxHeight;

      textareaRef.current.style.height = `${Math.max(minHeight, newHeight)}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-3 md:p-4 border-t border-gray-700/50 bg-secondary">
      <div className="flex items-center  space-x-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the assistant...."
          className="flex-1 p-3 rounded-lg resize-none text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-BG"
          rows={1}
          style={{ overflowY: "hidden" }}
        />
        <div>
          <button
            onClick={onSend}
            disabled={value.trim() === ""}
            className={`p-3 rounded-lg text-white transition duration-300 bg-primary ${
              value.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
