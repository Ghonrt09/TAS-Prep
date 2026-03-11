import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type UserProfile = {
  displayName: string | null;
  email: string;
  createdAt: { seconds: number } | null;
  updatedAt: { seconds: number } | null;
};

export type UserProgress = {
  totalAnswered: number;
  correct: number;
  incorrect: number;
  lastPracticeAt: { seconds: number } | null;
};

const USERS_COLLECTION = "users";
const PROGRESS_DOC = "progress";

export async function getOrCreateUserProfile(
  uid: string,
  email: string,
  displayName: string | null
): Promise<UserProfile | null> {
  if (!db) return null;
  const ref = doc(db, USERS_COLLECTION, uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  const data: UserProfile = {
    displayName,
    email,
    createdAt: null,
    updatedAt: null,
  };
  await setDoc(ref, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { ...data, createdAt: { seconds: Math.floor(Date.now() / 1000) }, updatedAt: { seconds: Math.floor(Date.now() / 1000) } };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function getUserProgress(uid: string): Promise<UserProgress | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid, PROGRESS_DOC, "summary"));
  return snap.exists() ? (snap.data() as UserProgress) : null;
}

export async function saveUserProgress(
  uid: string,
  data: { totalAnswered: number; correct: number; incorrect: number }
): Promise<void> {
  if (!db) return;
  const ref = doc(db, USERS_COLLECTION, uid, PROGRESS_DOC, "summary");
  const existing = await getDoc(ref);
  const next = {
    ...data,
    lastPracticeAt: serverTimestamp(),
  };
  if (existing.exists()) {
    await updateDoc(ref, next);
  } else {
    await setDoc(ref, next);
  }
}
