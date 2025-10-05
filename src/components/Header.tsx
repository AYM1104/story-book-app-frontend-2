"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

// ヘッダー用の型定義
type HeaderNavItem = {
  label: string; // 表示ラベル
  href?: string; // 遷移先（任意）
  onClick?: () => void; // クリックハンドラ（任意）
};

type HeaderProps = {
  title?: string; // タイトル（ロゴ横のテキスト）
  logoSrc?: string; // ロゴ画像パス
  navItems?: HeaderNavItem[]; // 右側ナビ
  className?: string; // 追加クラス
};

/**
 * 画面上部に固定されるヘッダーコンポーネント。
 * - 透過ガラス風の背景（backdrop-filter 非依存）
 * - レスポンシブで、狭い幅ではナビを非表示（必要なら後でドロワー連携可）
 */
export default function Header({
  title = "えほんのたね",
  logoSrc = "/logo/logo.svg",
  navItems = [],
  className,
}: HeaderProps) {
  // a11y: タイトルが空でもロゴに代替テキストを付与
  const logoAlt = useMemo(() => (title ? `${title} ロゴ` : "ロゴ"), [title]);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 overflow-visible text-white ${className}`}
      style={{
        // レスポンシブな高さ設定
        height: "clamp(48px, 8vw, 64px)",
        // 透過グラデーション背景（backdrop なし）
        background: "linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.45) 100%)",
        borderBottom: "none",
        boxShadow: "0 6px 28px rgba(0,0,0,0.55)",
        backdropFilter: undefined,
      }}
    >
      <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8">
        {/* 左：ロゴ + タイトル */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/home" className="inline-flex items-center">
            <Image 
              src={logoSrc} 
              alt={logoAlt} 
              width={24} 
              height={24} 
              className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] md:w-[40px] md:h-[40px] lg:w-[48px] lg:h-[48px]" 
              priority 
            />
          </Link>
          {title ? (
            <span
              className="font-bold text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px]"
              style={{
                letterSpacing: 0.2,
                background: "linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontFamily: "var(--font-yusei-magic), 'Yusei Magic', sans-serif",
              }}
            >
              {title}
            </span>
          ) : null}
        </div>

        {/* 右：ナビ（レスポンシブ対応） */}
        <nav aria-label="メインナビゲーション" className="hidden sm:block">
          <ul className="flex items-center gap-2 md:gap-4 list-none m-0 p-0">
            {navItems.map((item, idx) => {
              const key = `${item.label}-${idx}`;
              if (item.href) {
                return (
                  <li key={key}>
                    <Link
                      href={item.href}
                      className="text-white/90 no-underline font-semibold px-2 py-1 md:px-3 md:py-2 rounded-lg text-sm md:text-base transition-all duration-200 hover:bg-white/10 hover:scale-105"
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="text-white/90 font-semibold px-2 py-1 md:px-3 md:py-2 rounded-lg bg-transparent border border-white/18 cursor-pointer text-sm md:text-base transition-all duration-200 hover:bg-white/10 hover:scale-105"
                  >
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      {/* 下方向のぼかしグロー（装飾） */}
      <div
        aria-hidden
        className="absolute left-0 right-0 bottom-[-14px] h-7 opacity-90 pointer-events-none"
        style={{
          // 下に向かうフェード
          background: "linear-gradient(180deg, rgba(80,102,204,0.45) 0%, rgba(80,102,204,0.25) 40%, rgba(80,102,204,0) 100%)",
          filter: "blur(14px)",
          transform: "translateZ(0)",
        }}
      />
    </header>
  );
}


