"use client"
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character/Character"
import Button from '@/components/Button/Button';
import Card from "@/components/Card/Card";
import HeadingText from "@/components/HeadingText/HeadingText";

export default function Page() {
  return (
    <BackgroundStars>
      <Header />

      {/* 見出し */}
      <div className="flex justify-center text-center mt-2 md:mt-8 lg:mt-1">
        <div className="relative z-10">
          <HeadingText>
            きょうは どんな えほんのせかい へいく？
          </HeadingText>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <div className="relative z-10">
          <Button>        
            えほんをつくる
          </Button>
        </div>
      </div>

      {/* カード */}
      <div className="flex justify-center">
        <Card>かこにつくったえほん</Card>
      </div>

      {/* キャラクター */}
      <Character bottomAligned={true} useContainerStyle={true} />
    </BackgroundStars>
  )
}