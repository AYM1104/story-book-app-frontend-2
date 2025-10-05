"use client"
import React, { useState, useEffect } from 'react';
import { UploadImageResponse } from '../../services/imageUploadService';

interface ImageGalleryProps {
  userId?: number;
  refreshTrigger?: number;
}

export default function ImageGallery({ refreshTrigger }: ImageGalleryProps) {
  const [images, setImages] = useState<UploadImageResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<UploadImageResponse | null>(null);

  // 画像一覧を取得する関数（実際のAPIエンドポイントが存在する場合）
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 注意: このエンドポイントは現在存在しないため、モックデータを使用
      // 実際の実装では、バックエンドに画像一覧取得APIを追加する必要があります
      const mockImages: UploadImageResponse[] = [
        {
          id: 1,
          file_name: "sample1.jpg",
          file_path: "users/1/sample1.jpg",
          content_type: "image/jpeg",
          size_bytes: 1024000,
          uploaded_at: new Date().toISOString(),
          public_url: "https://storage.googleapis.com/your-bucket/users/1/sample1.jpg"
        },
        {
          id: 2,
          file_name: "sample2.png",
          file_path: "users/1/sample2.png",
          content_type: "image/png",
          size_bytes: 2048000,
          uploaded_at: new Date().toISOString(),
          public_url: "https://storage.googleapis.com/your-bucket/users/1/sample2.png"
        }
      ];
      
      setImages(mockImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 画像の表示URLを取得する関数（現在は未使用）
  // const getImageUrl = async (image: UploadImageResponse): Promise<string> => {
  //   if (image.public_url) {
  //     return image.public_url;
  //   }
  //   
  //   try {
  //     // 認証済みURLを取得
  //     const signedUrl = await ImageUploadService.getSignedUrl(image.id);
  //     return signedUrl;
  //   } catch (err) {
  //     console.error('画像URL取得エラー:', err);
  //     return '/placeholder-image.png'; // フォールバック画像
  //   }
  // };

  // 画像をクリックした時の処理
  const handleImageClick = (image: UploadImageResponse) => {
    setSelectedImage(image);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setSelectedImage(null);
  };

  // コンポーネントマウント時とrefreshTrigger変更時に画像を取得
  useEffect(() => {
    fetchImages();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="image-gallery">
        <div className="loading">
          <div className="spinner"></div>
          <p>画像を読み込み中...</p>
        </div>
        <style jsx>{`
          .image-gallery {
            padding: 20px;
          }
          .loading {
            text-align: center;
            padding: 40px;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="image-gallery">
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={fetchImages} className="retry-button">
            再試行
          </button>
        </div>
        <style jsx>{`
          .image-gallery {
            padding: 20px;
          }
          .error {
            text-align: center;
            padding: 40px;
            color: #dc3545;
          }
          .retry-button {
            margin-top: 16px;
            padding: 8px 16px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .retry-button:hover {
            background: #0056b3;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <h3>アップロードされた画像</h3>
        <p className="image-count">{images.length} 枚の画像</p>
      </div>

      {images.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🖼️</div>
          <p>まだ画像がアップロードされていません</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="gallery-item"
              onClick={() => handleImageClick(image)}
            >
              <div className="image-container">
                <img 
                  src={image.public_url || '/placeholder-image.png'} 
                  alt={image.file_name}
                  className="gallery-image"
                />
                <div className="image-overlay">
                  <div className="image-info">
                    <p className="file-name">{image.file_name}</p>
                    <p className="file-size">
                      {(image.size_bytes / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 画像詳細モーダル */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <div className="modal-image-container">
              <img 
                src={selectedImage.public_url || '/placeholder-image.png'} 
                alt={selectedImage.file_name}
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <h4>{selectedImage.file_name}</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">ファイルサイズ:</span>
                  <span className="info-value">
                    {(selectedImage.size_bytes / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">形式:</span>
                  <span className="info-value">{selectedImage.content_type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">アップロード日時:</span>
                  <span className="info-value">
                    {new Date(selectedImage.uploaded_at).toLocaleString('ja-JP')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .image-gallery {
          padding: 20px;
        }

        .gallery-header {
          margin-bottom: 24px;
        }

        .gallery-header h3 {
          margin: 0 0 8px 0;
          color: #333;
        }

        .image-count {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #666;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.6;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .gallery-item {
          cursor: pointer;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .gallery-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }

        .image-container {
          position: relative;
          aspect-ratio: 16/9;
          overflow: hidden;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          padding: 16px 12px 12px;
          transform: translateY(100%);
          transition: transform 0.2s ease;
        }

        .gallery-item:hover .image-overlay {
          transform: translateY(0);
        }

        .image-info {
          color: white;
        }

        .file-name {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 4px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          font-size: 12px;
          margin: 0;
          opacity: 0.9;
        }

        /* モーダルスタイル */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: hidden;
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          font-size: 24px;
          cursor: pointer;
          z-index: 1001;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          background: rgba(0,0,0,0.7);
        }

        .modal-image-container {
          max-height: 70vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .modal-info {
          padding: 20px;
          border-top: 1px solid #eee;
        }

        .modal-info h4 {
          margin: 0 0 16px 0;
          color: #333;
        }

        .info-grid {
          display: grid;
          gap: 8px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-label {
          font-weight: 600;
          color: #666;
        }

        .info-value {
          color: #333;
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
          }
          
          .modal-content {
            max-width: 95vw;
            max-height: 95vh;
          }
        }
      `}</style>
    </div>
  );
}
