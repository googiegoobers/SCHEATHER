
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebaseConfig"; 

export interface Task {
  id?: string;           // id is optional when sending to Firestore
  text: string;
  completed: boolean;
  starred: boolean;
  createdAt?: any;
  updatedAt?: any;
}

function tasksCol(uid: string) {
  return collection(db, "toDoList", uid, "tasks"); // tweak if your path differs
}

export function subscribeToTasks(cb: (tasks: Task[]) => void) {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    console.warn("subscribeToTasks: No user logged in.");
    return () => {}; // no-op unsubscribe
  }

  const q = query(tasksCol(uid), orderBy("createdAt", "asc"));
  return onSnapshot(q, snap =>
    cb(
      snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<Task, "id">),
      }))
    )
  );
}

export async function addTask(text: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not logged in");

  await addDoc(tasksCol(uid), {
    text,
    completed: false,
    starred: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function patchTask(
  id: string,
  data: Partial<Pick<Task, "text" | "completed" | "starred">>
) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not logged in");

  await updateDoc(doc(tasksCol(uid), id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(id: string) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not logged in");
  await deleteDoc(doc(tasksCol(uid), id));
}