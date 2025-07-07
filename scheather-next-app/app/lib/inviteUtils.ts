import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebaseConfig";

export async function updateInviteStatus(eventId: string, userId: string, newStatus: string) {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (eventSnap.exists()) {
        const eventData = eventSnap.data();
        const updatedInviteList = eventData.inviteList.map((invitee: any) =>
            invitee.uid === userId ? { ...invitee, status: newStatus } : invitee
        );
        await updateDoc(eventRef, { inviteList: updatedInviteList });
    }
} 