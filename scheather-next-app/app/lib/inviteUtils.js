import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export async function updateInviteStatus(eventId, userId, newStatus) {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    if (eventSnap.exists()) {
        const eventData = eventSnap.data();
        const updatedInviteList = eventData.inviteList.map(invitee =>
            invitee.uid === userId ? { ...invitee, status: newStatus } : invitee
        );
        await updateDoc(eventRef, { inviteList: updatedInviteList });
    }
}