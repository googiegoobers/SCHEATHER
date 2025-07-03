"use client";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebaseConfig";
import "./Calendar.css";
import { User } from "firebase/auth";

interface EventFormProps {
  start: string;
  end: string;
  onClose: () => void;
  onEventCreated: (event: any) => void;
  currentUser: User | null;
}

const EventForm: React.FC<EventFormProps> = ({ start, end, onClose, onEventCreated, currentUser, }) => {
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
        <form onSubmit={handleSubmit} className="absolute inset-0 overflow-y-auto p-4 pb-110">
          <div className="w-116 h-16 left-[60px] top-[31px] absolute justify-start text-cyan-900 text-5xl font-bold font-['Montserrat']">EVENT DETAILS</div>
          <div className="w-[900px] h-0 left-[26.07px] top-[102.07px] absolute opacity-50 outline outline-2 outline-offset-[-1px] outline-stone-900"></div> {/*line*/}
          <div className="w-[900px] h-0 left-[26px] top-[540px] absolute opacity-50 outline outline-1 outline-offset-[-0.50px] outline-stone-900"></div> {/*line*/}
          <div className="w-60 left-[102px] top-[130px] absolute justify-start text-stone-900 text-3xl font-bold font-['Montserrat']">
            <input
              name="title"
              type="text"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleChange}
              required
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-full"
              style={{ minWidth: '200px', width: '420px' }}
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
              style={{ minWidth: '200px', width: '420px' }}
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
              style={{ minWidth: '200px', width: '420px' }}
            />
          </div>
          <div className="w-60 left-[102px] top-[334px] absolute justify-start text-stone-900 text-3xl font-bold font-['Montserrat']">
            <input
              name="location"
              type="text"
              placeholder="Location"
              value={newEvent.location}
              onChange={handleChange}
              className="event-input-text bg-transparent border-b border-gray-400 focus:outline-none w-full"
              style={{ minWidth: '200px', width: '420px' }}
            />
          </div>
          <div className="w-64 h-16 left-[102px] top-[394px] absolute justify-start text-stone-900/75 text-lg font-semibold font-['Montserrat']">The weather is 32° Celsius</div>
          <label className="left-[102px] top-[440px] absolute flex items-center">
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
          <div className="w-96 h-11 left-[60px] top-[500px] absolute justify-start text-cyan-900 text-3xl font-bold font-['Montserrat']">Invite List</div>
          <div className="w-96 h-16 left-[102px] top-[577px] absolute justify-start"><span className="text-stone-900/75 text-3xl font-bold font-['Montserrat']">Toothless<br/></span><span className="text-stone-900/75 text-base font-normal font-['Montserrat']">toothless@gmail.com</span></div>
          <div className="w-96 h-16 left-[102px] top-[672px] absolute justify-start"><span className="text-stone-900/75 text-3xl font-bold font-['Montserrat']">Kanye West<br/></span><span className="text-stone-900/75 text-base font-normal font-['Montserrat']">kanyewest@gmail.com</span></div>
          <div className="w-96 h-16 left-[102px] top-[767px] absolute justify-start"><span className="text-stone-900/75 text-3xl font-bold font-['Montserrat']">Freddy Fazbear<br/></span><span className="text-stone-900/75 text-base font-normal font-['Montserrat']">freddyfazbear@gmail.com</span></div>
          <div className="w-40 h-5 left-[752px] top-[557px] absolute justify-start text-stone-900/75 text-base font-bold font-['Montserrat']">STATUS</div>
          <div className="w-40 h-5 left-[752px] top-[597px] absolute justify-start text-stone-900/75 text-base font-normal font-['Montserrat']">Accepted</div>
          <div className="w-40 h-5 left-[752px] top-[697px] absolute justify-start text-stone-900/75 text-base font-normal font-['Montserrat']">Declined</div>
          <div className="w-40 h-5 left-[752px] top-[787px] absolute justify-start text-stone-900/75 text-base font-normal font-['Montserrat']">Pending</div>
          <div className="w-8 h-7 left-[904px] top-[47px] absolute outline outline-[1.52px] outline-offset-[-0.76px] outline-black" /> {/* Icon placeholder */}
          
          <div style={{ height: '600px' }} /> {/* Spacer for button */}
          <div className="flex justify-center items-center absolute left-1/2 transform -translate-x-1/2 bottom-10 top-[1000px]">
            <button type="submit" className="w-[350px] bg-[#213E60] text-white rounded-[8px] p-2 hover:bg-[#94B6EF]">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;