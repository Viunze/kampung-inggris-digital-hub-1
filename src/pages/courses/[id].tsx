// src/pages/courses/[id].tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/Layout/MainLayout';
import Image from 'next/image';
import { getDocById, addReview } from '@/lib/firestore'; // Impor fungsi dari firestore.ts
import { CourseInstitution, Review } from '@/types/models';
import { useAuth } from '@/hooks/useAuth'; // Untuk mendapatkan user yang login
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

const CourseDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth(); // Ambil user dari AuthContext

  const [course, setCourse] = useState<CourseInstitution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (id && typeof id === 'string') {
        try {
          setLoading(true);
          const courseData = await getDocById<CourseInstitution>('courseInstitutions', id);
          if (courseData) {
            setCourse(courseData);
          } else {
            setError('Lembaga kursus tidak ditemukan.');
          }
        } catch (err: any) {
          setError(err.message || 'Gagal memuat detail kursus.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourse();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Anda harus login untuk memberikan ulasan.');
      return;
    }
    if (newReviewRating === 0 || !newReviewComment.trim()) {
      setReviewError('Rating dan komentar harus diisi.');
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    try {
      const reviewData: Omit<Review, 'id'> = {
        targetId: id as string,
        targetType: 'course',
        authorId: user.uid,
        authorName: user.displayName || user.email || 'Anonim',
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        timestamp: Timestamp.now(), // Menggunakan Firestore Timestamp
      };
      await addReview(reviewData);
      setReviewSuccess('Ulasan Anda berhasil ditambahkan!');
      setNewReviewRating(0);
      setNewReviewComment('');
      // TODO: Perbarui rata-rata rating kursus di Firestore (ini butuh Cloud Function)
    } catch (err: any) {
      setReviewError(err.message || 'Gagal menambahkan ulasan.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || authLoading) {
    return <MainLayout title="Memuat..."><p className="text-center text-lg mt-10">Memuat detail kursus...</p></MainLayout>;
  }

  if (error) {
    return <MainLayout title="Error"><p className="text-center text-red-500 text-lg mt-10">{error}</p></MainLayout>;
  }

  if (!course) {
    return <MainLayout title="Tidak Ditemukan"><p className="text-center text-gray-600 text-lg mt-10">Lembaga kursus tidak ditemukan.</p></MainLayout>;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg key={i} className={`w-5 h-5 ${i < rating ? 'text-java-gold' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };


  return (
    <MainLayout title={course.name}>
      <div className="bg-white rounded-xl shadow-jawa-soft p-8">
        {/* Gambar Utama */}
        {course.photos && course.photos.length > 0 && (
          <div className="relative w-full h-96 bg-gray-200 overflow-hidden rounded-lg mb-6">
            <Image
              src={course.photos[0]}
              alt={course.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
              unoptimized
            />
          </div>
        )}

        {/* Informasi Utama */}
        <div className="flex justify-between items-start mb-6 border-b pb-4 border-gray-100">
          <div>
            <h1 className="text-4xl font-bold text-java-brown-dark">{course.name}</h1>
            <p className="text-gray-600 text-lg mt-2">{course.address}</p>
            <div className="flex items-center mt-3">
              <div className="flex mr-2">{renderStars(course.rating)}</div>
              <span className="text-gray-700">({course.reviewCount} ulasan)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-java-green-dark">
              Rp {course.cost.toLocaleString('id-ID')}
            </span>
            <p className="text-sm text-gray-500">per bulan/paket</p>
          </div>
        </div>

        {/* Deskripsi & Program */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-java-brown-dark mb-3">Deskripsi</h2>
          <p className="text-gray-700 leading-relaxed mb-4">{course.description}</p>

          <h3 className="text-xl font-bold text-java-brown-dark mb-2">Program Unggulan</h3>
          <ul className="list-disc list-inside text-gray-700 pl-4">
            {course.programs.map((program, index) => (
              <li key={index} className="mb-1">{program}</li>
            ))}
          </ul>
        </div>

        {/* Informasi Kontak */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-java-brown-dark mb-3">Kontak & Lokasi</h2>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Telepon/WA:</span> {course.contact}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Alamat:</span> {course.address}
          </p>
          {/* Bisa ditambahkan embed peta Google Maps di sini */}
        </div>

        {/* Bagian Ulasan */}
        <div>
          <h2 className="text-2xl font-bold text-java-brown-dark mb-4">Ulasan Pelajar</h2>

          {/* Form Ulasan Baru */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-100">
            <h3 className="text-xl font-bold text-java-brown-dark mb-3">Tulis Ulasan Anda</h3>
            {!user ? (
              <p className="text-gray-600">
                <Link href="/auth/login" legacyBehavior><a className="text-java-green-dark hover:underline font-semibold">Login</a></Link> untuk memberikan ulasan.
              </p>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Rating Bintang
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`text-3xl ${star <= newReviewRating ? 'text-java-gold' : 'text-gray-300'} hover:text-java-gold transition-colors`}
                        onClick={() => setNewReviewRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review-comment" className="block text-gray-700 text-sm font-semibold mb-2">
                    Komentar Anda
                  </label>
                  <textarea
                    id="review-comment"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-java-green-light focus:outline-none transition-colors h-24"
                    placeholder="Bagikan pengalaman Anda..."
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                {reviewError && <p className="text-red-500 text-sm">{reviewError}</p>}
                {reviewSuccess && <p className="text-green-600 text-sm">{reviewSuccess}</p>}
                <button
                  type="submit"
                  className="bg-java-green-dark text-white py-2 px-6 rounded-lg font-semibold hover:bg-java-green-light transition-colors"
                  disabled={submittingReview}
                >
                  {submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            )}
          </div>

          {/* Daftar Ulasan yang Ada */}
          <div className="space-y-4">
            {/* TODO: Ambil ulasan dari Firestore secara real-time */}
            <p className="text-gray-500 italic">
              (Daftar ulasan akan ditampilkan di sini. Perlu implementasi `useFirestoreData` untuk koleksi `reviews` dengan filter `targetId`.)
            </p>
            {/* Contoh Ulasan Dummy */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-java-brown-dark mr-2">Budi Santoso</span>
                <div className="flex">{renderStars(4)}</div>
                <span className="text-gray-500 text-sm ml-auto">2 hari yang lalu</span>
              </div>
              <p className="text-gray-700">"Pengajar sangat profesional dan suasana belajar kondusif. Sangat direkomendasikan!"</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center mb-2">
                <span className="font-semibold text-java-brown-dark mr-2">Ani Ramadhani</span>
                <div className="flex">{renderStars(5)}</div>
                <span className="text-gray-500 text-sm ml-auto">1 minggu yang lalu</span>
              </div>
              <p className="text-gray-700">"Materi mudah dipahami dan banyak teman baru. Senang sekali belajar di sini!"</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetailPage;
