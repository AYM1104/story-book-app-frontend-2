"use client"
import React, { useState, useRef } from 'react';
import { ImageUploadService, UploadImageResponse } from '../../services/imageUploadService';

interface ImageUploadProps {
  onUploadSuccess?: (result: UploadImageResponse) => void;
  onUploadError?: (error: string) => void;
  userId?: number;
}

export default function ImageUpload({ 
  onUploadSuccess, 
  onUploadError, 
  userId = 1 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ファイル選択時の処理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ファイル形式のチェック
      if (!file.type.startsWith('image/')) {
        onUploadError?.('画像ファイルのみアップロード可能です');
        return;
      }

      // ファイルサイズのチェック（10MB制限）
      if (file.size > 10 * 1024 * 1024) {
        onUploadError?.('ファイルサイズは10MB以下にしてください');
        return;
      }

      setSelectedFile(file);
      
      // プレビュー用のURLを生成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // ドラッグ&ドロップの処理
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // ファイル選択処理を直接実行
      if (!file.type.startsWith('image/')) {
        onUploadError?.('画像ファイルのみアップロード可能です');
        return;
      }

      // ファイルサイズのチェック（10MB制限）
      if (file.size > 10 * 1024 * 1024) {
        onUploadError?.('ファイルサイズは10MB以下にしてください');
        return;
      }

      setSelectedFile(file);
      
      // プレビュー用のURLを生成
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // アップロード処理
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // プログレスバーのシミュレーション
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await ImageUploadService.uploadImage(selectedFile, userId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      onUploadSuccess?.(result);
      
      // 成功後のリセット
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);

    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : 'アップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  // ファイル選択のリセット
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <div 
        className={`upload-area ${selectedFile ? 'has-file' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {previewUrl ? (
          <div className="preview-container">
            <div className="preview-image-wrapper">
              <img src={previewUrl} alt="プレビュー" className="preview-image" />
              <div className="preview-overlay">
                <div className="preview-actions">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="remove-button"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            <div className="file-info">
              <p className="file-name">{selectedFile?.name}</p>
              <p className="file-size">
                {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : '0'} MB
              </p>
              <p className="file-type">{selectedFile?.type}</p>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              画像をドラッグ&ドロップするか<br />
              クリックしてファイルを選択
            </p>
            <p className="upload-hint">
              対応形式: JPG, PNG, GIF, WebP<br />
              最大サイズ: 10MB
            </p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="upload-controls">
          {isUploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="progress-text">アップロード中... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="action-buttons">
              <button 
                onClick={handleUpload}
                className="upload-button"
                disabled={isUploading}
              >
                アップロード
              </button>
              <button 
                onClick={handleReset}
                className="reset-button"
                disabled={isUploading}
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .image-upload-container {
          max-width: 500px;
          margin: 0 auto;
        }

        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fafafa;
        }

        .upload-area:hover {
          border-color: #007bff;
          background: #f0f8ff;
        }

        .upload-area.has-file {
          border-color: #28a745;
          background: #f8fff8;
        }

        .preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .preview-image-wrapper {
          position: relative;
          display: inline-block;
        }

        .preview-image {
          max-width: 300px;
          max-height: 300px;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          transition: transform 0.2s ease;
        }

        .preview-image:hover {
          transform: scale(1.02);
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          border-radius: 12px;
          opacity: 0;
          transition: opacity 0.2s ease;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 8px;
        }

        .preview-image-wrapper:hover .preview-overlay {
          opacity: 1;
        }

        .preview-actions {
          display: flex;
          gap: 8px;
        }

        .remove-button {
          background: rgba(220, 53, 69, 0.9);
          color: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .remove-button:hover {
          background: rgba(220, 53, 69, 1);
        }

        .file-info {
          text-align: center;
        }

        .file-name {
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
          word-break: break-all;
        }

        .file-size {
          color: #666;
          font-size: 14px;
          margin: 0 0 2px 0;
        }

        .file-type {
          color: #888;
          font-size: 12px;
          margin: 0;
          text-transform: uppercase;
        }

        .upload-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .upload-icon {
          font-size: 48px;
          opacity: 0.6;
        }

        .upload-text {
          font-size: 16px;
          color: #333;
          margin: 0;
          line-height: 1.5;
        }

        .upload-hint {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }

        .upload-controls {
          margin-top: 20px;
        }

        .upload-progress {
          text-align: center;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #0056b3);
          transition: width 0.3s ease;
        }

        .progress-text {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .upload-button, .reset-button {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .upload-button {
          background: #007bff;
          color: white;
        }

        .upload-button:hover:not(:disabled) {
          background: #0056b3;
        }

        .upload-button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .reset-button {
          background: #6c757d;
          color: white;
        }

        .reset-button:hover:not(:disabled) {
          background: #545b62;
        }

        .reset-button:disabled {
          background: #adb5bd;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
