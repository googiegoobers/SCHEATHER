"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, addDoc } from "firebase/firestore";
import { db, auth } from "@/app/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { updateInviteStatus } from "@/app/lib/inviteUtils";
import { div } from "three/src/nodes/TSL.js";

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
  location?: string;
  [key: string]: any;
}

export default function InvitationPage({ onClose }: Props) {
  const [invites, setInvites] = useState<InviteEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<InviteEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  //loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchInvites(currentUser.uid);
    }
  }, [currentUser]);

  const fetchInvites = async (uid: string) => {
    setIsLoading(true);
    try {
      const eventsSnapshot = await getDocs(collection(db, "events"));
      const updatedInvites: InviteEvent[] = [];

      for (const docSnap of eventsSnapshot.docs) {
        const data = docSnap.data();
        const invitee = data.inviteList?.find((u: any) => u.uid === uid);

        if (invitee && data.title) {
          let creatorName = "Unknown";
          let creatorAvatar = null;

          if (data.createdBy) {
            try {
              const userSnap = await getDoc(doc(db, "users", data.createdBy));
              if (userSnap.exists()) {
                const userData = userSnap.data();
                creatorName =
                  userData.displayName ||
                  `${userData.firstName ?? ""} ${
                    userData.lastName ?? ""
                  }`.trim() ||
                  "Unknown";
                creatorAvatar = userData.photoURL ?? null;
              }
            } catch (err) {
              console.error("Failed to fetch creator:", err);
            }
          }

          updatedInvites.push({
            id: docSnap.id,
            title: data.title,
            inviteList: data.inviteList,
            createdBy: data.createdBy,
            creatorName,
            creatorAvatar,
            location: data.location,
            ...data,
          });
        }
      }

      setInvites(updatedInvites);
    } catch (err) {
      console.error("Error fetching invites:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

    try {
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

    await fetchInvites(currentUser.uid);
  };

  const acceptedInvites = invites.filter((event) =>
    event.inviteList.some(
      (u) => u.uid === currentUser?.uid && u.status === "accepted"
    )
  );

  const declinedInvites = invites.filter((event) =>
    event.inviteList.some(
      (u) => u.uid === currentUser?.uid && u.status === "declined"
    )
  );

  const pendingInvites = invites.filter((event) =>
    event.inviteList.some(
      (u) =>
        u.uid === currentUser?.uid &&
        (!u.status || (u.status !== "accepted" && u.status !== "declined"))
    )
  );

  const InvitationCard = ({ event }: { event: InviteEvent }) => {
    const currentStatus = event.inviteList.find(
      (u) => u.uid === currentUser?.uid
    )?.status;

    return (
      <div
        key={event.id}
        onClick={() => openModal(event)}
        className="flex flex-col sm:flex-row items-center w-full gap-4 sm:justify-between bg-blue-100 hover:bg-blue-200 transition cursor-pointer border rounded-lg p-4"
      >
        <div className="flex flex-row items-center gap-4">
          <img
            src={event.avatarPath || "/avatar/axolotl.jpg"}
            alt={event.creatorName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <p className="font-semibold text-sm sm:text-base">
              {event.creatorName} invited you to <strong>{event.title}</strong>
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 text-green-700 text-xs sm:text-sm font-medium capitalize">
          {currentStatus || "pending"}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center p-4 sm:px-8 lg:px-20">
      <div className="w-full flex items-center gap-2 py-4">
        <button
          onClick={onClose}
          className="text-sm hover:underline flex items-center gap-1"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-xl font-bold mb-2">Invitations</h2>

      <div className="w-full max-w-4xl bg-gray-200 rounded-md px-4 py-2 mb-3 flex justify-between items-center">
        <p className="font-semibold text-sm sm:text-base">Invites</p>
        <p className="font-semibold text-sm sm:text-base text-right">Status</p>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-6 h-6 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
          <span className="ml-2 text-sm text-gray-600">
            Loading invitations...
          </span>
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-4">
            {/* PENDING INVITES */}
            <h3 className="text-lg font-semibold mt-6 mb-2">
              Pending Invitations
            </h3>
            {pendingInvites.length ? (
              pendingInvites.map((event) => (
                <div key={event.id} className="flex flex-col gap-4">
                  <InvitationCard event={event} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No pending invitations.</p>
            )}

            {/* ACCEPTED INVITES */}
            <h3 className="text-lg font-semibold mt-6 mb-2">
              Accepted Invitations
            </h3>

            {acceptedInvites.length ? (
              acceptedInvites.map((event) => (
                <div key={event.id} className="flex flex-col gap-4">
                  <InvitationCard event={event} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No accepted invitations.</p>
            )}

            {/* DECLINED INVITES */}
            <h3 className="text-lg font-semibold mt-6 mb-2">
              Declined Invitations
            </h3>
            {declinedInvites.length ? (
              declinedInvites.map((event) => (
                <div key={event.id} className="flex flex-col gap-4">
                  <InvitationCard event={event} />
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No declined invitations.</p>
            )}

            {/* RSVP MODAL */}
            {isModalOpen && selectedEvent && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
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
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleModalRespond("accepted")}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
