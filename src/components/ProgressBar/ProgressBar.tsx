"use client"
import React from 'react'

interface ProgressBarProps {
  /** 現在の進行状況 (0-100) */
  progress: number
  /** 総数 */
  total: number
  /** 現在の数 */
  current: number
  /** 表示するラベル */
  label?: string
  /** カスタムクラス名 */
  className?: string
  /** サイズ */
  size?: 'small' | 'medium' | 'large'
  /** アニメーションを無効にするか */
  disableAnimation?: boolean
}

export default function ProgressBar({
  progress,
  total,
  current,
  label = '進行中...',
  className = '',
  size = 'medium',
  disableAnimation = false
}: ProgressBarProps) {
  
  // サイズに応じたクラス設定
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'h-2',
          bar: 'h-2',
          text: 'text-sm',
          counter: 'text-xs'
        }
      case 'large':
        return {
          container: 'h-4',
          bar: 'h-4',
          text: 'text-lg',
          counter: 'text-base'
        }
      default: // medium
        return {
          container: 'h-3',
          bar: 'h-3',
          text: 'text-base',
          counter: 'text-sm'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <div className={`w-full ${className}`}>
      {/* ラベルとカウンター */}
      <div className="flex justify-between items-center mb-2">
        <span className={`${sizeClasses.text} text-white font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]`}>
          {label}
        </span>
        <span className={`${sizeClasses.counter} text-white/80 font-medium drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]`}>
          {current}/{total}
        </span>
      </div>

      {/* プログレスバーコンテナ */}
      <div className={`
        ${sizeClasses.container}
        w-full rounded-full overflow-hidden
        bg-white/10 border border-white/20
        shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
      `}>
        {/* プログレスバー */}
        <div 
          className={`
            ${sizeClasses.bar}
            rounded-full relative overflow-hidden
            bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400
            shadow-[0_0_20px_rgba(255,193,28,0.6),0_0_40px_rgba(255,140,0,0.4)]
            ${disableAnimation ? '' : 'transition-all duration-500 ease-out'}
          `}
          style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
        >
          {/* アニメーション効果：流れる光 */}
          {!disableAnimation && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
          
          {/* 発光効果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-60 animate-pulse" />
        </div>
      </div>

      {/* ステータス表示 */}
      <div className="flex justify-center mt-3">
        <div className="flex items-center space-x-2">
          {/* 点滅するドット */}
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
          
          {/* パーセンテージ */}
          <span className={`${sizeClasses.counter} text-white/90 font-medium drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]`}>
            {Math.round(progress)}%
          </span>
        </div>
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
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}
