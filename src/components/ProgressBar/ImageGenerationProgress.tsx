"use client"
import React from 'react'
import ProgressBar from './ProgressBar'

interface ImageGenerationProgressProps {
  /** 現在の画像生成状況 */
  currentImage: number
  /** 総画像数 */
  totalImages: number
  /** 現在生成中の画像の詳細 */
  currentImageDetails?: {
    pageNumber?: number
    prompt?: string
    status: 'generating' | 'completed' | 'failed'
  }
  /** カスタムクラス名 */
  className?: string
  /** 表示を非表示にするか */
  hidden?: boolean
}

export default function ImageGenerationProgress({
  currentImage,
  totalImages,
  currentImageDetails,
  className = '',
  hidden = false
}: ImageGenerationProgressProps) {
  
  if (hidden) return null

  const progress = totalImages > 0 ? (currentImage / totalImages) * 100 : 0
  
  // ステータスに応じたラベル生成
  const getLabel = () => {
    if (currentImageDetails?.status === 'failed') {
      return `画像生成エラー (${currentImageDetails.pageNumber || currentImage}ページ目)`
    }
    
    if (currentImageDetails?.status === 'completed') {
      return `画像生成完了 (${currentImageDetails.pageNumber || currentImage}ページ目)`
    }
    
    if (currentImageDetails?.pageNumber) {
      return `${currentImageDetails.pageNumber}ページ目の画像を生成中...`
    }
    
    return '画像を生成中...'
  }

  // ステータスに応じたカスタムスタイル
  const getStatusStyle = () => {
    if (currentImageDetails?.status === 'failed') {
      return 'text-red-300'
    }
    
    if (currentImageDetails?.status === 'completed') {
      return 'text-green-300'
    }
    
    return ''
  }

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* メインプログレスバー */}
      <ProgressBar
        progress={progress}
        total={totalImages}
        current={currentImage}
        label={getLabel()}
        size="medium"
        className="mb-4"
      />
      
      {/* 詳細情報 */}
      {currentImageDetails && (
        <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
          {/* 現在の画像詳細 */}
          <div className="text-center">
            <div className={`text-sm font-medium ${getStatusStyle()}`}>
              {currentImageDetails.status === 'generating' && '🎨 生成中...'}
              {currentImageDetails.status === 'completed' && '✅ 完了'}
              {currentImageDetails.status === 'failed' && '❌ エラー'}
            </div>
            
            {currentImageDetails.pageNumber && (
              <div className="text-xs text-white/70 mt-1">
                ページ {currentImageDetails.pageNumber}
              </div>
            )}
          </div>
          
          {/* プロンプトの一部表示（長すぎる場合は省略） */}
          {currentImageDetails.prompt && (
            <div className="mt-2 text-xs text-white/60 text-center line-clamp-2">
              {currentImageDetails.prompt.length > 50 
                ? `${currentImageDetails.prompt.substring(0, 50)}...`
                : currentImageDetails.prompt
              }
            </div>
          )}
        </div>
      )}
      
      {/* 全体の進捗サマリー */}
      <div className="mt-3 text-center">
        <div className="text-xs text-white/50">
          えほんの完成まであと {totalImages - currentImage} 枚
        </div>
      </div>
    </div>
  )
}
