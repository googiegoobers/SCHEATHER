"use client";
import React, { useEffect, useState } from "react";
import "@/app/globals.css";
import {
  Calendar,
  momentLocalizer,
  Event as CalendarEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";
import CustomNavCal from "./CustomNavCal";

const localizer = momentLocalizer(moment);

interface FirestoreEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
}

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<FirestoreEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const snapshot = await getDocs(collection(db, "events"));
      const eventsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        start: new Date(doc.data().start),
        end: new Date(doc.data().end),
      })) as FirestoreEvent[];
      setEvents(eventsData);
    };
    fetchEvents();
  }, []);

  const handleSelectSlot = async (slotInfo: any) => {
    const title = prompt("Enter event title");
    if (title) {
      const newEvent = {
        title,
        start: slotInfo.start,
        end: slotInfo.end,
      };
      await addDoc(collection(db, "events"), newEvent);
      setEvents((prev) => [...prev, newEvent]);
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 600 }}
        onSelectSlot={handleSelectSlot}
        components={{
          toolbar: (props) => <CustomNavCal {...props} />,
        }}
      />
    </div>
  );
};

export default CalendarComponent;
