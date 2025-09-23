"use client"
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Characeer"
import Button from "@/components/button/Button";
import Card from "@/components/Card/Card";

export default function Page() {
  return (
    <BackgroundStars>
      <div className="min-h-screen flex flex-col">
        <Header />
        <p className="desc">
          きょうは
          <br className="mobileBreak" />
          どんなえほんのせかいへ？
        </p>
        <Button width={280} className="self-center -mt-2">えほんをつくる</Button>

        <div className="mt-auto flex justify-center pt-4 pb-8">
          <Character />
          <Card height="300px" offsetY={200}>かこにつくったえほん</Card>
        </div>
        <style jsx>{`
          .desc { color: #F8F8FA; margin: 0 0 24px; font-size: 28px; line-height: 1.7; 
            text-shadow: 0 0 6px rgba(255, 255, 255, 0.5), 0 0 14px rgba(227, 102, 42, 0.35);
            animation: glowPulse 2.6s ease-in-out infinite;
          }
          @keyframes glowPulse {
            0%, 100% {
              text-shadow: 0 0 6px rgba(255, 255, 255, 0.5), 0 0 14px rgba(227, 102, 42, 0.35);
            }
            50% {
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 22px rgba(227, 102, 42, 0.55);
            }
          }
          .mobileBreak { display: none; }
          @media (max-width: 599px) {
            .desc { text-align: center; font-size: 22px; }
            .mobileBreak { display: inline; }
          }
        `}</style>
      </div>
    </BackgroundStars>
  )
}
    