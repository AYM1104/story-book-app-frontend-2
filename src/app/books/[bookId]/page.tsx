'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { BookDetail } from '@/lib/types';

interface BookPageProps {
  params: Promise<{ bookId: string }>;
}

export default function BookDetailPage({ params }: BookPageProps) {
  const { bookId } = use(params);
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${bookId}`);
        
        if (!response.ok) {
          throw new Error('絵本の詳細取得に失敗しました');
        }
        
        const data: BookDetail = await response.json();
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const scrollToPage = (pageIndex: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const pageWidth = container.clientWidth;
      container.scrollTo({
        left: pageIndex * pageWidth,
        behavior: 'smooth'
      });
      setCurrentPage(pageIndex);
    }
  };

  const goToNextPage = () => {
    if (book && currentPage < book.pages.length - 1) {
      scrollToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      scrollToPage(currentPage - 1);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const pageWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const newCurrentPage = Math.round(scrollLeft / pageWidth);
      setCurrentPage(newCurrentPage);
    }
  };

  // 画像URLのバリデーション関数
  const isValidImageUrl = (url: string | null): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      // 相対パスかどうかチェック
      return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
    }
  };

  // 画像URLを正規化する関数
  const normalizeImageUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    try {
      // 絶対URLの場合はそのまま返す
      new URL(url);
      return url;
    } catch {
      // 相対パスの場合は、バックエンドのURLを付与
      if (url.startsWith('/')) {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}${url}`;
      }
      // その他の場合は無効として扱う
      return null;
    }
  };

  if (loading) {
    return (
      <div className="h-[100svh] bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">読み込み中...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="h-[100svh] bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <div>エラーが発生しました</div>
          <div className="text-sm mt-2">{error}</div>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100svh] bg-gradient-to-b from-blue-900 to-purple-900 flex flex-col">
      {/* ヘッダー */}
      <div className="flex-shrink-0 bg-black/20 backdrop-blur-sm">
        <Header />
        <div className="px-4 pb-2">
          <h1 className="text-white text-lg font-bold truncate">{book.title}</h1>
          <div className="text-blue-200 text-sm">
            {currentPage + 1} / {book.pages.length}
          </div>
        </div>
      </div>

      {/* 絵本コンテンツ */}
      <div className="flex-1 relative overflow-hidden">
        {/* ナビゲーション矢印 */}
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-200 ${
            currentPage === 0 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-white/30 hover:scale-110'
          }`}
          aria-label="前のページ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNextPage}
          disabled={currentPage === book.pages.length - 1}
          className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all duration-200 ${
            currentPage === book.pages.length - 1 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-white/30 hover:scale-110'
          }`}
          aria-label="次のページ"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 横スクロールコンテナ */}
        <div
          ref={scrollContainerRef}
          className="h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          onScroll={handleScroll}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {book.pages.map((page, index) => (
            <div
              key={page.id}
              className="flex-shrink-0 w-full h-full snap-start flex"
            >
              {/* 画像部分（左側） */}
              <div className="w-1/2 relative bg-gray-100/10">
                {(() => {
                  const normalizedUrl = normalizeImageUrl(page.imageUrl);
                  const isValid = isValidImageUrl(page.imageUrl);
                  
                  if (isValid && normalizedUrl) {
                    return (
                      <Image
                        src={normalizedUrl}
                        alt={page.alt || ''}
                        fill
                        className="object-contain"
                        sizes="50vw"
                        priority={index === currentPage}
                        onError={(e) => {
                          // 画像読み込みエラー時のフォールバック
                          console.warn('画像読み込みエラー:', normalizedUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    );
                  } else {
                    return (
                      <div className="h-full flex items-center justify-center text-white/50">
                        <div className="text-center">
                          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>画像なし</div>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* テキスト部分（右側） */}
              <div className="w-1/2 flex items-center bg-black/30 backdrop-blur-sm p-8 pr-20">
                <div className="w-full">
                  <p className="text-white text-xl leading-relaxed whitespace-pre-wrap">
                    {page.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ページインジケーター */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
          {book.pages.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToPage(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentPage 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`ページ ${index + 1} に移動`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
