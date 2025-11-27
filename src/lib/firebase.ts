// src/lib/firebase.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, doc, deleteDoc, query, where, DocumentData, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// --- Konfigurasi Firebase Anda ---
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi Service
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// --- Fungsi Add Document yang Hilang ---

/**
 * Menambahkan dokumen baru ke koleksi Firestore tertentu.
 * @param collectionName Nama koleksi (e.g., 'forumPosts').
 * @param data Objek data yang akan ditambahkan.
 * @returns Promise yang resolve dengan ID dokumen baru.
 */
export async function addDocument<T extends DocumentData>(
    collectionName: string, 
    data: Omit<T, 'id'> // Memastikan Tipe data yang dikirim tidak memiliki 'id'
): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            // Secara otomatis menambahkan serverTimestamp jika tidak ada
            timestamp: data.timestamp || serverTimestamp(), 
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Failed to add document to Firestore.");
    }
}

// --- Fungsi Delete Document (Mungkin juga diperlukan) ---
// Kita tambahkan karena digunakan di [id].tsx
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, collectionName, id));
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Failed to delete document from Firestore.");
    }
}

// --- Export Service dan Utility ---
export { app, auth, db, storage, collection, query, where, getDocs, doc, deleteDoc, Timestamp };
