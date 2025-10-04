"use client";
import { ReactNode } from "react";

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
  /** カードの高さ */
  height?: string | number;
  /** カードの最大幅 */
  maxWidth?: string | number;
}

export default function Card({ 
  children, 
  offsetY,
  className,
  style,
  labelColor = "white",
  width = "medium",
  height,
  maxWidth
}: CardProps) {

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
        w-full
        ${getWidthClasses()}    // 動的なレスポンシブ最大幅
        h-[19rem] xs:h-[28rem] sm:h-[30rem] md:h-[34rem] lg:h-[38rem]   // レスポンシブ高さ
        text-center relative overflow-hidden
        
        // ガラス風の透明効果
        bg-gradient-to-br from-white/15 via-white/5 to-white/10
        border border-white/30 rounded-2xl
        
        // 強い輝き効果
        shadow-[0_8px_40px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.3),0_0_60px_rgba(102,126,234,0.4),0_0_90px_rgba(255,255,255,0.2)]
        
        ${className || ''}
      `}
      style={{
        ...style,
        ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
        ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth })
      }}
    >
      {/* ガラス風の内側ハイライト */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-white/2 to-white/5 rounded-2xl pointer-events-none" />
      
      {/* ガラス風のコンテンツエリア */}
      <div className={`
        relative z-10 h-full flex flex-col items-center justify-start
        pt-8 xs:pt-10 sm:pt-4 md:pt-14 lg:pt-16    // 上部に少し余白を追加
        px-4 xs:px-5 sm:px-4 md:px-7 lg:px-8    // 左右のパディング
        pb-4 xs:pb-5 sm:pb-6 md:pb-7 lg:pb-8    // 下部のパディング
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
  );
}
