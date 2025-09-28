
interface TitleItem {
  story_plot_id: number;
  title: string;
  description?: string;
}

interface TitleSliderProps {
  titles: TitleItem[];
  currentIndex: number;
}

export default function TitleSlider({
  titles,
  currentIndex
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
        <div className="text-sm text-center whitespace-pre-wrap break-words text-[#362D30] opacity-80">
          {currentTitle?.description}
        </div>
      )}
    </div>
  );
}
