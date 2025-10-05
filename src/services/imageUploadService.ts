// 画像アップロード用のAPIサービス
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// 画像アップロードレスポンスの型定義
export interface UploadImageResponse {
  id: number;
  file_name: string;
  file_path: string;
  content_type: string;
  size_bytes: number;
  uploaded_at: string;
  meta_data?: string;
  public_url?: string;
}

// 画像アップロード用のAPIサービス
export class ImageUploadService {
  /**
   * 画像ファイルをアップロードする
   * @param file アップロードする画像ファイル
   * @param userId ユーザーID
   * @returns アップロード結果
   */
  static async uploadImage(file: File, userId: number): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/images/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'アップロードに失敗しました');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('画像アップロードエラー:', error);
      throw error;
    }
  }

  /**
   * アップロードされた画像の認証済みURLを取得する
   * @param imageId 画像ID
   * @returns 認証済みURL
   */
  static async getSignedUrl(imageId: number): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/images/signed-url/${imageId}`);
      
      if (!response.ok) {
        throw new Error('認証済みURLの取得に失敗しました');
      }

      const result = await response.json();
      return result.signed_url;
    } catch (error) {
      console.error('認証済みURL取得エラー:', error);
      throw error;
    }
  }
}
