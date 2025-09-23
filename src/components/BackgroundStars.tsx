"use client";

import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import StarField from "./Star/StarField";
import StarAnimations from "./Star/StarAnimations";
import type { Star } from "./Star/starType";

// 簡易ランダム生成（必要最低限）
function genStars(count: number, w: number, h: number): Star[] {
  const imgs = [
    "/star/star-yellow.svg",
    "/star/star-blue.svg",
    "/star/star-green.svg",
    "/star/star-purple.svg",
    "/star/star-red.svg",
    "/star/star-white.svg",
  ];
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;

  return Array.from({ length: count }, () => ({
    src: imgs[Math.floor(Math.random() * imgs.length)],
    left: rand(0, w),
    top: rand(0, h),
    size: rand(5, 12),
    opacity: rand(0.5, 1),
    rotate: rand(0, 360),
    twinkleDur: rand(1.5, 3.5),
    twinkleDelay: rand(0, 2),
    floatDur: rand(3, 6),
  }));
}

type BackgroundStarsProps = PropsWithChildren<{
  className?: string;
}>;

export default function BackgroundStars({ className, children }: BackgroundStarsProps) {
  // SSR とクライアントの乱数差でハイドレーション不一致が出ないよう
  // マウント完了までは星を描画しない
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const measure = () => {
      const width = Math.max(window.innerWidth, document.documentElement.clientWidth || 0);
      const height = Math.max(window.innerHeight, document.documentElement.clientHeight || 0);
      setViewport({ width, height });
    };
    measure();

    let timer: number | null = null;
    const onResize = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        measure();
        timer = null;
      }, 120);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, []);

  const { far, mid, near } = useMemo((): { far: Star[]; mid: Star[]; near: Star[] } => {
    if (!mounted || !viewport) {
      return { far: [] as Star[], mid: [] as Star[], near: [] as Star[] };
    }
    const width = viewport.width;
    const height = viewport.height;
    const area = width * height;
    const densityScale = width < 600 ? 0.6 : width < 900 ? 0.8 : 1.0;
    return {
      far: genStars(Math.min(180, Math.floor(area * 0.00004 * densityScale)), width, height),
      mid: genStars(Math.min(240, Math.floor(area * 0.00006 * densityScale)), width, height),
      near: genStars(Math.min(140, Math.floor(area * 0.00003 * densityScale)), width, height),
    };
  }, [mounted, viewport]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden${className ? ` ${className}` : ""}`}>
      <style jsx global>{`
        /* 背景のみで1画面に収め、余白によるスクロールを防止 */
        body { margin: 0; }
      `}</style>
      <StarAnimations />
      {mounted ? <StarField far={far} mid={mid} near={near} /> : null}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}


