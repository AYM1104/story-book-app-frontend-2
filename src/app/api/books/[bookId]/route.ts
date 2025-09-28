import { NextRequest, NextResponse } from 'next/server';
import { BookDetail, BookDetailSchema } from '@/lib/types';

// TODO: 実際のDBから取得するように修正
// 現在はモックデータを返す
export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const bookId = parseInt(params.bookId);

    if (isNaN(bookId)) {
      return NextResponse.json(
        { error: '無効な絵本IDです' },
        { status: 400 }
      );
    }

    // バックエンドAPIからデータを取得
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    
    const backendResponse = await fetch(`${backendUrl}/books/${bookId}`);
    
    if (!backendResponse.ok) {
      if (backendResponse.status === 404) {
        return NextResponse.json(
          { error: '絵本が見つかりません' },
          { status: 404 }
        );
      }
      throw new Error(`バックエンドAPI エラー: ${backendResponse.status}`);
    }
    
    const backendData = await backendResponse.json();
    
    // Zodスキーマでバリデーション
    const validatedBook = BookDetailSchema.parse(backendData);
    
    return NextResponse.json(validatedBook);

  } catch (error) {
    console.error('絵本詳細取得エラー:', error);
    return NextResponse.json(
      { error: '絵本の詳細取得に失敗しました' },
      { status: 500 }
    );
  }
}
