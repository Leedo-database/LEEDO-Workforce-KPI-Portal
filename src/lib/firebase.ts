import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  getDocs,
  writeBatch,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore using configured databaseId
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection established successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Running in offline mode, local cache will be used.');
    } else {
      console.log('[Firebase] Initialized with database:', firebaseConfig.firestoreDatabaseId);
    }
    return false;
  }
}

// Background sync helpers
export async function syncDocToFirestore(collectionName: string, docId: string, data: any) {
  try {
    const docRef = doc(db, collectionName, String(docId));
    // Clean undefined values before writing to Firestore
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, cleanData, { merge: true });
  } catch (err) {
    console.warn(`[Firebase] Failed to sync ${collectionName}/${docId}:`, err);
  }
}

export async function fetchCollectionFromFirestore<T = any>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const results: T[] = [];
    snap.forEach((d) => {
      results.push(d.data() as T);
    });
    return results;
  } catch (err) {
    console.warn(`[Firebase] Failed to fetch collection ${collectionName}:`, err);
    return [];
  }
}

export async function fetchDocFromFirestore<T = any>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, String(docId));
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as T;
    }
    return null;
  } catch (err) {
    console.warn(`[Firebase] Failed to fetch doc ${collectionName}/${docId}:`, err);
    return null;
  }
}

export async function deleteDocFromFirestore(collectionName: string, docId: string) {
  try {
    const { deleteDoc: deleteDocument } = await import('firebase/firestore');
    const docRef = doc(db, collectionName, String(docId));
    await deleteDocument(docRef);
  } catch (err) {
    console.warn(`[Firebase] Failed to delete doc ${collectionName}/${docId}:`, err);
  }
}
