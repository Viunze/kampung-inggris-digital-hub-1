// src/pages/index.tsx

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth'; // Akan dibuat nanti di Langkah 4

const LandingPage: React.FC = () => {
  const router = useRouter();
  // const { user, loading } = useAuth(); // Akan digunakan saat useAuth selesai

  useEffect(() => {
    // Simulasikan pengecekan login
    const isLoggedIn = localStorage.getItem('isLoggedIn'); // Contoh sangat sederhana, ganti dengan useAuth hook
    if (isLoggedIn === 'true') {
      router.push('/dashboard');
    } else {
      router.push('/auth/login'); // Arahkan ke halaman login jika belum login
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-java-cream text-java-brown-dark">
      <p>Memuat...</p>
    </div>
  );
};

export default LandingPage;
