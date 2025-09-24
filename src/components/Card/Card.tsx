"use client";
import { useState, useEffect, ReactNode } from "react";
import { Box } from "@mui/material";

interface CardProps {
  children: ReactNode;
  maxWidth?: string | number;
  height?: string | number;
  /** カード全体を縦方向にずらす量（例: 16 or "24px"） */
  offsetY?: number | string;
  className?: string;
  style?: React.CSSProperties;
  /** ラベルの文字色 */
  labelColor?: string;
}

export default function Card({ 
  children, 
  maxWidth = "420px", 
  height = "500px",
  offsetY,
  className,
  style,
  labelColor = "white"
}: CardProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // ページロード時にアニメーション開始（アニメーションなしで即座に表示）
    setIsVisible(true);
  }, []);

  const translateY = offsetY !== undefined ? (typeof offsetY === "number" ? `${offsetY}px` : offsetY) : undefined;

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 1rem",
      zIndex: 10,
      pointerEvents: "none",
      transform: translateY ? `translateY(${translateY})` : undefined
    }}>
      <div 
        className={className}
        style={{
          width: "100%",
          maxWidth,
          height,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          pointerEvents: "auto",
          
          // 美しい透明ガラス効果（backdrop-filterなし）
          background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "1rem",
          
          // 強い輝き効果（アニメーションなし）
          boxShadow: `0 8px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.3), 0 0 60px rgba(102, 126, 234, 0.4), 0 0 90px rgba(255, 255, 255, 0.2)`,
          ...style
        }}
      >
        {/* ガラス風の内側ハイライト（線なし） */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)",
          borderRadius: "1rem",
          pointerEvents: "none"
        }} />
        
        {/* ガラス風のコンテンツエリア */}
        <Box sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "1.5rem",
          color: labelColor,
          fontSize: "1.125rem",
          fontWeight: 500,
          // テキストに強い輝き効果を追加（黒系の場合は輝きを調整）
          textShadow: labelColor === "white" 
            ? "0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)"
            : "0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)"
        }}>
          {children}
        </Box>
      </div>
    </div>
  );
}
