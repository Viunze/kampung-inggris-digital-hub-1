// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import MainLayout from '@/components/Layout/MainLayout';
import { AuthProvider } from '@/hooks/useAuth';
import { useRouter } from 'next/router'; // Impor useRouter

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter(); // Inisialisasi useRouter
  const noLayoutPages = ['/auth/login', '/auth/register', '/auth/forgot-password']; // Tambahkan halaman tanpa layout
  const shouldApplyLayout = !noLayoutPages.includes(router.pathname); // Gunakan router.pathname

  return (
    <AuthProvider> {/* Bungkus seluruh aplikasi dengan AuthProvider */}
      {shouldApplyLayout ? (
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

export default MyApp;
