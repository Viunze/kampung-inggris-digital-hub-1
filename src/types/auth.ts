// src/types/auth.ts

// Interface untuk kredensial autentikasi (misalnya untuk login atau register)
// PENTING: Pastikan ada kata kunci 'export' di sini!
export interface AuthCredentials {
  email: string;
  password: string;
}

// Anda bisa menambahkan interface lain yang berhubungan dengan auth di sini,
// misalnya untuk data user yang lebih detail dari Firebase Auth
// export interface UserAuthData {
//   uid: string;
//   email: string;
//   displayName?: string;
//   photoURL?: string;
// }
