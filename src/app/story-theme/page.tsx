"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character/Character"
import Card from "@/components/Card/Card"
import ThemeInnerCard from "@/components/Card/ThemeInnerCard"
import useStoryTheme from "@/hooks/useStoryTheme"
import { handleSelectTheme } from "@/services/storyThemeService"
import HeadingText from "@/components/HeadingText/HeadingText";
import Button from "@/components/Button/Button";
import ProgressDots from "@/components/ProgressDots";
import { ImageGenerationProgress } from "@/components/ProgressBar";
import useImageGenerationProgress from "@/hooks/useImageGenerationProgress";  

export default function Page() {
  const router = useRouter()
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const {
    latestTitles,
    titleSlideIndex,
    prevTitle,
    nextTitle,
    error
  } = useStoryTheme()
  
  // 画像生成プログレス管理
  const {
    progress: imageProgress,
    startGeneration,
    setImageGenerating,
    setImageCompleted,
    setImageFailed,
    finishGeneration,
    resetProgress
  } = useImageGenerationProgress()

  // テーマ選択（画像生成）処理
  const onSelectTheme = async () => {
    const currentTheme = latestTitles[titleSlideIndex]
    if (!currentTheme) {
      alert('テーマが選択されていません')
      return
    }

    setIsGeneratingImages(true)
    startGeneration(5) // 5枚の画像を生成予定
    
    try {
      // プログレス更新コールバック関数
      const handleProgress = (current: number, total: number, pageNumber?: number, status?: 'generating' | 'completed' | 'failed') => {
        if (status === 'generating' && pageNumber) {
          setImageGenerating(pageNumber, `ページ ${pageNumber} の画像を生成中...`)
        } else if (status === 'completed' && pageNumber) {
          setImageCompleted(pageNumber)
        } else if (status === 'failed' && pageNumber) {
          setImageFailed(pageNumber, `ページ ${pageNumber} の生成に失敗`)
        } else {
          // 全体の進捗更新
          setImageGenerating(current + 1, `画像生成中... (${current + 1}/${total})`)
        }
      }
      
      const { totalGenerated, storybookId } = await handleSelectTheme(currentTheme, handleProgress)
      
      finishGeneration()
      
      alert(`テーマ「${currentTheme.title}」の画像生成が完了しました！\n生成された画像数: ${totalGenerated}`)
      
      // 生成完了後、自動でstorybookページに遷移
      router.push(`/storybook/${storybookId}`)
    } catch (error) {
      console.error('画像生成エラー:', error)
      finishGeneration()
      alert(`画像生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsGeneratingImages(false)
      resetProgress()
    }
  }


  return (
    <BackgroundStars>
      <div className="min-h-screen flex flex-col safe-area-inset-all">
        <Header />

        {/* 見出し */}
        <div className="flex justify-center text-center mt-2 md:mt-8 lg:mt-1">
          <div className="relative z-10">
            <HeadingText>
              すきなおはなしを
              <br className="md:hidden" />
              えらんでね！
            </HeadingText>
          </div>
        </div>

        {/* ボタン　※余白用に配置 */}
        <div className="flex justify-center opacity-0">
          <div className="relative z-10">
            <Button>        
              余白用のボタン
            </Button>
          </div>
        </div>

        {/* カード */}
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] left-0 right-0 flex justify-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 z-50">
          <Card>
            {/* 画像生成中のプログレスバー表示 */}
            {isGeneratingImages && (
              <div className="absolute inset-0 flex items-center justify-center z-30 bg-white/5 backdrop-blur-sm rounded-2xl">
                <ImageGenerationProgress
                  currentImage={imageProgress.current}
                  totalImages={imageProgress.total}
                  currentImageDetails={imageProgress.currentImageDetails}
                  className="mx-4"
                />
              </div>
            )}
            
            <ThemeInnerCard    
              titles={latestTitles}
              currentIndex={titleSlideIndex}
              onSelectTheme={onSelectTheme}
              isGeneratingImages={isGeneratingImages}
              error={error}
            />
            
            {/* 外側カード内に配置されたナビゲーションボタン - 垂直中央揃え */}
            <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2 flex items-center justify-between z-20">
              {/* まえへボタン - 左端近くに配置 */}
              <button
                onClick={prevTitle}
                disabled={titleSlideIndex === 0}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: titleSlideIndex === 0 ? '#FFC31C80' : '#FFC31C',
                  color: '#362D30',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: titleSlideIndex === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  opacity: titleSlideIndex === 0 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (titleSlideIndex > 0) {
                    e.currentTarget.style.backgroundColor = '#E6B019';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (titleSlideIndex > 0) {
                    e.currentTarget.style.backgroundColor = '#FFC31C';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseDown={(e) => {
                  if (titleSlideIndex > 0) {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }
                }}
                onMouseUp={(e) => {
                  if (titleSlideIndex > 0) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              
              {/* つぎへボタン - 右端近くに配置 */}
              <button
                onClick={nextTitle}
                disabled={titleSlideIndex === latestTitles.length - 1}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: titleSlideIndex === latestTitles.length - 1 ? '#FFC31C80' : '#FFC31C',
                  color: '#362D30',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: titleSlideIndex === latestTitles.length - 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  opacity: titleSlideIndex === latestTitles.length - 1 ? 0.5 : 1
                }}
                onMouseEnter={(e) => {
                  if (titleSlideIndex < latestTitles.length - 1) {
                    e.currentTarget.style.backgroundColor = '#E6B019';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (titleSlideIndex < latestTitles.length - 1) {
                    e.currentTarget.style.backgroundColor = '#FFC31C';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseDown={(e) => {
                  if (titleSlideIndex < latestTitles.length - 1) {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }
                }}
                onMouseUp={(e) => {
                  if (titleSlideIndex < latestTitles.length - 1) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                </svg>
              </button>
            </div>
            
            {/* カード下部にプログレスドット */}
            {latestTitles.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <ProgressDots total={latestTitles.length} currentIndex={titleSlideIndex} />
              </div>
            )}
          </Card>
        </div>

        {/* キャラクター */}
        <Character bottomAligned={true} useContainerStyle={true} />

      </div>
    </BackgroundStars>
  )
}
    