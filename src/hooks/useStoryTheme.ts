import { useEffect, useState } from 'react';
import { StoryPlotItem } from '../lib/types';

interface TitleItem {
  story_plot_id: number;
  title: string;
  description?: string;
  selected_theme?: string;
}

interface UseStoryThemeReturn {
  storySettingId: number | null;
  userId: number | null;
  latestTitles: TitleItem[];
  titleSlideIndex: number;
  setTitleSlideIndex: (index: number) => void;
  prevTitle: () => void;
  nextTitle: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function useStoryTheme(): UseStoryThemeReturn {
  const [storySettingId, setStorySettingId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [latestTitles, setLatestTitles] = useState<TitleItem[]>([]);
  const [titleSlideIndex, setTitleSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初期化: ローカルストレージからIDを取得
  useEffect(() => {
    try {
      // ローカルストレージからstory_setting_idを取得
      const savedStorySettingId = localStorage.getItem('story_setting_id');
      if (savedStorySettingId) {
        setStorySettingId(parseInt(savedStorySettingId));
      }
      
      // ユーザーIDを固定値2に設定
      setUserId(2);
    } catch (err) {
      console.error('ローカルストレージ読み込みエラー:', err);
    }
  }, []);

  // 最新3件タイトル取得
  useEffect(() => {
    const doFetch = async () => {
      if (!userId || !storySettingId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const url = `http://localhost:8000/story/story_plots?user_id=${userId}&story_setting_id=${storySettingId}&limit=3`;
        const res = await fetch(url);
        
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || 'Fetch latest titles failed');
        }
        
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        const formattedItems = items.map((it: StoryPlotItem) => ({
          story_plot_id: it.story_plot_id,
          title: it.title ?? '',
          description: it.description ?? '',
          selected_theme: it.selected_theme ?? undefined
        }));
        
        setLatestTitles(formattedItems);
        setTitleSlideIndex(0);
      } catch (e) {
        console.error(e);
        setError(e instanceof Error ? e.message : '不明なエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    doFetch();
  }, [userId, storySettingId]);

  // タイトルスライダー操作
  const prevTitle = () => {
    setTitleSlideIndex(i => 
      latestTitles.length === 0 ? 0 : (i - 1 + latestTitles.length) % latestTitles.length
    );
  };

  const nextTitle = () => {
    setTitleSlideIndex(i => 
      latestTitles.length === 0 ? 0 : (i + 1) % latestTitles.length
    );
  };

  return {
    storySettingId,
    userId,
    latestTitles,
    titleSlideIndex,
    setTitleSlideIndex,
    prevTitle,
    nextTitle,
    isLoading,
    error
  };
}
