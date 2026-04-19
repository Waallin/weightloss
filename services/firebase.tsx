import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc,
  increment,
} from "firebase/firestore";
import { database } from "./firebaseConfig";
import { getDateKey } from "../utils/dateUtils";
import useTodayProgressStore from "../stores/useTodayProgressStore";
import * as haptics from "expo-haptics";

export const getDocument = async (collection: string, email: string) => {
  try {
    const docRef = doc(database, collection, email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`No such document in ${collection} with email ${email}!`);
      return null;
    }
  } catch (error) {
    console.log(
      `Error getting document in ${collection} with email ${email}:`,
      error,
    );
    return null;
  }
};

export const getDocuments = async (alias: string) => {
  try {
    const docsRef = collection(database, alias);
    const docsSnap = await getDocs(docsRef);
    return docsSnap.docs.map((doc) => doc.data());
  } catch (error) {
    console.log(`Error getting documents in ${alias}:`, error);
    return [];
  }
};

export const setDocument = async (
  collection: string,
  email: string,
  data: any,
) => {
  try {
    const docRef = doc(database, collection, email);
    await setDoc(docRef, data);
    console.log(`Document set in ${collection} with email ${email}`);
    return true;
  } catch (error) {
    console.log(
      `Error setting document in ${collection} with email ${email}:`,
      error,
    );
    return false;
  }
};

export const updateDocument = async (
  collection: string,
  email: string,
  data: any,
) => {
  try {
    const docRef = doc(database, collection, email);
    await updateDoc(docRef, data);
    console.log(`Document updated in ${collection} with email ${email}`);
    return true;
  } catch (error) {
    console.log(
      `Error updating document in ${collection} with email ${email}:`,
      error,
    );
    return false;
  }
};

export const updateTodayProgress = async (email: string, data: any) => {
  try {
    haptics.impactAsync(haptics.ImpactFeedbackStyle.Light);
    const docRef = doc(database, "users", email, "days", getDateKey());
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.log(
      `Error updating today progress in users with email ${email}:`,
      error,
    );
    return false;
  }
};

export const addToDiet = async (email: string, payload: any) => {
  try {
    const docRef = collection(
      database,
      "users",
      email,
      "days",
      getDateKey(),
      "foodEntries"
    );
     await addDoc(docRef, payload);

    await updateTodayProgress(email, {
      "points.used": increment(payload.points),
    });
    

    return true;
  } catch (error) {
    console.log(`Error adding to diet in users with email ${email}:`, error);
    return false;
  }
};

export const syncToday = async (
  email: string,
  steps?: number,
  points?: any,
) => {
  try {
    const dateKey = getDateKey();
   
    const dayRef = doc(database, "users", email, "days", dateKey);
    const daySnap = await getDoc(dayRef);

    if (!daySnap.exists()) {
      const newDay = {
        dateKey,
        
        progress: {
          water: 0,
          steps: 0,
        },

        points: {
          base: points?.base ?? 0,
          stepBonus: points?.stepBonus ?? 0,
          total: points?.total ?? 0,
          used: 0,
        },

        completion: {
          water: false,
          steps: false,
          points: false,
        },

        weight: {
          logged: false,
          value: null,
        },

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(dayRef, newDay);
      return newDay;
    } else {
      await updateDoc(dayRef, {
        "progress.steps": steps || 0,
        "points.base": points?.base ?? 0,
        "points.stepBonus": points?.stepBonus ?? 0,
        "points.total": points?.total ?? 0,
      });
      const freshSnap = await getDoc(dayRef);
      return freshSnap.exists() ? freshSnap.data() : daySnap.data();
    }
  } catch (error) {
    console.log("Error syncing today:", error);
  }
};
