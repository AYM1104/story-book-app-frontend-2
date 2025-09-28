"use client"
import styles from "./HeadingText.module.css";

interface HeadingTextProps {
  children: React.ReactNode;
  className?: string;
  glowAnimation?: boolean;
  mobileBreak?: boolean;
}

/**
 * 見出し用テキストコンポーネント
 * - 発光アニメーション対応
 * - レスポンシブなテキストサイズ
 * - モバイル時の改行制御
 */
export default function HeadingText({ 
  children, 
  className = "", 
  glowAnimation = true,
  mobileBreak = true 
}: HeadingTextProps) {
  return (
    <p 
      className={`
        ${styles.headingText} 
        ${glowAnimation ? styles.glowAnimation : ""} 
        !text-[20px] sm:!text-[24px] md:!text-[28px] lg:!text-[36px] 
        ${className}
      `}
    >
      {mobileBreak ? (
        <>
          {typeof children === 'string' && children.includes('きょうは') ? (
            <>
              {children.split('きょうは')[0]}
              きょうは
              <br className={styles.mobileBreak} />
              {children.split('きょうは')[1]}
            </>
          ) : (
            <>
              {children}
              <br className={styles.mobileBreak} />
            </>
          )}
        </>
      ) : (
        children
      )}
    </p>
  );
}
