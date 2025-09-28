"use client"
import { useState } from 'react'
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character/Character"
import Card from "@/components/Card/Card"
import ThemeInnerCard from "@/components/Card/ThemeInnerCard"
import useStoryTheme from "@/hooks/useStoryTheme"
import { handleSelectTheme } from "@/services/storyThemeService"
import HeadingText from "@/components/HeadingText/HeadingText";
import Button from "@/components/Button/Button";

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
        <div className="flex justify-center">
          <Card>
            {latestTitles.length > 0 ? latestTitles[titleSlideIndex]?.title || 'テーマ' : 'テーマ'}
            <ThemeInnerCard
              titles={latestTitles}
              currentIndex={titleSlideIndex}
              onPrevious={prevTitle}
              onNext={nextTitle}
              onSelectTheme={onSelectTheme}
              isGeneratingImages={isGeneratingImages}
              error={error}
            />
          </Card>
        </div>

        {/* キャラクター */}
        <Character bottomAligned={true} useContainerStyle={true} />

      </div>
    </BackgroundStars>
  )
}
    