"use client";
import React, { useEffect, useState, useRef } from "react";
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
import OutsideClickHandler from "react-outside-click-handler"; //naa sa type folder under .next (gisunod ra nako ang gisulti sa copilot sa vs code hahahah, it worked!, so that OusideEvenntHandler mugana)

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
  const [slotManuallySelected, setSlotManuallySelected] = useState(true);

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
        // put this aron kung mu click outside dli mutrigger ug show sa evnet form, cancel usa then click again
        onSelectSlot={(slotInfo) => {
          if (slotManuallySelected) {
            setSelectedSlot(slotInfo);
            setShowForm(true);
          }
        }}
        components={{
          toolbar: (props) => <CustomNavCal {...props} />,
        }}
      />

      {showForm && selectedSlot && (
        <div className="fixed inset-0 bg-[#383734]/50 backdrop-blur-[1px] bg-opacity-50 flex justify-center items-center z-50 pointer-events-none">
          <OutsideClickHandler
            onOutsideClick={() => {
              setSlotManuallySelected(false); // disable ang trigger to open even form if nag open sa event form then mutap outside
              setShowForm(false);
              setTimeout(() => setSlotManuallySelected(true), 100); //after nga muclick outside, enable re-trigger after 100ms
            }}
          >
            <div className="bg-[#ffffffec] p-4 rounded-[10px] shadow w-[2000] h-165 max-w-md pointer-events-auto">
              <h1 className="p-3 font-bold font-['Montserrat'] lg:text-lg sm:text-sm">Event Creation Details</h1>

              {/* pop-up event */}
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
          </OutsideClickHandler>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
