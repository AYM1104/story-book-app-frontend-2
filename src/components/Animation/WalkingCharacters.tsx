"use client"
import React, { useCallback } from 'react'

type WalkingCharactersProps = {
  // ループ再生するか（オーバーレイでは false 推奨）
  loop?: boolean
  // 横移動の所要時間（秒）: 長いほどゆっくり
  speedSeconds?: number
  // 表示するキャラクター数（等間隔でディレイを付与）
  numCharacters?: number
  // クリックで一時停止トグルを有効にするか
  enableClickPause?: boolean
}

// SVGベースの歩行アニメーションを表示するコンポーネント
// 元ソース: frontend/animation/index.html, style.css, script.js
export default function WalkingCharacters({ loop = true, speedSeconds = 25, numCharacters = 4, enableClickPause = true }: WalkingCharactersProps) {
  const handleClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!enableClickPause) return
    const target = e.target as HTMLElement
    const char = target.closest('.char') as HTMLElement | null
    if (char) {
      char.classList.toggle('paused')
    }
  }, [enableClickPause])

  // CSS変数を型安全に渡すための型
  type WrapperStyle = React.CSSProperties & {
    ['--walk-iterations']?: string
    ['--speed']?: string
  }
  const wrapperStyle: WrapperStyle = {
    ['--walk-iterations']: loop ? 'infinite' : '1',
    ['--speed']: `${speedSeconds}s`,
  }

  return (
    <div className="animation-wrapper" style={wrapperStyle}>
      <svg
        className="character"
        viewBox="0 0 620 400"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        onClick={handleClick}
      >
        <defs>
          <g id="CHAR">
            {/* キャラ全体をまとめるラッパ */}
            <g id="character" className="character-root">
              {/* 体と角の共通ラッパ：位置だけ決める */}
              <g id="torso" transform="translate(10,55)">
                {/* 角 */}
                <g transform="translate(161, -41)">
                  <g id="antler">
                    <path d="M57.1043 0.140505C8.08581 2.73628 0 51.0166 0 51.0166L18.6979 52.0549C18.6979 52.0549 21.7266 20.9063 57.1043 20.9063C70.749 20.9063 73.2757 26.6169 83.3827 29.2126C93.4896 31.8083 106.123 -2.45527 57.1043 0.140505Z" className="fill-body"/>
                  </g>
                </g>

                {/* 体本体 */}
                <g id="body">
                  <path d="M278.059 219.675C264.814 273.295 219.196 290 142.745 290C66.294 290 11.7045 275.531 1.59395 219.675C-7.73698 160.78 22.2041 3.4729 136.524 0.0524635C255.658 -3.51203 288.947 175.599 278.059 219.675Z" className="fill-body"/>
                </g>

                {/* 左目 白 */}
                <g transform="translate(41,51)">{/* 位置だけ */}
                  <g id="left-eye-white">
                    <circle cx="32.9578" cy="32.9576" r="32" fill="#F8F8FA"/>
                  </g>
                </g>
                {/* 左目 黒 */}
                <g transform="translate(48,62)">
                  <g id="left-eye-black" className="look-up-then-right">
                    <circle cx="18.6513" cy="18.3989" r="18" fill="#362D30"/>
                  </g>
                </g>

                {/* 右目 白 */}
                <g transform="translate(120,51)">
                  <g id="right-eye-white">
                    <circle cx="32.9578" cy="32.9576" r="32" fill="#F8F8FA"/>
                  </g>
                </g>
                {/* 右目 黒 */}
                <g transform="translate(127,62)">
                  <g id="right-eye-black" className="look-up-then-right">
                    <circle cx="18.6513" cy="18.3989" r="18" fill="#362D30"/>
                  </g>
                </g>
              </g>

              {/* 左足 */}
              <g transform="translate(80,308)">{/* 位置だけ */}
                <g id="left-leg" className="part left-leg"> {/* 回転だけ */}
                  <path d="M12.2442 45C18.7442 37.5 12.2442 0 12.2442 0H45.2441V57.5C45.2441 67.5 36.3751 72.5945 25.7442 74C15.6391 75.336 4.26317 76.0663 0.74416 66.5C-2.54317 57.5635 5.74409 52.5 12.2442 45Z" className="fill-body"/>
                </g>
              </g>

              {/* 右足 */}
              <g transform="translate(158,308)">
                <g id="right-leg" className="part right-leg">
                  <path d="M12.2442 45C18.7442 37.5 12.2442 0 12.2442 0H45.2441V57.5C45.2441 67.5 36.3751 72.5945 25.7442 74C15.6391 75.336 4.26317 76.0663 0.74416 66.5C-2.54317 57.5635 5.74409 52.5 12.2442 45Z" className="fill-body"/>
                </g>
              </g>
            </g>
          </g>
        </defs>

        {/* 実体を複数配置（色は <use fill> から指定）。等間隔ディレイ */}
        {Array.from({ length: Math.max(1, numCharacters) }).map((_, i) => {
          const colors = ["#FFC31C", "#77C7E3", "#E3662A", "#A481B4", "#5CC9A7", "#E86AA6"]
          const fill = colors[i % colors.length]
          const translateX = i * 320
          const delaySec = (i * speedSeconds) / Math.max(1, numCharacters)
          type CharStyle = React.CSSProperties & { ['--char-delay']?: string }
          const charStyle: CharStyle = { ['--char-delay']: `${delaySec}s` }
          return (
            <g key={i} className="char" style={charStyle}>
              <use href="#CHAR" xlinkHref="#CHAR" transform={`translate(${translateX},0)`} fill={fill} />
            </g>
          )
        })}
      </svg>

      <style jsx>{`
        .animation-wrapper {
          position: relative;
          width: 100%;
          min-height: 300px;
          overflow: visible;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /* SVG配置をモバイル対応に変更 */
        .character {
          width: 100%;
          max-width: 100vw;
          height: 300px;
          display: block;
          position: relative;
          overflow: visible;
        }

        #left-leg, #right-leg {
          transform-box: fill-box;
          transform-origin: 50% 0%;
        }

        /* 左足を前後に振る */
        #left-leg {
          animation: walk-left 1s infinite alternate ease-in-out;
          animation-play-state: var(--play, running);
        }

        /* 右足を前後に振る */
        #right-leg {
          animation: walk-right 1s infinite alternate ease-in-out;
          animation-play-state: var(--play, running);
        }

        @keyframes walk-left {
          0%   { transform: rotate(20deg); }
          100% { transform: rotate(-20deg); }
        }

        @keyframes walk-right {
          0%   { transform: rotate(-20deg); }
          100% { transform: rotate(20deg); }
        }

        /* 体+角の上下ゆれ（共通ラッパ） */
        #torso {
          animation: bob 1s infinite ease-in-out;
          animation-play-state: var(--play, running);
        }
        @keyframes bob {
          0%, 100% { transform: translate(10px,55px) translateY(0); }
          50%      { transform: translate(10px,55px) translateY(6px); }
        }

        /* 角だけのプルプル回転 */
        #antler {
          transform-box: fill-box;
          transform-origin: 20% 100%;
          animation: wiggle 1s infinite ease-in-out .05s;
          animation-play-state: var(--play, running);
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-6deg); }
          50%     { transform: rotate(6deg); }
        }

        /* 黒目は自分の中心基準で動かす */
        #left-eye-black, #right-eye-black {
          transform-box: fill-box;
          transform-origin: 50% 50%;
        }

        .look-up-then-right {
          animation: eye-up-then-right 4s infinite ease-in-out;
          animation-play-state: var(--play, running);
        }
        @keyframes eye-up-then-right {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(0, -10px); }
          50%  { transform: translate(10px, -10px); }
          75%  { transform: translate(18px, 0); }
          100% { transform: translate(0, 0); }
        }

        /* 横移動（本体ラッパ） */
        .character-root {
          animation: walk-move var(--speed, 25s) linear var(--walk-iterations, infinite) both;
          animation-play-state: var(--play, running);
          will-change: transform;
        }
        @keyframes walk-move {
          0%   { transform: translateX(100%); }
          100% { transform: translateX(-400%); }
        }

        /* 複数体のディレイ（可変・等間隔） */
        .char .character-root { 
          animation-delay: var(--char-delay, 0s);
        }

        /* 色は <use fill> を継承 */
        .char .fill-body { fill: inherit; }

        /* クリック停止用 */
        .char.paused { --play: paused; }
      `}</style>
    </div>
  )
}


