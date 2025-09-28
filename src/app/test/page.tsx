"use client"
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import WalkingCharacter from "@/components/Character/WalkingCharacter"
import Button from "@/components/Button/Button";
import Card from "@/components/Card/Card";
// import BookIcon from "@/components/BookIcon";
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

      {/* モーションレター（えほんのたね） */}
      <div className="flex justify-center mt-4">
        <div className="relative z-10 motion-logo">
          <span className="char" style={{ animationDelay: '0s' }}>え</span>
          <span className="char" style={{ animationDelay: '0.06s' }}>ほ</span>
          <span className="char" style={{ animationDelay: '0.12s' }}>ん</span>
          <span className="char" style={{ animationDelay: '0.18s' }}>の</span>
          <span className="char" style={{ animationDelay: '0.24s' }}>た</span>
          <span className="char" style={{ animationDelay: '0.30s' }}>ね</span>

          {/* スパークル */}
          <i className="sparkle" style={{ left: '-8px', top: '-6px', animationDelay: '.1s' }} />
          <i className="sparkle" style={{ left: '40%', top: '-10px', animationDelay: '.25s' }} />
          <i className="sparkle" style={{ right: '18%', top: '-4px', animationDelay: '.4s' }} />
          <i className="sparkle" style={{ left: '10%', bottom: '-6px', animationDelay: '.55s' }} />
          <i className="sparkle" style={{ right: '-6px', bottom: '-8px', animationDelay: '.7s' }} />
        </div>
      </div>
      
      <style jsx>{`
        /* 参考: Dribbble ロゴアニメーションのようなレター出現とシマーを意識 */
        /* https://dribbble.com/shots/2509279-Logo-animation?utm_source=Clipboard_Shot&utm_campaign=TonyBabel&utm_content=Logo%20animation&utm_medium=Social_Share&utm_source=Clipboard_Shot&utm_campaign=TonyBabel&utm_content=Logo%20animation&utm_medium=Social_Share */

        .motion-logo {
          display: inline-flex;
          gap: 0.06em;
          font-weight: 900;
          font-size: clamp(28px, 7vw, 44px);
          line-height: 1;
          position: relative;
          padding: 6px 10px;
          animation: logoFloat 6s ease-in-out infinite;
        }

        .char {
          position: relative;
          display: inline-block;
          transform-origin: bottom;
          background: linear-gradient(90deg, #6366f1, #a855f7 40%, #ec4899 80%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow:
            0 2px 0 rgba(255,255,255,0.25),
            0 0 18px rgba(168,85,247,0.35);
          /* レターのポップイン */
          animation:
            letterPop .6s cubic-bezier(.2,.8,.2,1) both,
            shimmer 2.4s linear infinite;
        }

        .sparkle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 70%),
                      linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6);
          box-shadow: 0 0 18px rgba(99,102,241,.6), 0 0 30px rgba(236,72,153,.3);
          animation: sparkle .9s ease-out infinite;
          pointer-events: none;
        }

        @keyframes letterPop {
          0% { transform: translateY(16px) scale(.8) rotate(-6deg); opacity: 0; filter: blur(2px); }
          60% { transform: translateY(-4px) scale(1.06) rotate(1deg); opacity: 1; filter: blur(0); }
          100% { transform: translateY(0) scale(1) rotate(0); }
        }

        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes sparkle {
          0% { transform: scale(0) translateY(0); opacity: 0; }
          30% { transform: scale(1) translateY(-6px); opacity: 1; }
          100% { transform: scale(0) translateY(-10px); opacity: 0; }
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        @keyframes motionFloat {
          0%, 100% { 
            transform: translateY(0px) translateZ(0px) scale(1);
          }
          33% { 
            transform: translateY(-15px) translateZ(30px) scale(1.1);
          }
          66% { 
            transform: translateY(-8px) translateZ(15px) scale(1.05);
          }
        }
        
        @keyframes motionRotate {
          0% { 
            transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg);
          }
          25% { 
            transform: rotateY(90deg) rotateX(10deg) rotateZ(3deg);
          }
          50% { 
            transform: rotateY(180deg) rotateX(0deg) rotateZ(0deg);
          }
          75% { 
            transform: rotateY(270deg) rotateX(-10deg) rotateZ(-3deg);
          }
          100% { 
            transform: rotateY(360deg) rotateX(0deg) rotateZ(0deg);
          }
        }
        
        @keyframes motionScale {
          0%, 100% { 
            transform: scale(1);
          }
          50% { 
            transform: scale(1.15);
          }
        }
        
        @keyframes motionGlow {
          0%, 100% { 
            filter: 
              drop-shadow(0 0 15px rgba(99, 102, 241, 0.6))
              drop-shadow(0 0 30px rgba(168, 85, 247, 0.4))
              drop-shadow(0 0 45px rgba(236, 72, 153, 0.3));
            opacity: 1;
          }
          50% { 
            filter: 
              drop-shadow(0 0 25px rgba(99, 102, 241, 0.9))
              drop-shadow(0 0 50px rgba(168, 85, 247, 0.7))
              drop-shadow(0 0 75px rgba(236, 72, 153, 0.5));
            opacity: 0.95;
          }
        }
      `}</style>

      {/* 本のアイコン（動作確認用） */}
      {/* <div className="flex justify-center mt-6">
        <BookIcon 
          size={100} 
          color="#6366f1"
          onToggle={(isOpen) => console.log('本が', isOpen ? '開きました' : '閉じました')}
        />
      </div> */}

      {/* カード */}
      <div className="flex justify-center">
        <Card height="400px" offsetY={360}>かこにつくったえほん</Card>
      </div>

      {/* 歩行アニメーションキャラクター */}
      <WalkingCharacter speed={30} />
    </BackgroundStars>
  )
}
    