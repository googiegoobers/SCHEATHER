
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import "./HamburgerCal.css"
import { auth, db } from "@/app/lib/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface Invitee {
  uid?: string;
  displayName?: string;
  email?: string;
  avatarPath?: string;
  status?: string;
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

function HamburgerCal() {
  const [value, onChange] = useState<Value>(new Date());
  
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const today = new Date();
  
  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsubscribe();
  }, []);

  // Fetch events whenever the user changes
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
  
  const hasEventOnDate = (date: Date) => {
    return events.some(
      (event) => new Date(event.start).toDateString() === date.toDateString()
    );
  };

  return (
    <div data-layer="the body" className="bg-[#94B7EF] rounded p-4 w-[60vw] min-h-[200px] max-w-[95vw] md:min-h-[50vh] md:w-[80vw] lg:w-[20vw] lg:min-h-[28vh] xl:w-[16vw] 2xl:w-[12vw]">
      <Calendar 
        onChange={onChange} 
        value={value}
        calendarType="gregory"
        showNeighboringCentury={false}
        showNeighboringDecade={false}
        formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, {weekday: 'narrow'})}
        tileContent={({ date, view }) =>
          view === "month" && hasEventOnDate(date) ? (
            <div className="event-indicator" />
          ) : null
        }
        tileClassName={({ date, view }) => {
          if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          ) {
            return "today-text-color";
          }
          return undefined;
        }}
      />
    </div>
  );
};

export default HamburgerCal;