import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";
// tysta varningar
import { setLogLevel } from "firebase/app";
// Ange önskad loggnivå
setLogLevel("silent"); // Tysta loggnivån

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: "kudoo-36de9.firebaseapp.com",
  projectId: "kudoo-36de9",
  storageBucket: "kudoo-36de9.firebasestorage.app",
  messagingSenderId: "10789844466",
  appId: "1:10789844466:web:ca6c4e916b5013686b276b",
  measurementId: "G-EXHLTWFB7S",
};

// Initialisera Firebase-appen
const firebaseApp = initializeApp(firebaseConfig);

// Hämta Firestore-databasen
export const database = getFirestore(firebaseApp);

// Hämta Storage-databasen
export const storage = getStorage(firebaseApp);

// Hämta Auth-instansen
// Sessionen sparas i AsyncStorage så att anonyma konton överlever omstart av appen
const createAuth = () => {
  try {
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // Redan initierad (t.ex. vid hot reload)
    if (error?.code === "auth/already-initialized") return getAuth(firebaseApp);
    throw error;
  }
};
export const auth = createAuth();


