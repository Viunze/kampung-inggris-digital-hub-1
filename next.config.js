// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Abaikan semua error TypeScript saat build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Abaikan error ESLint agar tidak stop build
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;
