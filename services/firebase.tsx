import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { database } from "./firebaseConfig";


export const getDocument = async (collection: string, id: string) => {
  try {
    const docRef = doc(database, collection, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log(`No such document in ${collection} with id ${id}!`);
      return null;
    }
  } catch (error) {
    console.log(`Error getting document in ${collection} with id ${id}:`, error);
    return null;
  }
};

export const setDocument = async (collection: string, id: string, data: any) => {
  try {
    const docRef = doc(database, collection, id);
    await setDoc(docRef, data);
    console.log(`Document set in ${collection} with id ${id}`);
    return true;
  } catch (error) {
    console.log(`Error setting document in ${collection} with id ${id}:`, error);
    return false;
  }
};


export const updateDocument = async (collection: string, id: string, data: any) => {
  try {
    const docRef = doc(database, collection, id);
    await updateDoc(docRef, data);
    console.log(`Document updated in ${collection} with id ${id}`);
    return true;
  } catch (error) {
    console.log(`Error updating document in ${collection} with id ${id}:`, error);
    return false;
  }
};
