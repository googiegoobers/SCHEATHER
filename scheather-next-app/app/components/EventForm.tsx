"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { auth } from "@/app/lib/firebaseConfig"; // Assuming you want user info

const EventForm: React.FC = () => {
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    start: "",
    end: "",
    isAllDay: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;

    setNewEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in title, start, and end date.");
      return;
    }

    try {
      await addDoc(collection(db, "events"), {
        ...newEvent,
        start: new Date(newEvent.start).toISOString(),
        end: new Date(newEvent.end).toISOString(),
        createdBy: auth.currentUser?.uid || "anonymous",
      });
      alert("Event created!");
      setNewEvent({
        title: "",
        description: "",
        location: "",
        start: "",
        end: "",
        isAllDay: false,
      });
    } catch (err: any) {
      console.error("Error adding event:", err);
      alert("Failed to create event.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow w-full max-w-md mx-auto mt-4 flex flex-col gap-3"
    >
      <input
        name="title"
        type="text"
        placeholder="Title"
        value={newEvent.title}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={newEvent.description}
        onChange={handleChange}
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
      <label className="flex gap-2 items-center">
        <input
          name="isAllDay"
          type="checkbox"
          checked={newEvent.isAllDay}
          onChange={handleChange}
        />
        All Day
      </label>
      <button
        type="submit"
        className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
};

export default EventForm;
