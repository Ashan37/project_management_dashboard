import { useState, useEffect, useRef } from "react";
import instance from "../../api/axiosConfig";

export default function MentionInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  projectId,
}) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const inputRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await instance.get("/users");
        setAllUsers(res.data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [projectId]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);

    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");

    if (lastAtIndex !== -1 && lastAtIndex === cursorPos - 1) {
      setMentionStart(lastAtIndex);
      setShowSuggestions(true);
      setSuggestions(allUsers);
      setSelectedIndex(0);
    } else if (lastAtIndex !== -1 && mentionStart !== -1) {
      const searchText = textBeforeCursor.slice(lastAtIndex + 1).toLowerCase();
      const filtered = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchText) ||
          user.email.toLowerCase().includes(searchText)
      );
      setSuggestions(filtered);
      setSelectedIndex(0);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setMentionStart(-1);
    }
  };

  const insertMention = (user) => {
    if (mentionStart === -1) return;

    const beforeMention = value.slice(0, mentionStart);
    const afterCursor = value.slice(inputRef.current.selectionStart);
    const mention = `@[${user.name}](${user._id})`;
    const newValue = beforeMention + mention + " " + afterCursor;

    onChange(newValue);
    setShowSuggestions(false);
    setMentionStart(-1);

    setTimeout(() => {
      inputRef.current?.focus();
      const newPos = (beforeMention + mention + " ").length;
      inputRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        insertMention(suggestions[selectedIndex]);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 p-3 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-[#82BAC4] focus:border-transparent"
          rows="2"
        />
        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="px-4 py-2 text-white bg-[#82BAC4] rounded-lg hover:bg-[#6DA8B3] disabled:opacity-50 disabled:cursor-not-allowed h-fit"
        >
          Send
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 z-10 w-64 mb-2 overflow-y-auto bg-white border rounded-lg shadow-lg bottom-full max-h-48">
          {suggestions.map((user, index) => (
            <button
              key={user._id}
              onClick={() => insertMention(user)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${
                index === selectedIndex ? "bg-gray-100" : ""
              }`}
            >
              <div className="text-sm font-medium text-gray-900">
                {user.name}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </button>
          ))}
        </div>
      )}

      <style>{`
        .mention {
          color: #2563eb;
          font-weight: 600;
          background-color: #dbeafe;
          padding: 2px 4px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
