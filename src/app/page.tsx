"use client"
import { useState, useEffect } from 'react';
import BackgroundStars from '@/components/BackgroundStars'
import LogoAnimation from "@/components/LogoAnimation/LogoAnimation";
import Button from '@/components/Button/Button';
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // テキストが表示されるタイミング（約2.7秒後）でボタンを表示
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 4700);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <BackgroundStars>
      <main className="min-h-[100dvh] flex flex-col justify-center items-center safe-area-inset-all">
        {/* ロゴアニメーション */}
        <div className="relative z-10">
          <LogoAnimation />
        </div>
        
        {/* ボタン */}
        <div className={`relative z-10 mt-8 transition-opacity duration-1000 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
          <Button 
            onClick={() => router.push("/upload-image")}
            className="!animate-none"
          >        
            えほんをつくる
          </Button>
        </div>
      </main>
    </BackgroundStars>
  )
}