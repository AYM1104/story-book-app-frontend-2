import { NextRequest, NextResponse } from 'next/server';
import { BookSummary, BooksResponse, BooksResponseSchema } from '@/lib/types';

// 絵本一覧の型定義
// 型定義は @/lib/types から import 済み

// TODO: 実際のDBから取得するように修正
// 現在はモックデータを返す
export async function GET(request: NextRequest) {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const cursor = searchParams.get('cursor');

    // バックエンドAPIからデータを取得
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    const queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    if (cursor) queryParams.append('cursor', cursor);
    
    const backendResponse = await fetch(`${backendUrl}/books?${queryParams.toString()}`);
    
    if (!backendResponse.ok) {
      throw new Error(`バックエンドAPI エラー: ${backendResponse.status}`);
    }
    
    const backendData = await backendResponse.json();
    
    // Zodスキーマでバリデーション
    const validatedResponse = BooksResponseSchema.parse(backendData);
    
    return NextResponse.json(validatedResponse);

  } catch (error) {
    console.error('絵本一覧取得エラー:', error);
    return NextResponse.json(
      { error: '絵本一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}
