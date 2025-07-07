// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd1v6kdxvwMd8xhoRXUgI1wIS9p6qkq7s",
  authDomain: "scheather-4c6b7.firebaseapp.com",
  projectId: "scheather-4c6b7",
  storageBucket: "scheather-4c6b7.firebasestorage.app",
  messagingSenderId: "719266527211",
  appId: "1:719266527211:web:e31ccad0961fa999f78bae"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// let analytics;
// if (typeof window !== "undefined") {
//   isSupported().then((yes) => {
//     if (yes) {
//       analytics = getAnalytics(app);
//     }
//   });
// }


// Export the auth & storage services if needed
// Do NOT export analytics at the top level! Use getClientAnalytics below for client-only analytics.
export const auth = getAuth(app);
export const storage = getStorage(app);
const db = getFirestore(app);
export { app, db };

export async function getClientAnalytics() {
  if (typeof window !== "undefined") {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (await isSupported()) {
      return getAnalytics(app);
    }
  }
  return null;
}

