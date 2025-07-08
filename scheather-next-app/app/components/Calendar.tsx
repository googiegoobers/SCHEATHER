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
import { auth, db } from "@/app/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import CustomNavCal from "./CustomNavCal";
import EventForm from "./EventForm";
import OutsideClickHandler from "react-outside-click-handler";
import { onAuthStateChanged } from "firebase/auth";

const localizer = momentLocalizer(moment);

/* ---------- Types ---------- */

interface Invitee {
  uid?: string;
  displayName?: string;
  email?: string;
  avatarPath?: string;
  status?: string;          // "accepted" | "pending" | "declined" | …
  [key: string]: any;
}

interface FirestoreEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  inviteList?: Invitee[];
}

/* ---------- Helper: coloured badge per status ---------- */
const getStatusClass = (status: string = "") => {
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "declined":
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/* ---------- Component ---------- */

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
   const [deleting, setDeleting] = useState(false);

  /* UI state */
  const [showForm, setShowForm] = useState(false);
  const [selectedSlot, setSelectedSlot] =
    useState<{ start: Date; end: Date } | null>(null);
  const [slotManuallySelected, setSlotManuallySelected] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<FirestoreEvent | null>(null);

  /* ---------- Auth listener ---------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  /* ---------- Fetch events whenever the user changes ---------- */
  useEffect(() => {
    if (!currentUser) {
      setEvents([]);
      return;
    }

    const fetchEvents = async () => {

      try {

        const eventsCol = collection(db, "events");
        const q = query(eventsCol, where("createdBy", "==", currentUser.uid));
        const snap = await getDocs(q);

        const eventsData: FirestoreEvent[] = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const data = docSnap.data();

            /* normalise inviteList */
            const raw = data.inviteList ?? [];
            let inviteArr: Invitee[] = Array.isArray(raw)
              ? raw
              : Object.values(raw);

            /* optionally fetch avatarPath from /users/<uid> */
            inviteArr = await Promise.all(
              inviteArr.map(async (inv) => {
                if (inv.avatarPath || !inv.uid) return inv;
                try {
                  const profileSnap = await getDoc(doc(db, "users", inv.uid));
                  const avatarPath = profileSnap.exists()
                    ? profileSnap.data().avatarPath
                    : "";
                  return { ...inv, avatarPath };
                } catch {
                  return inv;
                }
              })
            );

            return {
              id: docSnap.id,
              title: data.title,
              start: new Date(data.start?.toDate?.() || data.start),
              end: new Date(data.end?.toDate?.() || data.end),
              location: data.location,
              inviteList: inviteArr,
            };
          })
        );

        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [currentUser]);

  /* ---------- Handlers ---------- */

  const handleSelectSlot = (slotInfo: any) => {
    if (!slotManuallySelected) return;
    setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
    setShowForm(true);
  };

  const handleSelectEvent = (evt: CalendarEvent) =>
    setSelectedEvent(evt as unknown as FirestoreEvent);

  function toLocalDateTimeInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

// Delete event handler
  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "events", selectedEvent.id));
      setEvents((prev) => prev.filter((evt) => evt.id !== selectedEvent.id));
      setSelectedEvent(null);
    } catch (err) {
      alert("Failed to delete event.");
      console.error(err);
    } finally {
      setDeleting(false);
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
        onSelectEvent={handleSelectEvent}
        components={{ toolbar: (props) => <CustomNavCal {...props} /> }}
      />

      {/* ---- Create‑Event modal ---- */}
      {showForm && selectedSlot && (
        <div className="fixed inset-0 bg-[#383734]/50 backdrop-blur-sm flex justify-center items-center z-50 pointer-events-none">
          <OutsideClickHandler
            onOutsideClick={() => {
              setSlotManuallySelected(false);
              setShowForm(false);
              setTimeout(() => setSlotManuallySelected(true), 100);
            }}
          >
            <div className="relative pointer-events-auto">
              <EventForm
                start={toLocalDateTimeInputValue(selectedSlot.start)}
                end={toLocalDateTimeInputValue(selectedSlot.end)}
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
                currentUser={currentUser}
              />
            </div>
          </OutsideClickHandler>
        </div>
      )}

      {/* ---- Event‑details modal ---- */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div
            className="bg-white p-2 sm:p-6 rounded-[20px] sm:rounded-[30px] shadow-lg w-[95vw] max-w-xl max-w-full overflow-y-auto max-h-[90vh]"
            style={{ boxSizing: "border-box" }}
          >
            {/* header buttons */}
            <div className="flex gap-2 sm:gap-4 mb-4 items-center">
              <div className="wrapperBTN space-x-3 ml-auto">
              {isOwner && (
                <button
                  className="buttonsPencil  rounded-full p-1 hover:bg-black/10 cursor-pointer"
                  title="Edit Event Details"
                  onClick={() => {
                    setSelectedEvent(null); // Close event details modal
                    setEventToEdit(selectedEvent); // Store the event to edit
                    setEditMode(true);
                    setShowForm(true);
                  }}
                >
                  <img src="/pencil.png" className="w-6 h-6" alt="Edit" />
                </button>
              )}
              <button
                className="buttonsTrash rounded-full p-1 hover:bg-black/10 cursor-pointer"
                onClick={handleDeleteEvent}
                disabled={deleting}
                title="Delete event"
              >
                <img src="/trash.png" className="w-6 h-6" />
              </button> 
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="mx-5 text-[#213E60] font-semibold text-lg sm:text-xl"
              >
                ✕
              </button>
            </div>

            <h2 className="font-['Poppins'] text-lg sm:text-2xl text-[#213E60] font-bold break-words">
              {selectedEvent.title}
            </h2>

            {/* Dates */}
            <div className="mt-2 text-sm sm:text-base">
              <span className="font-semibold">Start:</span>{" "}
              {moment(selectedEvent.start).format("MMMM DD, YYYY - hh:mm A")}
              <br />
              <span className="font-semibold">End:</span>{" "}
              {moment(selectedEvent.end).format("MMMM DD, YYYY - hh:mm A")}
            </div>

            {/* Location */}
            <div className="mt-2 text-sm sm:text-base break-words">
              <span className="font-semibold">Location:</span>{" "}
              {selectedEvent.location
                ? selectedEvent.location.replace(/(.{60})/g, "$1\n")
                : "No location provided"}
            </div>

            <hr className="my-4 border-gray-300" />

            {/* Invites */}
            <div className="mt-4">
              <span className="font-semibold">Invited Users:</span>
              <div className="max-h-40 overflow-y-auto">
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {Array.isArray(selectedEvent.inviteList) &&
                  selectedEvent.inviteList.length ? (
                    selectedEvent.inviteList.map((user, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        {/* Show avatar if available, else default */}
                        <img
                          src={
                            user.avatarPath && user.avatarPath.trim() !== ""
                              ? user.avatarPath
                              : "/avatar/axolotl.jpg"
                          }
                          alt={user.displayName || user.email || "User"}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        {/* name + badge + email */}
                        <span className="flex flex-col">
                          <span className="flex items-center gap-2">
                            <span className="text-[#213E60] font-semibold text-xs sm:text-base">
                              {user.displayName || "Unknown User"}
                            </span>
                            {user.status && (
                              <span
                                className={`px-2 py-0.5 rounded text-xs capitalize font-semibold ${getStatusClass(
                                  user.status
                                )}`}
                              >
                                {user.status}
                              </span>
                            )}
                          </span>
                          {user.email && (
                            <span className="text-xs sm:text-sm text-gray-500">
                              {user.email}
                            </span>
                          )}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>No invites</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-4">
              {/* Only show Back Out if user is an invitee and NOT the owner */}
              {isInvitee && !isOwner && (
                <button
                  className="bg-yellow-500 text-white w-full max-w-xs h-10 flex flex-col items-center justify-center rounded-[10px] cursor-pointer text-base sm:text-lg"
                  onClick={async () => {
                    if (!selectedEvent?.id || !currentUser?.uid) return;
                    await updateInviteStatus(
                      selectedEvent.id,
                      currentUser.uid,
                      "declined"
                    );
                    setSelectedEvent(null); // close modal
                  }}
                  disabled={
                    Array.isArray(selectedEvent?.inviteList) &&
                    !!selectedEvent.inviteList.find(
                      (u) =>
                        u.uid === currentUser.uid && u.status === "declined"
                    )
                  }
                >
                  Back Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
