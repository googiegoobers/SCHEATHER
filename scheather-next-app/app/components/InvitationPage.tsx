"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { updateInviteStatus } from "@/app/lib/inviteUtils";

interface Props {
  onClose: () => void;
}

interface InviteEvent {
  id: string;
  title: string;
  inviteList: Array<{ uid: string; status: string; [key: string]: any }>;
  createdBy: string;
  creatorName?: string;
  creatorAvatar?: string | null;
  [key: string]: any;
}

export default function InvitationPage({ onClose }: Props) {
  const [pendingInvites, setPendingInvites] = useState<InviteEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<InviteEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInvites = async () => {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const invites: InviteEvent[] = [];

      for (const docSnap of eventsSnapshot.docs) {
        const data = docSnap.data();
        const invitee = data.inviteList?.find(
          (u: any) => u.uid === currentUser.uid && u.status === "pending"
        );

        if (invitee && data.title) {
          let creatorName = "Unknown";
          let creatorAvatar = null;

          if (data.createdBy) {
            try {
              const userSnap = await getDoc(doc(db, "users", data.createdBy));
              if (userSnap.exists()) {
                const userData = userSnap.data();
                creatorName =
                  `${userData.firstName ?? ""} ${
                    userData.lastName ?? ""
                  }`.trim() || "Unknown";
                creatorAvatar = userData.photoURL ?? null; // still keep this in case it's added later
              }
            } catch (err) {
              console.error("Failed to fetch creator:", err);
            }
          }

          invites.push({
            id: docSnap.id,
            title: data.title,
            inviteList: data.inviteList,
            createdBy: data.createdBy,
            creatorName,
            creatorAvatar,
            ...data,
          });
        }
      }

      setPendingInvites(invites);
    };

    fetchInvites();
  }, [currentUser]);

  const openModal = (event: InviteEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleModalRespond = async (status: "accepted" | "declined") => {
    if (!selectedEvent || !currentUser) return;

    await updateInviteStatus(selectedEvent.id, currentUser.uid, status);
    closeModal();
    setPendingInvites((prev) => prev.filter((e) => e.id !== selectedEvent.id));

    try {
      // Send notification to the event creator
      await addDoc(collection(db, "notifications"), {
        userId: selectedEvent.createdBy,
        type: "rsvp",
        eventId: selectedEvent.id,
        message: `${currentUser.displayName} has ${status} your invitation to "${selectedEvent.title}"`,
        status: "unread",
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("Error sending RSVP notification:", err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-4 sm:px-8 lg:px-20">
      {/* Back button */}
      <div className="w-full flex items-center gap-2 py-4">
        <button
          onClick={onClose}
          className="text-sm hover:underline flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Invitations</h2>

      {/* Header Bar */}
      <div className="w-full max-w-4xl bg-gray-200 rounded-md px-4 py-2 mb-3 flex justify-between items-center">
        <p className="font-semibold text-sm sm:text-base">Invites</p>
        <p className="font-semibold text-sm sm:text-base text-right">Status</p>
      </div>

      {/* List */}
      <div className="w-full max-w-4xl space-y-3">
        {pendingInvites.map((event) => (
          <div
            key={event.id}
            onClick={() => openModal(event)}
            className="flex flex-col sm:flex-row items-center sm:justify-between bg-blue-100 hover:bg-blue-200 transition cursor-pointer border rounded-lg p-4"
          >
            <div className="flex flex-row items-center gap-4">
              <img
                src={event.creatorAvatar || "/avatar/axolotl.jpg"}
                alt={event.creatorName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="font-semibold text-sm sm:text-base">
                  {event.creatorName} invited you to{" "}
                  <strong>{event.title}</strong>
                </p>
              </div>
            </div>
            <div className="mt-2 sm:mt-0 text-green-700 text-xs sm:text-sm font-medium">
              Pending
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 bg-transparent backdrop-blur bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{selectedEvent.title}</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
            </div>

            {selectedEvent.location && (
              <p className="text-sm text-gray-600 mb-2">
                Location: {selectedEvent.location}
              </p>
            )}

            <div className="mb-4">
              <h4 className="font-semibold text-sm mb-1">Invitees:</h4>
              <ul className="text-sm text-gray-600 max-h-24 overflow-y-auto">
                {selectedEvent.inviteList
                  .filter((u: any) => u.uid !== selectedEvent.createdBy)
                  .map((u: any) => (
                    <li key={u.uid}>
                      {u.displayName || u.email || "Unknown"} – {u.status}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleModalRespond("declined")}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer active:scale-3d"
              >
                Decline
              </button>
              <button
                onClick={() => handleModalRespond("accepted")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer active:scale-3d"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
