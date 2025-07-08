// components/NotificationPanel.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import InvitationPage from "./InvitationPage";

interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  status: string;
  timestamp: any;
  eventId?: string;
}

interface NotificationPanelProps {
  currentUser: User | null;
  setUnreadCount?: (count: number) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  currentUser,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showInvitations, setShowInvitations] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: Notification[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Notification;
        return {
          ...data,
          id: data.id || doc.id, // use doc.id only if data.id is missing
        };
      });

      const unreadCount = fetched.filter((n) => n.status === "unread").length;
      setUnreadCount?.(unreadCount);

      fetched.sort((a, b) => b.timestamp?.toDate() - a.timestamp?.toDate());

      setNotifications(fetched);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), {
        status: "read",
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="bg-white border shadow-md rounded-lg p-4 max-w-md h-auto w-full">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications</p>
      ) : (
        <ul className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-3 border rounded transition cursor-pointer ${
                notif.status === "unread"
                  ? "bg-blue-100"
                  : "bg-gray-100 text-gray-500"
              }`}
              onClick={() => {
                markAsRead(notif.id);
                if (["rsvp", "invite"].includes(notif.type.toLowerCase())) {
                  setShowInvitations(true);
                }
              }}
            >
              <p className="text-sm">{notif.message}</p>
              <p className="text-xs text-right">
                {new Date(notif.timestamp?.toDate()).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
      {showInvitations && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-4xl p-6 overflow-y-auto max-h-[90vh]">
            <InvitationPage onClose={() => setShowInvitations(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
