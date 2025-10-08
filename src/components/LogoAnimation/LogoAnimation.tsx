"use client"
import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './LogoAnimation.module.css';

// Vivusライブラリの型定義
declare const Vivus: {
  new (element: string, options: { duration: number; start: string }, callback?: () => void): void;
};

declare const Snap: {
  (selector: string): {
    attr: (attributes: Record<string, number>) => void;
    selectAll: (selector: string) => {
      animate: (attributes: Record<string, number>, duration: number, callback?: () => void) => void;
    };
  };
};

// Windowインターフェースを拡張してVivusとSnapを追加
declare global {
  interface Window {
    Vivus?: typeof Vivus;
    Snap?: typeof Snap;
  }
}

export default function LogoAnimation() {
  const [animationPlayed, setAnimationPlayed] = useState(false);
  const [showText, setShowText] = useState(false);
  const iconRef = useRef<SVGSVGElement>(null);

  // アイコンのアニメーション関数
  const playIconAnimation = useCallback(() => {
    if (!animationPlayed) {
      setAnimationPlayed(true);
      
      setTimeout(() => {
        // SVGを表示
        const snapRoot = window.Snap?.("#plant-icon");
        if (snapRoot) {
          snapRoot.attr({ opacity: 1 });

          // 最初の部分を先に描画
          if (window.Vivus) {
            new window.Vivus("plant-icon", {
              duration: 60,
              start: 'autostart'
            }, () => {
              // 最初の部分の塗りをアニメーション
              const snapRootForFill = window.Snap?.("#plant-icon");
              if (snapRootForFill) {
                snapRootForFill.selectAll("path").animate(
                  {
                    "fill-opacity": 1,
                  },
                  60,
                );
              }

              // 芽と茎の部分を遅延表示（300ms後）
              setTimeout(() => {
                // leafGroupを表示
                const leafGroupRoot = window.Snap?.("#leafGroup");
                if (leafGroupRoot) {
                  leafGroupRoot.attr({ opacity: 1 });
                }

                // Vivusで芽と茎をペン描画風にアニメーション
                if (window.Vivus) {
                  new window.Vivus("leafGroup", {
                    duration: 60,
                    start: 'autostart'
                  }, () => {
                    // 描画完了後、塗りをアニメーション
                    const leafSnap = window.Snap?.("#leafGroup");
                    if (leafSnap) {
                      leafSnap.selectAll("path").animate(
                        {
                          "fill-opacity": 1,
                        },
                        60,
                        () => {
                          // ロゴアニメーション完了後、テキストアニメーションを開始
                          setTimeout(() => {
                            setShowText(true);
                          }, 200);
                        }
                      );
                    }
                  });
                }
              }, 300);
            });
          }
        }
      }, 500);
    }
  }, [animationPlayed]);

  useEffect(() => {
    // Vivus.jsとSnap.svgをロード
    const loadScripts = async () => {
      // Vivus.jsをロード
      if (!window.Vivus) {
        const vivusScript = document.createElement('script');
        vivusScript.src = 'https://cdn.jsdelivr.net/npm/vivus@0.4.6/dist/vivus.min.js';
        document.head.appendChild(vivusScript);
        
        await new Promise((resolve) => {
          vivusScript.onload = resolve;
        });
      }

      // Snap.svgをロード
      if (!window.Snap) {
        const snapScript = document.createElement('script');
        snapScript.src = 'https://cdn.jsdelivr.net/npm/snapsvg@0.5.1/dist/snap.svg-min.js';
        document.head.appendChild(snapScript);
        
        await new Promise((resolve) => {
          snapScript.onload = resolve;
        });
      }

      // アニメーションを開始
      playIconAnimation();
    };

    loadScripts();
  }, [playIconAnimation]);

  return (
    <div className={styles.logoContainer}>
      <div className={styles.iconWrapper}>
        <svg 
          id="plant-icon" 
          ref={iconRef}
          width="48" 
          height="48" 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0 }}
        >
          <path d="M24.0071 46.704V44.2235C24.0071 44.2235 16.4584 40.8258 4.00004 41.007V44.7672C4.13595 45.3107 4.63428 45.3107 4.63428 45.3107H22.2119C22.6196 46.704 24.0071 46.704 24.0071 46.704Z" stroke="white" strokeWidth="2"/>
          <path d="M24.0139 43.9047V35.8695C24.0139 35.8695 32.4403 24.3379 44.0379 23.547C46.0313 23.4111 46.9373 24.5436 46.9826 25.7216C46.9373 27.6696 47.0732 38.3611 46.9373 38.6783C46.883 39.0407 46.892 40.3092 44.5816 40.7169C31.3983 40.6263 24.0139 43.9047 24.0139 43.9047Z" stroke="white" strokeWidth="2"/>
          <path d="M23.9856 43.9047V35.8695C23.9856 35.8695 15.5592 24.3379 3.9616 23.547C1.96826 23.4111 1.06219 24.5436 1.01689 25.7216C1.06219 27.6696 0.926285 38.3611 1.06219 38.6783C1.11656 39.0407 1.1075 40.3092 3.41796 40.7169C16.6012 40.6263 23.9856 43.9047 23.9856 43.9047Z" stroke="white" strokeWidth="2"/>
          <path d="M24.0139 43.8315V26.7975C24.0139 26.7975 30.2658 18.9601 37.5143 18.643C38.1485 18.643 39.87 18.7789 40.1872 20.8628C40.2778 25.8461 40.1418 33.7289 40.1418 33.7289C40.1418 33.7289 40.1418 35.7177 37.5143 36.1753C28.4083 37.7609 24.0139 43.8315 24.0139 43.8315Z" stroke="white" strokeWidth="2"/>
          <path d="M23.9856 43.8315V26.7975C23.9856 26.7975 17.7338 18.9601 10.4852 18.643C9.851 18.643 8.12948 18.7789 7.81236 20.8628C7.72176 25.8461 7.85766 33.7289 7.85766 33.7289C7.85766 33.7289 7.85766 35.7177 10.4852 36.1753C19.5912 37.7609 23.9856 43.8315 23.9856 43.8315Z" stroke="white" strokeWidth="2"/>
          <g id="leafGroup" style={{ opacity: 0 }}>
            <path d="M35.9042 5.97663C37.4897 11.4583 31.4644 18.9253 24.0347 16.6682C23.8988 16.2151 23.3551 6.20312 30.2413 3.39436C32.6423 2.48831 35.1703 3.43966 35.9042 5.97663Z" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M14.1586 7.92439C13.2525 12.2282 18.0093 18.4347 23.8427 16.7338C23.9548 16.359 23.8427 8.60395 18.7231 5.75564C16.3331 4.93439 14.5823 5.96415 14.1586 7.92439Z" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M24.4878 16.804L35.9042 6.02191" stroke="white" strokeWidth="2"/>
            <path d="M23.8534 16.3966L15.5176 5.93156" stroke="white" strokeWidth="2"/>
            <line x1="24" y1="16.5" x2="24" y2="26.5" stroke="white" strokeWidth="1.02221"/>
          </g>
          <path d="M24 46.704V44.2235C24 44.2235 31.5487 40.8258 44.007 41.007V44.7672C43.8711 45.3107 43.3728 45.3107 43.3728 45.3107H25.7952C25.3874 46.704 24 46.704 24 46.704Z" stroke="white" strokeWidth="2"/>
        </svg>
      </div>
      
      {/* テキストアニメーション - 手書き風 */}
      <div className={styles.textWrapper}>
        {showText && (
          <svg 
            className={styles.textSvg}
            viewBox="0 0 360 60" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* え */}
            <text 
              x="0" 
              y="45" 
              className={styles.char}
              style={{ animationDelay: '0ms' }}
            >
              え
            </text>
            {/* ほ */}
            <text 
              x="60" 
              y="45" 
              className={styles.char}
              style={{ animationDelay: '200ms' }}
            >
              ほ
            </text>
            {/* ん */}
            <text 
              x="120" 
              y="45" 
              className={styles.char}
              style={{ animationDelay: '400ms' }}
            >
              ん
            </text>
            {/* の */}
            <text 
              x="180" 
              y="45" 
              className={styles.char}
              style={{ animationDelay: '600ms' }}
            >
              の
            </text>
            {/* た */}
            <text 
              x="240" 
              y="45" 
              className={styles.char}
              style={{ animationDelay: '800ms' }}
            >
              た
            </text>
            {/* ね */}
            <text 
              x="300" 
              y="45" 
              className={styles.char}
              style={{ animationDelay: '1000ms' }}
            >
              ね
            </text>
          </svg>
        )}
      </div>
    </div>
  );
}


