import Button from "@/components/button/Button";

interface TitleItem {
  story_plot_id: number;
  title: string;
  description?: string;
}

interface TitleSliderProps {
  titles: TitleItem[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectTheme: () => void;
  isGeneratingImages: boolean;
}

export default function TitleSlider({
  titles,
  currentIndex,
  onPrevious,
  onNext,
  onSelectTheme,
  isGeneratingImages
}: TitleSliderProps) {
  if (titles.length === 0) {
    return (
      <div className="text-center text-[#362D30]">タイトルをよみこみちゅう...</div>
    );
  }

  const currentTitle = titles[currentIndex];

  return (
    <div className="flex flex-col items-center">
      
      {currentTitle?.description && (
        <div className="mb-3 text-sm text-center whitespace-pre-wrap break-words text-[#362D30] opacity-80">
          {currentTitle?.description}
        </div>
      )}
      <div className="flex gap-2">
        <Button width={90} onClick={onPrevious}>まえへ</Button>
        <Button width={90} onClick={onNext}>つぎへ</Button>
      </div>
      <div className="mt-3 flex justify-center gap-1">
        {titles.map((_, idx) => (
          <span 
            key={idx} 
            className={`inline-block h-2 w-2 rounded-full ${
              idx === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
            }`} 
          />
        ))}
      </div>
      <div className="mt-4">
        <Button 
          width={200} 
          onClick={onSelectTheme}
          disabled={isGeneratingImages || titles.length === 0}
        >
          {isGeneratingImages ? '画像生成中...' : 'このテーマを選択'}
        </Button>
      </div>
    </div>
  );
}
