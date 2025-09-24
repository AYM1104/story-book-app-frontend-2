"use client"
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character"
import Button from "@/components/button/Button";
import Card from "@/components/Card/Card";
import styles from "./Test.module.css";

export default function Page() {
  return (
    <BackgroundStars>
      <Header />

      {/* 見出し */}
      <div className="flex justify-center text-center">
        <p className={`${styles.desc} relative z-10`}>
          きょうは
          <br className={styles.mobileBreak} />
          どんなえほんのせかいへ？
        </p>
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <Button width={280} className="relative -mt-2 z-10">
          えほんをつくる
        </Button>
      </div>

      {/* カード */}
      <div className="flex justify-center">
        <Card height="400px" offsetY={70}>かこにつくったえほん</Card>
      </div>

      {/* キャラクター */}
      <div className="min-h-screen flex items-center justify-center pb-48 md:pb-56">
        <Character className="fixed left-1/2 bottom-0 -translate-x-1/2 pb-8 z-0" />
      </div>
    </BackgroundStars>
  )
}
    