"use client"
import { useEffect, useRef } from 'react'
import styles from './WalkingCharacter.module.css'

interface WalkingCharacterProps {
  className?: string
  speed?: number // アニメーション速度（秒）
  paused?: boolean // 一時停止状態
}

export default function WalkingCharacter({ 
  className = '', 
  speed = 25,
  paused = false 
}: WalkingCharacterProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // クリックで一時停止/再開の機能
    const handleClick = (e: MouseEvent) => {
      const char = (e.target as Element).closest('.char')
      if (char) {
        char.classList.toggle('paused')
      }
    }

    svg.addEventListener('click', handleClick)
    return () => svg.removeEventListener('click', handleClick)
  }, [])

  // CSS変数でアニメーション速度を制御
  useEffect(() => {
    const svg = svgRef.current
    if (svg) {
      svg.style.setProperty('--speed', `${speed}s`)
      svg.style.setProperty('--play', paused ? 'paused' : 'running')
    }
  }, [speed, paused])

  return (
    <svg 
      ref={svgRef}
      className={`${styles.character} ${className}`} 
      viewBox="0 0 620 400" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <g id="CHAR">
          {/* キャラ全体をまとめるラッパー */}
          <g id="character" className={styles.characterRoot}>
            {/* 体と角の共通ラッパ：位置だけ決める */}
            <g id="torso" transform="translate(10,55)">
              {/* 角 */}
              <g transform="translate(161, -41)">
                <g id="antler">
                  <path 
                    d="M57.1043 0.140505C8.08581 2.73628 0 51.0166 0 51.0166L18.6979 52.0549C18.6979 52.0549 21.7266 20.9063 57.1043 20.9063C70.749 20.9063 73.2757 26.6169 83.3827 29.2126C93.4896 31.8083 106.123 -2.45527 57.1043 0.140505Z" 
                    className={styles.fillBody}
                  />
                </g>
              </g>
            
              {/* 体本体 */}
              <g id="body">
                <path 
                  d="M278.059 219.675C264.814 273.295 219.196 290 142.745 290C66.294 290 11.7045 275.531 1.59395 219.675C-7.73698 160.78 22.2041 3.4729 136.524 0.0524635C255.658 -3.51203 288.947 175.599 278.059 219.675Z" 
                  className={styles.fillBody}
                />
              </g>
            
              {/* 左目 白 */}
              <g transform="translate(41,51)">
                <g id="left-eye-white">
                  <circle cx="32.9578" cy="32.9576" r="32" fill="#F8F8FA"/>
                </g>
              </g>
              {/* 左目 黒 */}
              <g transform="translate(48,62)">
                <g id="left-eye-black" className={styles.lookUpThenRight}>
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
                <g id="right-eye-black" className={styles.lookUpThenRight}>
                  <circle cx="18.6513" cy="18.3989" r="18" fill="#362D30"/>
                </g>
              </g>
            </g>

            {/* 左足 */}
            <g transform="translate(80,308)">
              <g id="left-leg" className={`${styles.part} ${styles.leftLeg}`}>
                <path 
                  d="M12.2442 45C18.7442 37.5 12.2442 0 12.2442 0H45.2441V57.5C45.2441 67.5 36.3751 72.5945 25.7442 74C15.6391 75.336 4.26317 76.0663 0.74416 66.5C-2.54317 57.5635 5.74409 52.5 12.2442 45Z" 
                  className={styles.fillBody}
                />
              </g>
            </g>

            {/* 右足 */}
            <g transform="translate(158,308)">
              <g id="right-leg" className={`${styles.part} ${styles.rightLeg}`}>
                <path 
                  d="M12.2442 45C18.7442 37.5 12.2442 0 12.2442 0H45.2441V57.5C45.2441 67.5 36.3751 72.5945 25.7442 74C15.6391 75.336 4.26317 76.0663 0.74416 66.5C-2.54317 57.5635 5.74409 52.5 12.2442 45Z" 
                  className={styles.fillBody}
                />
              </g>
            </g>
          </g>
        </g>
      </defs>

      {/* 複数のキャラクターを配置 */}
      {/* 左：黄色 */}
      <g className="char">
        <use href="#CHAR" xlinkHref="#CHAR" transform="translate(0,0)" fill="#FFC31C" />
      </g>

      {/* 右：水色 */}
      <g className="char">
        <use href="#CHAR" xlinkHref="#CHAR" transform="translate(320,0)" fill="#77C7E3" />
      </g>

      {/* オレンジ */}
      <g className="char">
        <use href="#CHAR" xlinkHref="#CHAR" transform="translate(640,0)" fill="#E3662A" />
      </g>

      {/* 紫 */}
      <g className="char">
        <use href="#CHAR" xlinkHref="#CHAR" transform="translate(960,0)" fill="#A481B4" />
      </g>
    </svg>
  )
}
