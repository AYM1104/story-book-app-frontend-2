"use client"
import { useState, useEffect, useCallback } from 'react';
import BackgroundStars from '@/components/BackgroundStars'
import LogoAnimation from "@/components/LogoAnimation/LogoAnimation";
import Button from '@/components/Button/Button';
import { useRouter } from "next/navigation";

// ボタン用グローアニメーションのCSS
const buttonGlowStyle = `
  @keyframes buttonGlow {
    from {
      filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.4));
    }
    to {
      filter: drop-shadow(0 0 16px rgba(16, 185, 129, 0.8));
    }
  }
`;

// スタイルをheadに追加
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = buttonGlowStyle;
  document.head.appendChild(styleElement);
}

export default function Page() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  const handleTextAnimationComplete = useCallback(() => {
    // テキストアニメーション完了後にボタンを表示
    setShowButton(true);
  }, []);
  
  return (
    <BackgroundStars>
      <main className="min-h-[100dvh] flex flex-col justify-center items-center safe-area-inset-all">
        {/* ロゴアニメーション */}
        <div className="relative z-10">
          <LogoAnimation onTextComplete={handleTextAnimationComplete} />
        </div>
        
        {/* ボタン */}
        <div className={`relative z-10 mt-8 transition-opacity duration-1000 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
          <Button 
            onClick={() => router.push("/upload-image")}
            className="!animate-none hover:!animate-none button-glow"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.4))',
              animation: 'buttonGlow 2s ease-in-out infinite alternate'
            }}
          >        
            えほんをつくる
          </Button>
        </div>
      </main>
    </BackgroundStars>
  )
}