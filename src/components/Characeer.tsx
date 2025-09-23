"use client";

// 端末共通のキャラクター画像を表示（親側でサイズ・配置を制御）
export default function Character() {
  return (
    <img
      src="/charactor/charactor-smartphone.svg"
      alt="character"
      className="w-[500px] sm:w-[400px] max-w-none h-auto select-none pointer-events-none"
    />
  );
}
