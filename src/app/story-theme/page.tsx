"use client"
import { useState } from 'react'
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character"
import Card from "@/components/Card/Card"
import TitleSlider from "@/components/TitleSlider"
import useStoryTheme from "@/hooks/useStoryTheme"
import { handleSelectTheme } from "@/services/storyThemeService"
import styles from './StoryTheme.module.css'

export default function Page() {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false)
  const {
    storySettingId,
    latestTitles,
    titleSlideIndex,
    prevTitle,
    nextTitle,
    isLoading,
    error
  } = useStoryTheme()

  // テーマ選択（画像生成）処理
  const onSelectTheme = async () => {
    const currentTheme = latestTitles[titleSlideIndex]
    if (!currentTheme) {
      alert('テーマが選択されていません')
      return
    }

    setIsGeneratingImages(true)
    try {
      const totalGenerated = await handleSelectTheme(currentTheme)
      alert(`テーマ「${currentTheme.title}」の画像生成が完了しました！\n生成された画像数: ${totalGenerated}`)
    } catch (error) {
      console.error('画像生成エラー:', error)
      alert(`画像生成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsGeneratingImages(false)
    }
  }

  return (
    <BackgroundStars>
      <div className="min-h-screen flex flex-col">
        <Header />

        {/* 見出し */}
        <div className="flex justify-center text-center">
          <p className={`${styles.desc} relative z-10 text-[#362D30]`}>
            すきなおはなしを
            <br className={styles.mobileBreak} />
            えらんでね！
          </p>
        </div>

        {/* カード */}
        <div className="flex justify-center">
          <Card height="400px" offsetY={70} labelColor="#362D30">
            {latestTitles.length > 0 ? latestTitles[titleSlideIndex]?.title || 'テーマ' : 'テーマ'}
            <Card height="300px" offsetY={30} style={{ background: "rgba(255, 255, 255, 0.5)" }}>
              {error ? (
                <div className="text-center text-red-600">エラー: {error}</div>
              ) : (
                <div className="flex h-full flex-col justify-between">
                  <div className="mt-2">
                    <TitleSlider
                      titles={latestTitles}
                      currentIndex={titleSlideIndex}
                      onPrevious={prevTitle}
                      onNext={nextTitle}
                      onSelectTheme={onSelectTheme}
                      isGeneratingImages={isGeneratingImages}
                    />
                  </div>
                </div>
              )}
            </Card>
          </Card>
        </div>

        {/* キャラクター */}
        <div className="min-h-screen flex items-center justify-center pb-48 md:pb-56">
          <Character className="fixed left-1/2 bottom-0 -translate-x-1/2 pb-8 z-0" />
        </div>

      </div>
    </BackgroundStars>
  )
}
    