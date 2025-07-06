// backfill-users.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // path to your downloaded key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const db = admin.firestore();

async function backfillUsers() {
  let nextPageToken;
  do {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    for (const userRecord of listUsersResult.users) {
      const { uid, email, displayName, photoURL } = userRecord;
      await db.collection("users").doc(uid).set({
        uid,
        email,
        displayName: displayName || "",
        photoURL: photoURL || "",
      }, { merge: true });
      console.log(`Synced user: ${email}`);
    }
    nextPageToken = listUsersResult.pageToken;
  } while (nextPageToken);
  console.log("Backfill complete!");
}

backfillUsers().catch(console.error);