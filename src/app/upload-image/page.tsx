"use client"
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character/Character"
import Button from '@/components/Button/Button';
import Card from "@/components/Card/Card";
import HeadingText from "@/components/HeadingText/HeadingText";
import { useRef, useState } from 'react';
import useImageUpload from '@/hooks/useImageUpload';

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // 画像アップロードフック
  const {
    isUploading,
    publicImageUrl,
    handleFileChange,
    handleConfirmImage,
  } = useImageUpload()

  // ファイル選択時の処理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ファイル形式のチェック
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルのみアップロード可能です')
        return
      }

      // ファイルサイズのチェック（10MB制限）
      if (file.size > 10 * 1024 * 1024) {
        alert('ファイルサイズは10MB以下にしてください')
        return
      }

      setSelectedFile(file)
      
      // プレビュー用のURLを生成
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // 既存のアップロード処理も実行
      handleFileChange(e)
    }
  }

  // 画像選択ダイアログを開く
  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  // ファイル選択をリセット
  const handleReset = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <BackgroundStars>
      <div className="min-h-screen flex flex-col safe-area-inset-all">
        <Header />

      {/* 見出し */}
      <div className="flex justify-center text-center mt-2 md:mt-8 lg:mt-1">
        <div className="relative z-10">
          <HeadingText>
            どんな え でえほんを
            <br className="md:hidden" />
            つくろうかな？
          </HeadingText>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <div className="relative z-10">
          <Button onClick={handleClickUpload}>        
            {isUploading ? 'アップロード中...' : '画像をアップロード'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* カード */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] left-0 right-0 flex justify-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 z-50">
        <Card>
        {previewUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {/* プレビュー画像 */}
              <div className="w-full max-w-sm">
                <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={previewUrl}
                    alt="プレビュー"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                  {/* 削除ボタン */}
                  <button
                    onClick={handleReset}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {/* ファイル情報 */}
              {selectedFile && (
                <div className="text-center text-sm text-gray-600">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              )}
              
              {/* 決定ボタン */}
              <Button 
                className="relative mt-4 z-10" 
                onClick={handleConfirmImage}
                disabled={isUploading}
              >
                {isUploading ? 'アップロード中...' : 'この画像にけってい'}
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              画像を選択してください
            </div>
          )}
        </Card>
      </div>  

      {/* キャラクター */}
      <Character bottomAligned={true} useContainerStyle={true} />
      </div>
    </BackgroundStars>
  )
}
    
    