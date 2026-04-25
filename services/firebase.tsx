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
  deleteDoc,
} from "firebase/firestore";
import { deleteUser as deleteFirebaseAuthUser } from "firebase/auth";
import { auth, database } from "./firebaseConfig";
import { getDateKey } from "../utils/dateUtils";
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

export const deleteDocument = async (collection: string, email: string) => {
  try {
    const docRef = doc(database, collection, email);
    await deleteDoc(docRef);
    console.log(`Document deleted in ${collection} with email ${email}`);
    return true;
  } catch (error) {
    console.log(`Error deleting document in ${collection} with email ${email}:`, error);
    return false;
  }
};

/** Deletes all documents in a collection (single query page). */
const deleteAllInCollection = async (colRef: ReturnType<typeof collection>) => {
  const snapshot = await getDocs(colRef);
  await Promise.all(snapshot.docs.map((d) => deleteDoc(d.ref)));
};

/**
 * Removes Firestore data under users/{email}: nested foodEntries per day, then days, then the user doc.
 * Client SDK has no recursive delete; paths must match app schema (users → days → foodEntries).
 */
const deleteUserFirestoreTree = async (email: string) => {
  const daysRef = collection(database, "users", email, "days");
  const daysSnap = await getDocs(daysRef);

  for (const dayDoc of daysSnap.docs) {
    const foodEntriesRef = collection(
      database,
      "users",
      email,
      "days",
      dayDoc.id,
      "foodEntries",
    );
    await deleteAllInCollection(foodEntriesRef);
    await deleteDoc(dayDoc.ref);
  }
  console.log(`🔥🧯 Deleting user and Firestore data for ${email}`);
  await deleteDoc(doc(database, "users", email));
};

export const deleteUser = async (email: string) => {
  try {
    const current = auth.currentUser;
    if (
      !current?.email ||
      current.email.toLowerCase() !== email.toLowerCase()
    ) {
      console.log(
        "deleteUser: no signed-in user or email does not match current session",
      );
      return false;
    }

    await deleteUserFirestoreTree(email);
    await deleteFirebaseAuthUser(current);
    console.log(`🔥🧯 User and Firestore data deleted for ${email}`);
    return true;
  } catch (error) {
    console.log(`Error deleting user with email ${email}:`, error);
    return false;
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
    console.log(`🔥🧯 Document set in ${collection} with email ${email}`);
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
    console.log(`🔥🧯 Document updated in ${collection} with email ${email}`);
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
    console.log(`🔥🧯 Document updated in ${collection} with email ${email}`);
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
    console.log(`🔥🧯 Document added to diet in users with email ${email}`);
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
      console.log(`🔥🧯 Document set in users with email ${email}`);
      return newDay;
    } else {
      await updateDoc(dayRef, {
        "progress.steps": steps || 0,
        "points.base": points?.base ?? 0,
        "points.stepBonus": points?.stepBonus ?? 0,
        "points.total": points?.total ?? 0,
      });
      const freshSnap = await getDoc(dayRef);
      console.log(`🔥🧯 Document updated in users with email ${email}`);
      return freshSnap.exists() ? freshSnap.data() : daySnap.data();
    }
  } catch (error) {
    console.log("Error syncing today:", error);
  }
};

export const getDaysProgress = async (email: string) => {
  try {
    const daysRef = collection(database, "users", email, "days");
    const daysSnap = await getDocs(daysRef);
    const days = daysSnap.docs.map((doc) => doc.data());

    // Return only arrays with dateKey values
    const allDone: string[] = [];
    const someDone: string[] = [];

    for (const day of days) {
      const completion = day.completion || {};
      const completionValues = Object.values(completion);

      if (completionValues.length === 0) continue;

      const allTrue = completionValues.every((v) => v === true);
      const anyTrue = completionValues.some((v) => v === true);

      if (allTrue) {
        allDone.push(day.dateKey);
      } else if (anyTrue) {
        someDone.push(day.dateKey);
      }
    }

    return { allDone, someDone };
  } catch (error) {
    console.log(`Error getting days in users with email ${email}:`, error);
    return { allDone: [], someDone: [] };
  }
};
