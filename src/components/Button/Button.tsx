
interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  width?: number; // ボタンの幅を指定するプロパティ
}

export default function Button({ children, disabled, className, onClick, width }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ width: width ? `${width}px` : undefined }}
      className={`
        pt-1 pb-2 px-4 xs:px-7 sm:px-10 md:px-12 lg:px-15    // レスポンシブパディング
        mt-5 xs:mt-7 sm:mt-9 md:mt-12 lg:mt-13 xl:mt-2     // レスポンシブ_マージン
        text-lg md:text-xl lg:text-2xl xl:text-xl         // フォントサイズ
        font-semibold                     // フォントウェイト
        rounded-full                     // 完全に丸い
        bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white  // 目立つエメラルド・ティールグラデーション
        shadow-lg hover:shadow-2xl       // より強いシャドウ効果
        shadow-emerald-400/50            // エメラルドの光るシャドウ
        transform hover:scale-105        // 控えめな拡大効果
        transition-all duration-200      // スムーズなアニメーション
        hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400  // ホバー時に明るく変化
        hover:shadow-emerald-400/60      // ホバー時の強い光るシャドウ
        border border-emerald-300/50      // 光るボーダー
        hover:border-emerald-200/70       // ホバー時の明るいボーダー
        relative overflow-hidden          // 光るアニメーション用
        animate-pulse hover:animate-none  // その場で大きくなったり小さくなったり（ホバー時は停止）
        active:scale-95                  // クリック時の縮小効果
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:animate-none  // 無効状態のスタイル
        ${className || ''}               // 外部から渡された追加クラス
      `}
    >
      {/* 光るエフェクト */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      <span className="relative z-10">{children}</span>
    </button>
  );
}