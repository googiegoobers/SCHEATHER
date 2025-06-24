"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebaseConfig";

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
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        className="border p-2 rounded"
      />
      <input
        name="location"
        type="text"
        placeholder="Location"
        value={newEvent.location}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        name="start"
        type="datetime-local"
        value={newEvent.start}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <input
        name="end"
        type="datetime-local"
        value={newEvent.end}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <label>
        <input
          name="isAllDay"
          type="checkbox"
          checked={newEvent.isAllDay}
          onChange={handleChange}
        />
        All Day
      </label>
      <button type="submit" className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700">
        Create Event
      </button>
    </form>
  );
};

export default EventForm;