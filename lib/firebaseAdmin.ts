import { initializeApp, getApps, cert } from "firebase-admin/app";

if (!getApps().length) {
  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      console.warn("Firebase Admin credentials not fully configured. Skipping initialization during build.");
    }
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

// We don't need to export admin anymore, we just import getAuth() where needed.
export {};
