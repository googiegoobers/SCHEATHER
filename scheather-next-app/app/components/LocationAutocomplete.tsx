"use client";
import React, { useState, useEffect, useRef } from "react";

const LOCATIONIQ_API_KEY = "pk.4d87f3a510b82175a974baefff9f5737";

const LocationAutocomplete = ({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (select: {
    display_name: string;
    lat: string;
    lon: string;
  }) => void;
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
          query
        )}&format=json&limit=5`
      );
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error("LocationIQ error", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchSuggestions(newValue), 300);
  };

  const handleSelect = (displayName: string) => {
    const selected = suggestions.find(
      (item) => item.display_name === displayName
    );
    if (selected) {
      onSelect(selected);
      onChange(displayName);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="Enter the location"
        className="w-full p-2 border border-gray-300 rounded"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 font-sm w-full mt-1 rounded shadow-md">
          {suggestions.map((item, index) => (
            <li
              key={`${item?.place_id ?? "unknown"}-${index}`}
              onClick={() => handleSelect(item.display_name)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
