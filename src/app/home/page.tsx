"use client"
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character/Character"
import Button from '@/components/Button/Button';
import Card from "@/components/Card/Card";
import HeadingText from "@/components/HeadingText/HeadingText";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <BackgroundStars>
      <main className="min-h-[100dvh] flex flex-col safe-area-inset-all">
        <Header />

        {/* 見出し */}
        <div className="flex justify-center text-center mt-2 md:mt-8 lg:mt-1">
          <div className="relative z-10">
            <HeadingText>
              きょうは
              <br className="md:hidden" />
              どんな えほんのせかい へいく？
            </HeadingText>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex justify-center">
          <div className="relative z-10">
            <Button onClick={() => router.push("/upload-image")}>        
              えほんをつくる
            </Button>
          </div>
        </div>

        {/* キャラクター */}
        <Character bottomAligned={true} useContainerStyle={true} />

        {/* カード - 下固定 */}
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] left-0 right-0 flex justify-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 z-50">
          <Card>かこにつくったえほん</Card>
        </div>
      </main>
    </BackgroundStars>
  )
}


// "use client"
// import BackgroundStars from '../../components/BackgroundStars'
// import Header from "@/components/Header"
// import Character from "@/components/Character/Character"
// import Button from "@/components/Button/Button";
// import Card from "@/components/Card/Card";
// import styles from "./Home.module.css";
// import { useRouter } from "next/navigation";

// export default function Page() {
//   const router = useRouter();
//   return (
//     <BackgroundStars>
//       <Header />

//       {/* 見出し */}
//       <div className="flex justify-center text-center mt-2">
//         <p className={`${styles.desc} relative z-10`}>
//           きょうは
//           <br className={styles.mobileBreak} />
//           どんなえほんのせかいへ？
//         </p>
//       </div>

//       {/* ボタン */}
//       <div className="flex justify-center">
//         <Button width={280} className="relative -mt-2 z-10" onClick={() => router.push("/upload-image")}>
//           えほんをつくる
//         </Button>
//       </div>

//       {/* カード */}
//       <div className="flex justify-center">
//         <Card height="400px" offsetY={70}>かこにつくったえほん</Card>
//       </div>

//       {/* キャラクター */}
//       {/* キャラクター */}
//       <div className={styles.characterContainer}>
//         <Character bottomAligned={true} />
//       </div>
//     </BackgroundStars>
//   )
// }