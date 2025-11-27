// src/lib/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// Untuk Firebase JS SDK v7.20.0 dan yang lebih baru, measurementId adalah opsional
const firebaseConfig = {
  // Mengambil nilai dari Environment Variables yang sudah diatur di Vercel
  // Pastikan nama variabel sesuai dengan yang Anda masukkan di Vercel
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
// Pastikan Firebase hanya diinisialisasi sekali, terutama penting untuk Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi layanan Firebase yang akan kita gunakan
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Inisialisasi Analytics, hanya jika berjalan di lingkungan browser (sisi klien)
// getAnalytics() memerlukan akses ke objek window, yang tidak tersedia selama SSR
let analytics: any; // Gunakan 'any' untuk fleksibilitas jika tipe belum sepenuhnya diimpor
if (typeof window !== 'undefined' && app.name) {
  // Hanya panggil getAnalytics jika app sudah diinisialisasi dan di lingkungan browser
  analytics = getAnalytics(app);
}

// Export semua layanan yang dibutuhkan agar dapat diimpor dan digunakan di bagian lain aplikasi
export { app, auth, db, storage, analytics };
