// src/lib/firestore.ts

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  DocumentReference, // Tambahkan ini
  UpdateData,       // Tambahkan ini
  WithFieldValue    // Tambahkan ini (jika belum ada)
} from 'firebase/firestore';

// Konfigurasi Firebase Anda (pastikan ini diatur dengan benar, mungkin dari file .env atau config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inisialisasi Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// --- CRUD Functions ---

/**
 * Mendapatkan satu dokumen dari koleksi berdasarkan ID.
 * @param collectionName Nama koleksi.
 * @param id ID dokumen.
 * @returns Dokumen dengan ID-nya, atau null jika tidak ditemukan.
 */
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Memastikan id dokumen disertakan dalam data
    return { ...docSnap.data(), id: docSnap.id } as T & { id: string };
  } else {
    return null;
  }
}

/**
 * Mendapatkan semua dokumen dari koleksi.
 * @param collectionName Nama koleksi.
 * @returns Array dokumen, masing-masing dengan ID-nya.
 */
export async function getCollection<T extends DocumentData>(
  collectionName: string
): Promise<(T & { id: string })[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T & { id: string }));
}

/**
 * Menambahkan dokumen baru ke koleksi.
 * @param collectionName Nama koleksi.
 * @param data Data dokumen yang akan ditambahkan.
 * @returns ID dokumen baru yang dibuat.
 */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T> // Gunakan WithFieldValue untuk tipe data yang akan ditambahkan
): Promise<string> {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
}

/**
 * Memperbarui dokumen yang sudah ada.
 * @param collectionName Nama koleksi.
 * @param id ID dokumen yang akan diperbarui.
 * @param data Data yang akan diperbarui.
 */
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: UpdateData<T> // Menggunakan UpdateData<T> agar tipe yang diupdate lebih spesifik
): Promise<void> {
  // Buat referensi koleksi yang type-aware terlebih dahulu
  const colRef = collection(db, collectionName);
  // Kemudian buat referensi dokumen dari koleksi yang type-aware,
  // dan cast secara eksplisit ke DocumentReference dengan tipe T.
  const docRef = doc(colRef, id) as DocumentReference<T>;

  await updateDoc(docRef, data);
}

/**
 * Menghapus dokumen dari koleksi.
 * @param collectionName Nama koleksi.
 * @param id ID dokumen yang akan dihapus.
 */
export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// --- Query Functions (Contoh, bisa dikembangkan) ---

/**
 * Mencari dokumen di koleksi dengan kondisi tertentu.
 * @param collectionName Nama koleksi.
 * @param field Bidang untuk dikueri.
 * @param operator Operator perbandingan (misalnya "==").
 * @param value Nilai untuk dibandingkan.
 * @returns Array dokumen yang cocok dengan ID-nya.
 */
export async function queryDocuments<T extends DocumentData>(
  collectionName: string,
  field: string,
  operator: '==' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in', // Contoh operator
  value: any
): Promise<(T & { id: string })[]> {
  const q = query(collection(db, collectionName), where(field, operator, value));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T & { id: string }));
}

/**
 * Mendapatkan dokumen dengan paginasi.
 * @param collectionName Nama koleksi.
 * @param limitCount Jumlah dokumen per halaman.
 * @param lastDocSnapshot Snapshot dokumen terakhir dari halaman sebelumnya.
 * @returns Objek berisi array dokumen dan snapshot dokumen terakhir.
 */
export async function getPaginatedDocuments<T extends DocumentData>(
  collectionName: string,
  limitCount: number,
  lastDocSnapshot?: QueryDocumentSnapshot | null
): Promise<{ documents: (T & { id: string })[]; lastVisible: QueryDocumentSnapshot | null }> {
  let q;
  if (lastDocSnapshot) {
    q = query(
      collection(db, collectionName),
      orderBy('createdAt', 'desc'), // Pastikan ada bidang 'createdAt' atau sesuaikan
      startAfter(lastDocSnapshot),
      limit(limitCount)
    );
  } else {
    q = query(
      collection(db, collectionName),
      orderBy('createdAt', 'desc'), // Pastikan ada bidang 'createdAt' atau sesuaikan
      limit(limitCount)
    );
  }

  const querySnapshot = await getDocs(q);
  const documents = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as T & { id: string }));
  const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

  return { documents, lastVisible };
}
