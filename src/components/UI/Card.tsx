// src/components/UI/Card.tsx

import React from 'react';

// Definisikan props untuk komponen Card
interface CardProps {
  children: React.ReactNode; // Untuk konten di dalam Card
  className?: string;       // Untuk kelas Tailwind atau CSS tambahan
  onClick?: () => void;     // Properti onClick, opsional
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    // Meneruskan onClick ke elemen div
    // Perhatikan penggunaan `bg-white rounded-xl shadow-sm p-4` sebagai default styling
    // dan `className || ''` untuk menambahkan kelas kustom dari props
    <div
      className={`bg-white rounded-xl shadow-sm p-4 ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
