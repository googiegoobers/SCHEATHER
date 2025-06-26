"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebaseConfig";
import "./Calendar.css";

interface EventFormProps {
  start: string;
  end: string;
  onClose: () => void;
  onEventCreated: (event: any) => void;
}

const EventForm: React.FC<EventFormProps> = ({ start, end, onClose, onEventCreated }) => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    location: "",
    start: start,
    end: end,
    isAllDay: false,
    inviteList: [],
    budgetList: [],
    participants: [],
    createdBy: auth.currentUser?.uid || "anonymous",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    try {
      const docRef = await addDoc(collection(db, "events"), newEvent);
      onEventCreated({ ...newEvent, id: docRef.id });
      alert("Event created!");
      onClose();
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to create event.");
    }
  };

  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        name="title"
        type="text"
        placeholder="Title"
        value={newEvent.title}
        onChange={handleChange}
        required
        className="event-input-text"
      />
      <input
        name="location"
        type="text"
        placeholder="Location"
        value={newEvent.location}
        onChange={handleChange}
        className="event-input-text"
      />
      <input
        name="start"
        type="datetime-local"
        value={newEvent.start}
        onChange={handleChange}
        className="event-input-text"
        required
      />
      <input
        name="end"
        type="datetime-local"
        value={newEvent.end}
        onChange={handleChange}
        className="event-input-text"
        required
      />
      <label>
        <input
          name="isAllDay"
          type="checkbox"
          checked={newEvent.isAllDay}
          onChange={handleChange}
          className="font-[Montserrat]"
        />
        All Day
      </label>
      <div className="flex justify-center items-center ">
      <button type="submit" className=" w-[350px] bg-[#213E60] text-white rounded-[8px] p-2 hover:bg-[#94B6EF]">
        Create Event
      </button></div>
      
    </form>
  );
};

export default EventForm;