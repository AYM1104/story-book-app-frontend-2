"use client";
import React from 'react';
import TitleSlider from '../TitleSlider';
import Button from '../Button/Button';

interface TitleItem {
  story_plot_id: number;
  title: string;
  description?: string;
}

interface ThemeInnerCardProps {
  titles: TitleItem[];
  currentIndex: number;
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
        <div className="flex h-full flex-col justify-center items-center">
          {/* タイトル表示 */}
          <div className="text-center text-lg font-bold text-gray-800 mb-2">
            {titles.length > 0 ? titles[currentIndex]?.title || 'テーマ' : 'テーマ'}
          </div>
          
          <TitleSlider
            titles={titles}
            currentIndex={currentIndex}
          />
          
          {/* テーマ選択ボタン */}
          <div className="mt-4">
            <Button 
              width={250} 
              onClick={onSelectTheme}
              disabled={isGeneratingImages || titles.length === 0}
            >
              {isGeneratingImages ? '画像生成中...' : 'このテーマを選択'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
