'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { BookSummary, BooksResponse } from '@/lib/types';

export default function BooksPage() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      
      if (!response.ok) {
        throw new Error('絵本一覧の取得に失敗しました');
      }
      
      const data: BooksResponse = await response.json();
      setBooks(data.books);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: number) => {
    router.push(`/books/${bookId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <div>エラーが発生しました</div>
          <div className="text-sm mt-2">{error}</div>
          <button 
            onClick={fetchBooks}
            className="mt-4 px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">絵本ライブラリ</h1>
          <p className="text-blue-200">あなたの物語を読んでみましょう</p>
        </div>

        {books.length === 0 ? (
          <div className="text-center text-white">
            <div className="text-xl mb-4">まだ絵本がありません</div>
            <p className="text-blue-200">最初の絵本を作成してみましょう！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                onClick={() => handleBookClick(book.id)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{book.title}</h3>
                  {book.description && (
                    <p className="text-blue-200 text-sm line-clamp-3">{book.description}</p>
                  )}
                </div>
                
                <div className="text-xs text-blue-300">
                  作成日: {new Date(book.created_at).toLocaleDateString('ja-JP')}
                </div>
                
                <div className="mt-4 text-right">
                  <span className="text-white text-sm font-medium">読む →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
