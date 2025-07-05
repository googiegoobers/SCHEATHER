"use client";
import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import "./Calendar.css";
import { User } from "firebase/auth";
import LocationAutocomplete from "./LocationAutocomplete";

interface EventFormProps {
  start: string;
  end: string;
  onClose: () => void;
  onEventCreated: (event: any) => void;
  currentUser: User | null;
}

const EventForm: React.FC<EventFormProps> = ({
  start,
  end,
  onClose,
  onEventCreated,
  currentUser,
}) => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    start: start,
    end: end,
    isAllDay: false,
    inviteList: [],
    budgetList: [],
    participants: [],
  });

  // i-edit ang date (newEvent.start) nga mabasa siya sa weatherapi
  const eventDateTime = newEvent.start; // e.g. "2025-07-06T14:30"
  const eventDate = newEvent.start.split("T")[0];
  const eventHour = new Date(eventDateTime).getHours();

  // for coordinates
  const [locationText, setLocationText] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: string;
    lon: string;
  } | null>(null);

  // Weather state
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!coordinates || !eventDate) return;

      const key = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      if (!key) {
        console.error("Missing Weather API Key");
        return;
      }

      try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${coordinates.lat},${coordinates.lon}&dt=${eventDate}&aqi=no&alerts=no`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok || !data.forecast) {
          throw new Error("Failed to fetch weather data");
        }

        const forecast = data.forecast.forecastday[0];
        const hourData = forecast.hour[eventHour]; // ← get weather for specific time

        setWeather(hourData); //specific day with the starting time
      } catch (error) {
        console.error("Weather fetch error:", error);
        setWeather(null);
      }
    };

    fetchWeather();
  }, [coordinates, eventDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    if (name === "isAllDay") {
      if (checked) {
        // Set start to 00:00 and end to 23:59 of the selected start date
        const date = newEvent.start ? new Date(newEvent.start) : new Date();
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const startOfDay = `${yyyy}-${mm}-${dd}T00:00`;
        const endOfDay = `${yyyy}-${mm}-${dd}T23:59`;
        setNewEvent((prev) => ({
          ...prev,
          isAllDay: true,
          start: startOfDay,
          end: endOfDay,
        }));
      } else {
        setNewEvent((prev) => ({
          ...prev,
          isAllDay: false,
        }));
      }
    } else {
      setNewEvent((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      alert("You must be logged in to create an event.");
      return;
    }

    const eventToSave = {
      ...newEvent,
      createdBy: currentUser.uid,
    };

    try {
      const docRef = await addDoc(collection(db, "events"), eventToSave);
      onEventCreated({ ...eventToSave, id: docRef.id });
      alert("Event created!");
      onClose();
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to create event.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-[968.86px] h-[698px] bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] mb-8 pb-24">
        <form
          onSubmit={handleSubmit}
          className="absolute inset-0 overflow-y-auto p-4 pb-110"
        >
          <div className="w-116 h-16 left-[60px] top-[31px] absolute justify-start text-cyan-900 text-5xl font-bold font-['Montserrat']">
            EVENT DETAILS
          </div>
          <div className="w-[900px] h-0 left-[26.07px] top-[102.07px] absolute opacity-50 outline-2 outline-offset-[-1px] outline-stone-900"></div>{" "}
          {/*line*/}
          <div className="w-[900px] h-0 left-[26px] top-[540px] absolute opacity-50 outline-1 outline-offset-[-0.50px] outline-stone-900"></div>{" "}
          {/*line*/}
          <div className="w-60 left-[102px] top-[130px] absolute justify-start text-stone-900 text-3xl font-bold font-['Montserrat']">
            <input
              name="title"
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleChange}
              required
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-full"
              style={{ minWidth: "200px", width: "420px" }}
            />
          </div>
          <div className="w-96 left-[102px] top-[198px] absolute justify-start text-stone-900 text-3xl font-bold font-['Montserrat']">
            <input
              name="start"
              type="datetime-local"
              value={newEvent.start}
              onChange={handleChange}
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-full"
              required
              style={{ minWidth: "200px", width: "420px" }}
            />
          </div>
          <div className="w-96 left-[102px] top-[266px] absolute justify-start text-stone-900 text-3xl font-bold font-['Montserrat']">
            <input
              name="end"
              type="datetime-local"
              value={newEvent.end}
              onChange={handleChange}
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-full"
              required
              style={{ minWidth: "200px", width: "420px" }}
            />
          </div>
          <div className="w-150 left-[102px] top-[334px] absolute justify-start text-stone-900 text-sm font-['Montserrat']">
            <LocationAutocomplete
              value={newEvent.location}
              onChange={(val) => {
                setNewEvent((prev) => ({ ...prev, location: val }));

                // If mu clear sa location input, clear weather and coords
                if (val === "") {
                  setCoordinates(null);
                  setWeather(null);
                }
              }}
              onSelect={(item) => {
                setCoordinates({ lat: item.lat, lon: item.lon });
                // Weather kay mu update automatically via useEffect
              }}
            />
          </div>
          <div className="w-64 h-16 left-[102px] top-[385px] absolute justify-start text-stone-900/75 text-lg font-semibold font-['Montserrat']">
            {weather && (
              <div className="flex items-center gap-2 text-sm text-black">
                <img src={weather.condition.icon} alt="Weather Icon" />
                <p>
                  {weather.condition.text}, {weather.temp_c}°C
                </p>
              </div>
            )}
          </div>
          <label className="left-[102px] top-[445px] absolute flex items-center">
            <input
              name="isAllDay"
              type="checkbox"
              checked={newEvent.isAllDay}
              onChange={handleChange}
              className="font-[Montserrat]"
            />
            All Day
          </label>
          {/* Invite List Preview (static for now) */}
          <div className="w-96 h-11 left-[60px] top-[500px] absolute justify-start text-cyan-900 text-3xl font-bold font-['Montserrat']">
            Invite List
          </div>
          <div className="w-96 h-16 left-[102px] top-[577px] absolute justify-start">
            <span className="text-stone-900/75 text-3xl font-bold font-['Montserrat']">
              Toothless
              <br />
            </span>
            <span className="text-stone-900/75 text-base font-normal font-['Montserrat']">
              toothless@gmail.com
            </span>
          </div>
          <div className="w-96 h-16 left-[102px] top-[672px] absolute justify-start">
            <span className="text-stone-900/75 text-3xl font-bold font-['Montserrat']">
              Kanye West
              <br />
            </span>
            <span className="text-stone-900/75 text-base font-normal font-['Montserrat']">
              kanyewest@gmail.com
            </span>
          </div>
          <div className="w-96 h-16 left-[102px] top-[767px] absolute justify-start">
            <span className="text-stone-900/75 text-3xl font-bold font-['Montserrat']">
              Freddy Fazbear
              <br />
            </span>
            <span className="text-stone-900/75 text-base font-normal font-['Montserrat']">
              freddyfazbear@gmail.com
            </span>
          </div>
          <div className="w-40 h-5 left-[752px] top-[557px] absolute justify-start text-stone-900/75 text-base font-bold font-['Montserrat']">
            STATUS
          </div>
          <div className="w-40 h-5 left-[752px] top-[597px] absolute justify-start text-stone-900/75 text-base font-normal font-['Montserrat']">
            Accepted
          </div>
          <div className="w-40 h-5 left-[752px] top-[697px] absolute justify-start text-stone-900/75 text-base font-normal font-['Montserrat']">
            Declined
          </div>
          <div className="w-40 h-5 left-[752px] top-[787px] absolute justify-start text-stone-900/75 text-base font-normal font-['Montserrat']">
            Pending
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            &times;
          </button>
          {/* Icon placeholder */}
          <div style={{ height: "600px" }} /> {/* Spacer for button */}
          <div className="flex justify-center items-center absolute left-1/2 transform -translate-x-1/2 bottom-10 top-[1000px]">
            <button
              type="submit"
              className="w-[350px] bg-[#213E60] text-white rounded-[8px] p-2 hover:bg-[#94B6EF]"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
