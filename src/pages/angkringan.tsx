// src/pages/angkringan.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { useForumPosts } from '@/hooks/useForumPosts';
import { addDocument } from '@/lib/firebase';
import { ForumPost } from '@/types/forum'; 
import { Timestamp } from 'firebase/firestore'; // Import Timestamp untuk konsistensi

const Angkringan = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading, error: postsError } = useForumPosts();
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Redirect jika user tidak login dan auth tidak sedang loading
    if (!user && !authLoading) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleSubmitPost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostContent.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Omit 'id' dan 'timestamp' karena Firestore yang akan mengaturnya
      type NewPostData = Omit<ForumPost, 'id' | 'timestamp'>;

      const newPost: NewPostData = {
        content: newPostContent.trim(),
        authorId: user.uid,
        authorName: user.displayName || 'Anonim',
        authorPhotoUrl: user.photoURL || undefined,
        likesCount: 0,
        likedBy: [],
        repliesCount: 0,
      };

      // Menggunakan Omit<ForumPost, 'id'> dan menambahkan Timestamp di sini
      await addDocument<Omit<ForumPost, 'id'>>('forumPosts', {
        ...newPost,
        timestamp: Timestamp.fromDate(new Date()), // Menggunakan Timestamp Firestore
      });

      setNewPostContent('');
    } catch (err: any) {
      console.error("Error adding forum post:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [user, newPostContent, isSubmitting]);

  if (authLoading || postsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Memuat...</p>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">Error memuat post: {postsError.message}</p>
      </div>
    );
  }

  // --- Rendering UI ---
  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Angkringan Diskusi</h1>

      {/* Form Post Baru */}
      <form onSubmit={handleSubmitPost} className="bg-white p-4 shadow-md rounded-lg mb-8">
        <textarea
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={3}
          placeholder="Apa yang ada di pikiranmu?"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={`mt-3 px-4 py-2 rounded-lg text-white font-semibold transition duration-200 ${
            !user || newPostContent.trim() === '' || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          disabled={!user || newPostContent.trim() === '' || isSubmitting}
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Post'}
        </button>
      </form>

      {/* Daftar Post */}
      <div className="space-y-4">
        {posts?.length === 0 ? (
          <p className="text-gray-500">Belum ada postingan. Jadilah yang pertama!</p>
        ) : (
          posts?.map((post) => (
            <div key={post.id} className="bg-white p-4 shadow rounded-lg">
              <div className="flex items-center mb-2">
                <img
                  src={post.authorPhotoUrl || '/default-avatar.png'}
                  alt={post.authorName}
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <p className="font-semibold">{post.authorName}</p>
                  <p className="text-xs text-gray-500">
                    {/* Konversi Firestore Timestamp ke string untuk ditampilkan */}
                    {post.timestamp ? post.timestamp.toDate().toLocaleString() : 'Baru saja'}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{post.content}</p>
              <div className="mt-3 flex space-x-4 text-sm text-gray-500">
                <span>❤️ {post.likesCount} Suka</span>
                <span>💬 {post.repliesCount} Komentar</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Angkringan;
