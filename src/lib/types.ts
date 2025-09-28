import { z } from 'zod';

// ページ情報のZodスキーマ
export const PageSchema = z.object({
  id: z.number(),
  pageNo: z.number(),
  imageUrl: z.string().nullable(),
  alt: z.string(),
  text: z.string(),
});

// 絵本概要のZodスキーマ
export const BookSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  created_at: z.string(),
});

// 絵本詳細のZodスキーマ
export const BookDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  pages: z.array(PageSchema),
  created_at: z.string(),
});

// 絵本一覧レスポンスのZodスキーマ
export const BooksResponseSchema = z.object({
  books: z.array(BookSummarySchema),
  hasMore: z.boolean(),
  nextCursor: z.string().nullable(),
});

// TypeScript型定義（Zodスキーマから自動生成）
export type Page = z.infer<typeof PageSchema>;
export type BookSummary = z.infer<typeof BookSummarySchema>;
export type BookDetail = z.infer<typeof BookDetailSchema>;
export type BooksResponse = z.infer<typeof BooksResponseSchema>;

// API エラーレスポンスの型
export interface ApiError {
  error: string;
}
