import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MonthYearPicker = ({
  date,
  onChange,
}: {
  date: Date;
  onChange: (date: Date) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"year" | "month">("year");
  const [selectedYear, setSelectedYear] = useState(date.getFullYear());

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [creationYear, setCreationYear] = useState<number | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const creationTime = user.metadata?.creationTime;
        if (creationTime) {
          const yearOnly = new Date(creationTime).getFullYear();
          setCreationYear(yearOnly);
        }
      }
    });

    return () => unsubscribe();
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  //i change pani siya nga maka back and forth
  const yearRange =
    creationYear !== null
      ? Array.from({ length: 10 }, (_, i) => creationYear + i)
      : [];

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setStep("month"); //mu navigate to the second step which is choosing the month
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(date);
    newDate.setFullYear(selectedYear);
    newDate.setMonth(month);
    onChange(newDate);
    setOpen(false);
    setStep("year");
  };

  return (
    <div className="relative inline-block">
      {/* label ni siya sa calendar */}
      <button
        className="text-lg font-bold hover:scale"
        onClick={() => setOpen(!open)}
      >
        {months[date.getMonth()]} {date.getFullYear()}
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-56 bg-white rounded shadow p-4">
          {step === "year" && (
            <div className="grid grid-cols-3 gap-2">
              {yearRange.map((year) => (
                <button
                  key={year}
                  className="text-sm py-1 rounded hover:bg-blue-100"
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {step === "month" && (
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, idx) => (
                <button
                  key={month}
                  className="text-sm py-1 rounded hover:bg-blue-100"
                  onClick={() => handleMonthSelect(idx)}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
              <button
                className="col-span-3 text-xs text-black underline mt-2 poppins_425fed16-module__Qi0vpW__className cursor-pointer"
                onClick={() => setStep("year")}
              >
                ← Back to years
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
