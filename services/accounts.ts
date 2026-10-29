import {
  OAuthProvider,
  linkWithCredential,
  signInAnonymously,
  signInWithCredential,
  type User,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { getDocument, updateDocument } from "./firebase";

/**
 * Dokument-id i `users/` kallas fortfarande `user.email` i resten av appen.
 * Gamla konton har e-posten som id, anonyma konton har Firebase-uid.
 * Anonyma konton markeras med `isAnonymous: true` tills de kopplats till Apple.
 */

export const isAnonymousUser = (user: any) => user?.isAnonymous === true;

export const startAnonymousSession = async (): Promise<User> => {
  // Återanvänd bara en anonym session, aldrig ett inloggat Apple-konto
  if (auth.currentUser?.isAnonymous) return auth.currentUser;
  const result = await signInAnonymously(auth);
  return result.user;
};

const appleCredential = (idToken: string) =>
  new OAuthProvider("apple.com").credential({ idToken });

/**
 * Kopplar Apple till det anonyma kontot. Datan ligger kvar på samma dokument.
 * Returnerar det uppdaterade användardokumentet.
 */
export const linkAppleToAnonymous = async (
  docId: string,
  idToken: string,
): Promise<{ docId: string; user: any } | null> => {
  const credential = appleCredential(idToken);
  let appleUser: User;
  try {
    if (!auth.currentUser) throw new Error("no-session");
    appleUser = (await linkWithCredential(auth.currentUser, credential)).user;
  } catch (e: any) {
    // Apple-kontot används redan (t.ex. efter ominstallation): logga in på det i stället
    if (e?.code === "auth/credential-already-in-use") {
      return restoreFromApple(idToken);
    }
    throw e;
  }

  const email = appleUser.email ?? undefined;
  const patch = { isAnonymous: false, ...(email ? { appleEmail: email } : {}) };
  await updateDocument("users", docId, patch);
  const user = await getDocument("users", docId);
  return user ? { docId, user } : null;
};

/** Hittar ett befintligt konto för Apple-inloggningen: e-postnyckel (gamla konton) eller uid. */
export const restoreFromApple = async (
  idToken: string,
): Promise<{ docId: string; user: any } | null> => {
  const result = await signInWithCredential(auth, appleCredential(idToken));
  const email = result.user.email;
  const candidates = [email, result.user.uid].filter(Boolean) as string[];
  for (const docId of candidates) {
    const user = await getDocument("users", docId);
    if (user) return { docId, user };
  }
  return null;
};
