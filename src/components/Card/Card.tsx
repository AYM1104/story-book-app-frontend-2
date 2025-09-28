"use client";
import { useState, useEffect, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** カード全体を縦方向にずらす量（例: 16 or "24px"） */
  offsetY?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /** ラベルの文字色 */
  labelColor?: string;
  /** カードの横幅サイズ ('small' | 'medium' | 'large' | 'full') */
  width?: 'small' | 'medium' | 'large' | 'full';
}

export default function Card({ 
  children, 
  offsetY,
  className,
  style,
  labelColor = "white",
  width = "medium"
}: CardProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // ページロード時にアニメーション開始（アニメーションなしで即座に表示）
    setIsVisible(true);
  }, []);

  const translateY = offsetY !== undefined ? (typeof offsetY === "number" ? `${offsetY}px` : offsetY) : undefined;

  // 横幅サイズに応じたクラスを取得
  const getWidthClasses = () => {
    switch (width) {
      case 'small':
        return 'max-w-xs xs:max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl';
      case 'medium':
        return 'max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl';
      case 'large':
        return 'max-w-md xs:max-w-lg sm:max-w-xl md:max-w-3xl lg:max-w-4xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl';
    }
  };

  return (
    <div 
      className={`
        absolute bottom-0 left-0 right-0
        flex justify-center items-end
        px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10    // レスポンシブパディング
        pb-60 xs:pb-60 sm:pb-60 md:pb-70 lg:pb-65   // 画面下部からの距離
        z-10 pointer-events-none
        ${translateY ? `transform translate-y-[${translateY}]` : ''}
      `}
      style={translateY ? { transform: `translateY(${translateY})` } : undefined}
    >
      <div 
        className={`
          w-full
          ${getWidthClasses()}    // 動的なレスポンシブ最大幅
          h-96 xs:h-[20rem] sm:h-[24rem] md:h-[28rem] lg:h-[36rem]   // レスポンシブ高さ
          text-center relative overflow-hidden pointer-events-auto
          
          // ガラス風の透明効果
          bg-gradient-to-br from-white/15 via-white/5 to-white/10
          border border-white/30 rounded-2xl
          
          // 強い輝き効果
          shadow-[0_8px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.3),0_0_60px_rgba(102,126,234,0.4),0_0_90px_rgba(255,255,255,0.2)]
          
          ${className || ''}
        `}
        style={style}
      >
        {/* ガラス風の内側ハイライト */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/2 to-white/5 rounded-2xl pointer-events-none" />
        
        {/* ガラス風のコンテンツエリア */}
        <div className={`
          relative z-10 h-full flex flex-col items-center justify-start
          p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8    // レスポンシブパディング
          text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl    // レスポンシブフォントサイズ
          font-medium
          ${labelColor === "white" 
            ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            : "text-black drop-shadow-[0_0_10px_rgba(0,0,0,0.3)] drop-shadow-[0_0_20px_rgba(0,0,0,0.2)]"
          }
        `}>
          {children}
        </div>
      </div>
    </div>
  );
}
