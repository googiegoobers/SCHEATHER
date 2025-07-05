import React, { useState } from "react";
import MonthYearPicker from "./MonthYearPicker";

const CustomNavCal = (props: any) => {
  const { label, onNavigate, onView, view, date } = props;

  // for navigating next and prev year << >>
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleYearNavigate = (direction: "NEXT" | "PREV") => {
    const newDate = new Date(date);
    newDate.setFullYear(
      direction === "NEXT"
        ? newDate.getFullYear() + 1
        : newDate.getFullYear() - 1
    );
    onNavigate("DATE", newDate);
  };

  return (
    <div className="flex flex-col space-y-2 md:grid md:grid-cols-3 md:space-y-0 items-center py-2">
      {/* Navigation: prev, next, today  */}
      <div className="flex gap-3 order-2 md:order-1 navigation">
        <button
          className="px-2 py-1 rounded text-[color:#e68c3a] hover:bg-gray-300"
          onClick={() => handleYearNavigate("PREV")}
        >
          &lt;&lt;
        </button>
        <button
          className="px-2 py-1 rounded text-[color:#e68c3a] hover:bg-gray-300"
          onClick={() => onNavigate("PREV")}
        >
          &lt;
        </button>
        <button
          className="px-2 py-1 text-black rounded hover:bg-gray-300 font-bold"
          onClick={() => onNavigate("TODAY")}
        >
          TODAY
        </button>
        <button
          className="px-2 py-1 rounded text-[color:#e68c3a] hover:bg-gray-300"
          onClick={() => onNavigate("NEXT")}
        >
          &gt;
        </button>
        <button
          className="px-2 py-1 rounded text-[color:#e68c3a] hover:bg-gray-300"
          onClick={() => handleYearNavigate("NEXT")}
        >
          &gt;&gt;
        </button>
      </div>

      {/* MOnth and Year label */}
      <div className="flex justify-center order-1 md:order-2">
        <MonthYearPicker
          date={props.date}
          onChange={(newDate) => props.onNavigate("DATE", newDate)}
        />
      </div>

      {/* View Switcher Motnh, WEek, day*/}
      <div className="flex gap-2 order-3 md:order-3 justify-center md:justify-end viewer">
        <button
          className={`px-3 py-1 rounded text-sm transition duration-200 outline-none ${
            view === "month"
              ? "bg-blue-500 text-white ring-2 ring-[#e68c3a]"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => onView("month")}
        >
          Month
        </button>

        <button
          className={`px-3 py-1 rounded text-sm transition duration-200 outline-none ${
            view === "week"
              ? "bg-blue-500 text-white ring-2 ring-[#e68c3a]"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => onView("week")}
        >
          Week
        </button>

        <button
          className={`px-3 py-1 rounded text-sm transition duration-200 outline-none ${
            view === "day"
              ? "bg-blue-500 text-white ring-2 ring-[#e68c3a]"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => onView("day")}
        >
          Day
        </button>
      </div>
    </div>
  );
};

export default CustomNavCal;
