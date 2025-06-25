"use client";
import React, { useEffect, useState } from "react";
import "./Calendar.css";

import {
  Calendar,
  momentLocalizer,
  Event as CalendarEvent,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { db } from "@/app/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CustomNavCal from "./CustomNavCal";
import EventForm from "./EventForm"; // Make sure you have this

const localizer = momentLocalizer(moment);

interface FirestoreEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
}

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const eventsData: FirestoreEvent[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            start: new Date(data.start),
            end: new Date(data.end),
          };
        });
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setShowForm(true);
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

      {showForm && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow w-full max-w-md">
            <EventForm
              start={selectedSlot.start.toISOString().slice(0, 16)}
              end={selectedSlot.end.toISOString().slice(0, 16)}
              onClose={() => setShowForm(false)}
              onEventCreated={(newEvt) =>
                setEvents((prev) => [
                  ...prev,
                  {
                    ...newEvt,
                    start: new Date(newEvt.start),
                    end: new Date(newEvt.end),
                  },
                ])
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
