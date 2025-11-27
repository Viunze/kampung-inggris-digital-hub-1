// tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}', // Mungkin tidak diperlukan jika tidak pakai App Router, tapi biarkan saja
  ],
  theme: {
    extend: {
      colors: {
        'java-brown-dark': '#4A3728', // Cokelat tua seperti kayu jati
        'java-brown-medium': '#7B5E4A', // Cokelat medium
        'java-green-light': '#8CBF8F', // Hijau daun terang
        'java-green-dark': '#3F7D42', // Hijau daun gelap
        'java-cream': '#F8F4E6',     // Krem bersih
        'java-gold': '#DAA520',      // Aksen emas
        'java-orange': '#FFC107',    // Oranye untuk aksen hangat (Angkringan)
      },
      fontFamily: {
        // Contoh font modern, bisa diganti dengan Google Fonts yang lebih cocok
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        // 'jawa-accent': ['CustomJawaFont', 'serif'], // Contoh untuk font aksen Jawa (perlu impor font eksternal)
      },
      boxShadow: {
        'jawa-soft': '0 4px 10px rgba(0, 0, 0, 0.08)', // Bayangan lembut untuk kartu
        'jawa-deep': '0 8px 20px rgba(0, 0, 0, 0.15)', // Bayangan lebih dalam
      },
    },
  },
  plugins: [],
}
export default config
