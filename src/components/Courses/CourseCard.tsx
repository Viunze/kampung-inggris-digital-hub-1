// src/components/Courses/CourseCard.tsx

import React from 'react';
import Card from '../UI/Card';
import Link from 'next/link';
import Image from 'next/image';
import { CourseInstitution } from '@/types/models';

interface CourseCardProps {
  course: CourseInstitution;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Placeholder untuk rating bintang
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<svg key={i} className="w-4 h-4 text-java-gold inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>);
      } else {
        stars.push(<svg key={i} className="w-4 h-4 text-gray-300 inline-block" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>);
      }
    }
    return stars;
  };

  return (
    <Link href={`/courses/${course.id}`} legacyBehavior>
      <a className="block h-full"> {/* Memastikan seluruh kartu dapat diklik */}
        <Card className="flex flex-col h-full overflow-hidden hover:shadow-jawa-deep transition-shadow duration-300">
          {course.photos && course.photos.length > 0 && (
            <div className="relative w-full h-48 bg-gray-200 overflow-hidden rounded-t-xl">
              <Image
                src={course.photos[0]}
                alt={course.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 hover:scale-105"
                unoptimized // Pertimbangkan untuk menghapus ini jika menggunakan optimasi gambar Next.js
              />
            </div>
          )}
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-xl font-bold text-java-brown-dark mb-2">{course.name}</h3>
            <p className="text-sm text-gray-600 mb-1 truncate">{course.address}</p>
            <p className="text-sm text-gray-600 mb-2 truncate">
              Program: {course.programs.join(', ')}
            </p>
            <div className="flex items-center text-sm mb-3">
              <div className="flex mr-2">{renderStars(course.rating)}</div>
              <span className="text-gray-700">({course.reviewCount} ulasan)</span>
            </div>
            <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xl font-bold text-java-green-dark">
                Rp {course.cost.toLocaleString('id-ID')}
              </span>
              <button className="px-3 py-1 bg-java-green-light text-java-brown-dark text-sm rounded-md hover:bg-java-green-dark hover:text-white transition-colors">
                Lihat Detail
              </button>
            </div>
          </div>
        </Card>
      </a>
    </Link>
  );
};

export default CourseCard;
