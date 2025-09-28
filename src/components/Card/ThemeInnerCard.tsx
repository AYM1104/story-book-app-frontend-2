"use client";
import React from 'react';
import TitleSlider from '../TitleSlider';

interface TitleItem {
  story_plot_id: number;
  title: string;
  description?: string;
}

interface ThemeInnerCardProps {
  titles: TitleItem[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectTheme: () => void;
  isGeneratingImages: boolean;
  error?: string | null;
}

/**
 * テーマ選択用のインナーカードコンポーネント
 * TitleSliderとエラー表示機能を提供
 */
export default function ThemeInnerCard({
  titles,
  currentIndex,
  onPrevious,
  onNext,
  onSelectTheme,
  isGeneratingImages,
  error
}: ThemeInnerCardProps) {
  return (
    <div 
      className="w-full h-full p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 rounded-2xl" 
      style={{ background: "rgba(255, 255, 255, 0.5)" }}
    >
      {error ? (
        <div className="text-center text-red-600">エラー: {error}</div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          <div className="mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6">
            <TitleSlider
              titles={titles}
              currentIndex={currentIndex}
              onPrevious={onPrevious}
              onNext={onNext}
              onSelectTheme={onSelectTheme}
              isGeneratingImages={isGeneratingImages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
