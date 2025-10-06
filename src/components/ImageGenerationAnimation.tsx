"use client"
import React from 'react'

interface ImageGenerationAnimationProps {
  /** 現在の進行状況 (0-100) */
  progress: number
  /** 総画像数 */
  totalImages: number
  /** 現在の画像番号 */
  currentImage: number
  /** 表示するメッセージ */
  message?: string
  /** アニメーションを無効にするか */
  disabled?: boolean
}

export default function ImageGenerationAnimation({
  progress,
  totalImages,
  currentImage,
  message = "素敵な絵を描いています...",
  disabled = false
}: ImageGenerationAnimationProps) {
  
  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      {/* メインキャラクターアニメーション */}
      <div className="relative">
        {/* 背景の光る効果 */}
        <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-pulse scale-150 blur-xl" />
        
        {/* キャラクター本体 */}
        <div className="relative z-10">
          {/* キャラクターの体（洋ナシ型） */}
          <div className="relative w-32 h-40 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full shadow-lg">
            {/* 頭の突起（茎） */}
            <div className="absolute -top-2 right-4 w-2 h-4 bg-gradient-to-b from-green-500 to-green-600 rounded-full transform rotate-12" />
            
            {/* 目 */}
            <div className="absolute top-8 left-6 w-8 h-8 bg-white rounded-full shadow-inner">
              <div className="absolute top-2 left-2 w-4 h-4 bg-black rounded-full animate-bounce" 
                   style={{ animationDuration: '2s' }} />
            </div>
            <div className="absolute top-8 right-6 w-8 h-8 bg-white rounded-full shadow-inner">
              <div className="absolute top-2 left-2 w-4 h-4 bg-black rounded-full animate-bounce" 
                   style={{ animationDuration: '2.2s' }} />
            </div>
            
            {/* 足 */}
            <div className="absolute -bottom-2 left-6 w-6 h-8 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full shadow-md" />
            <div className="absolute -bottom-2 right-6 w-6 h-8 bg-gradient-to-b from-yellow-300 to-orange-400 rounded-full shadow-md" />
            
            {/* 描画中のエフェクト */}
            <div className="absolute -top-4 -right-4 w-8 h-8">
              {/* 魔法の筆 */}
              <div className="absolute top-2 left-2 w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full animate-spin" 
                   style={{ animationDuration: '3s' }} />
              {/* 星のエフェクト */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-300 rounded-full animate-ping" 
                   style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-ping" 
                   style={{ animationDelay: '1s' }} />
              <div className="absolute top-1 left-4 w-1 h-1 bg-blue-300 rounded-full animate-ping" 
                   style={{ animationDelay: '1.5s' }} />
            </div>
            
            {/* 周りの装飾的な星 */}
            <div className="absolute -top-6 left-2 w-2 h-2 bg-yellow-200 rounded-full animate-pulse" />
            <div className="absolute -top-4 right-8 w-1.5 h-1.5 bg-pink-200 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.7s' }} />
            <div className="absolute top-2 -left-4 w-1 h-1 bg-blue-200 rounded-full animate-pulse" 
                 style={{ animationDelay: '1.3s' }} />
          </div>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white font-medium text-lg drop-shadow-lg">
            {message}
          </span>
          <span className="text-white/80 font-medium drop-shadow">
            {currentImage}/{totalImages}
          </span>
        </div>

        {/* プログレスバーコンテナ */}
        <div className="h-4 w-full rounded-full overflow-hidden bg-white/10 border border-white/20 shadow-inner">
          {/* プログレスバー */}
          <div 
            className="h-full rounded-full relative overflow-hidden bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 shadow-lg transition-all duration-700 ease-out"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          >
            {/* 流れる光のエフェクト */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            
            {/* 発光効果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/50 to-white/20 opacity-60 animate-pulse" />
          </div>
        </div>

        {/* パーセンテージ表示 */}
        <div className="flex justify-center mt-3">
          <span className="text-white/90 font-medium text-lg drop-shadow">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* ステータスメッセージ */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
              style={{ 
                animationDelay: `${i * 0.3}s`,
                animationDuration: '1.8s'
              }}
            />
          ))}
        </div>
        <p className="text-white/80 text-sm mt-2 drop-shadow">
          もう少し待ってね...
        </p>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
      `}</style>
    </div>
  )
}
