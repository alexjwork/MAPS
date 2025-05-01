import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB7Cgy0TCv87IAyxqZ1UV00YcQFXwRGimw",
  authDomain: "maps-cbe52.firebaseapp.com",
  projectId: "maps-cbe52",
  storageBucket: "maps-cbe52.firebasestorage.app",
  messagingSenderId: "653507156074",
  appId: "1:653507156074:web:e1c0ba1ad56e14ca945213",
  measurementId: "G-KTP1X8JYXD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;