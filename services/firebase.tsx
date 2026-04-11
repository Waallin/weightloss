import { doc, getDoc } from "firebase/firestore";
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
