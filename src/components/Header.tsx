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
      className={className}
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 50,
        // 透過グラデーション背景（backdrop なし）
        background: "linear-gradient(180deg, rgba(2,6,23,0.65) 0%, rgba(2,6,23,0.45) 100%)",
        borderBottom: "none",
        boxShadow: "0 6px 28px rgba(0,0,0,0.55)",
        overflow: "visible",
        backdropFilter: undefined,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          color: "white",
        }}
      >
        {/* 左：ロゴ + タイトル */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center" }}>
            <Image src={logoSrc} alt={logoAlt} width={32} height={32} priority />
          </Link>
          {title ? (
            <span
              style={{
                fontWeight: 700,
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

        {/* 右：ナビ（狭幅では非表示にする想定。必要なら後で隠すCSSを追加） */}
        <nav aria-label="メインナビゲーション">
          <ul style={{ display: "flex", alignItems: "center", gap: 16, listStyle: "none", margin: 0, padding: 0 }}>
            {navItems.map((item, idx) => {
              const key = `${item.label}-${idx}`;
              if (item.href) {
                return (
                  <li key={key}>
                    <Link
                      href={item.href}
                      style={{
                        color: "rgba(255,255,255,0.9)",
                        textDecoration: "none",
                        fontWeight: 600,
                        padding: "8px 10px",
                        borderRadius: 8,
                        transition: "background 0.2s ease, transform 0.2s ease",
                      }}
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
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontWeight: 600,
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.18)",
                      cursor: "pointer",
                      transition: "background 0.2s ease, transform 0.2s ease",
                    }}
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
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: -14,
          height: 28,
          // 下に向かうフェード
          background: "linear-gradient(180deg, rgba(80,102,204,0.45) 0%, rgba(80,102,204,0.25) 40%, rgba(80,102,204,0) 100%)",
          filter: "blur(14px)",
          opacity: 0.9,
          pointerEvents: "none",
          transform: "translateZ(0)",
        }}
      />
    </header>
  );
}


