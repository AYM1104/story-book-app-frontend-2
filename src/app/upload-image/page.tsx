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
    uploadedImageId,
    handleFileChange,
    handleConfirmImage: confirmImage,
  } = useImageUpload()

  // ファイル選択時の処理（プレビューのみ）
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

  // 画像決定時の処理（アップロード実行）
  const handleConfirmImage = async () => {
    if (!selectedFile) {
      alert('画像が選択されていません')
      return
    }
    
    try {
      // ファイル選択イベントをシミュレートしてアップロード実行
      const fakeEvent = {
        target: {
          files: [selectedFile]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      
      await handleFileChange(fakeEvent)
      
      // アップロード完了を待機（より確実な方法）
      let retryCount = 0
      const maxRetries = 30 // タイムアウトをさらに延長
      
      const waitForUpload = () => {
        return new Promise<void>((resolve, reject) => {
          const checkUpload = () => {
            // localStorageからも確認
            const storedImageId = localStorage.getItem('uploaded_image_id')
            const currentImageId = uploadedImageId || (storedImageId ? parseInt(storedImageId) : null)
            
            if (currentImageId) {
              console.log('アップロード完了確認:', currentImageId)
              resolve()
            } else if (retryCount >= maxRetries) {
              reject(new Error('アップロードがタイムアウトしました。しばらく待ってから再度お試しください。'))
            } else {
              retryCount++
              console.log(`アップロード待機中... (${retryCount}/${maxRetries})`)
              setTimeout(checkUpload, 200) // 間隔を短縮
            }
          }
          checkUpload()
        })
      }
      
      await waitForUpload()
      
      // 物語設定を作成してページ遷移
      await confirmImage()
      
    } catch (error) {
      console.error('アップロードエラー:', error)
      const errorMessage = error instanceof Error ? error.message : '画像のアップロードに失敗しました'
      alert(`エラー: ${errorMessage}`)
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

      {/* カード */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] left-0 right-0 flex justify-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 z-50">
        <Card>
        {previewUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {/* プレビュー画像 */}
              <div className="w-full max-w-sm md:max-w-md">
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
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
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                画像を選択してください
              </div>
              {/* アップロードボタンをカード内に移動 */}
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
          )}
        </Card>
      </div>  

      {/* キャラクター */}
      <Character bottomAligned={true} useContainerStyle={true} />
      </div>
    </BackgroundStars>
  )
}
    
    