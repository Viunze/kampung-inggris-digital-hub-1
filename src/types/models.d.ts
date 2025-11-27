// src/types/models.d.ts

// Definisi untuk pengguna
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Tambahan info profil
  bio?: string;
  isStudent?: boolean;
}

// Definisi untuk Lembaga Kursus
export interface CourseInstitution {
  id: string;
  name: string;
  address: string;
  contact: string;
  programs: string[]; // Contoh: ["Grammar Boost", "English Conversation"]
  cost: number; // Biaya per bulan/paket
  description: string;
  photos: string[]; // Array URL dari Cloud Storage
  rating: number; // Rata-rata rating
  reviewCount: number;
}

// Definisi untuk Kos/Homestay
export interface KosHomestay {
  id: string;
  name: string;
  address: string;
  ownerContact: string;
  pricePerMonth: number;
  facilities: string[]; // Contoh: ["WiFi", "KM Dalam", "AC"]
  description: string;
  photos: string[]; // Array URL dari Cloud Storage
  isVerified: boolean;
  distanceToCenter: number; // Dalam menit bersepeda
}

// Definisi untuk Postingan Forum (Angkringan Digital)
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  timestamp: Date;
  repliesCount: number;
  likesCount: number;
  topicId?: string; // Jika ada sistem topik
}

// Definisi untuk Balasan Forum
export interface ForumReply {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  timestamp: Date;
}

// Definisi untuk Ulasan (Review)
export interface Review {
  id: string;
  targetId: string; // ID lembaga kursus atau kos
  targetType: 'course' | 'kos';
  authorId: string;
  authorName: string;
  rating: number; // Skala 1-5
  comment: string;
  timestamp: Date;
}
