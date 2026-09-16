import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore, type Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDInNrhKJ9NMQFq3Rvk6WHJojRqXUzgOnA",
  authDomain: "purplepufff-1.firebaseapp.com",
  projectId: "purplepufff-1",
  storageBucket: "purplepufff-1.firebasestorage.app",
  messagingSenderId: "5228897423",
  appId: "1:5228897423:web:97d1cc1a6534a2a0dffcfa",
  measurementId: "G-VQWQ1GV46B"
};

export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true
  });
} catch {
  firestoreInstance = getFirestore(app);
}

export const db: Firestore = firestoreInstance;
export const firestore: Firestore = db;
export default db;

