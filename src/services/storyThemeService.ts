import { StoryPlotItem as TitleItem, ImageGenerationResult, GeneratedImage } from '../lib/types';

// バックエンドAPIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ImageGenerationResponse {
  total_generated: number;
}

// ストーリーブック作成（テーマ確定）レスポンス
interface ThemeConfirmationResponse {
  success: boolean;
  message: string;
  storybook_id: number;
  selected_theme: string;
}

// 画像URL更新リクエスト
interface StorybookImageUrlUpdateRequest {
  storybook_id: number;
  page_1_image_url?: string;
  page_2_image_url?: string;
  page_3_image_url?: string;
  page_4_image_url?: string;
  page_5_image_url?: string;
}

// 画像URL更新レスポンス
interface StorybookImageUrlUpdateResponse {
  success: boolean;
  message: string;
  storybook_id: number;
  updated_pages: string[];
}

/**
 * ストーリープロットの画像生成を実行する
 * @param storyPlotId ストーリープロットID
 * @param strength 画像生成の強度（0.0-1.0）
 * @param prefix 生成画像のプレフィックス
 * @returns 生成結果
 */
export async function generateStoryPlotImages(
  storyPlotId: number,
  strength: number = 1.0,
  prefix: string = "storyplot_i2i_all",
  referenceImagePath?: string
): Promise<ImageGenerationResponse> {
  const url = `${API_BASE_URL}/images/generation/generate-storyplot-all-pages-image-to-image`;
  const payload = {
    story_plot_id: storyPlotId,
    strength,
    prefix,
    // backend側は未指定の場合に自動解決するが、ここで明示指定すると確実
    reference_image_path: referenceImagePath
  };
  
  console.log('🖼️ Image generation request:', { url, payload });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('🖼️ Image generation response status:', response.status);
    console.log('🖼️ Image generation response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Image generation failed:', errorText);
      throw new Error(errorText || '画像生成に失敗しました');
    }

    const result = await response.json();
    console.log('🖼️ Image generation result:', result);
    return result;
  } catch (error) {
    console.error('❌ Image generation fetch error:', error);
    throw error;
  }
}

/**
 * 選択されたテーマの物語本文を生成
 * - backend: POST /story/select_theme
 */
async function generateStoryForTheme(storySettingId: number, selectedTheme: string): Promise<{ story_plot_id: number; title: string }> {
  const url = `${API_BASE_URL}/story/select_theme`;
  const payload = { story_setting_id: storySettingId, selected_theme: selectedTheme };
  
  console.log('📖 Story generation request:', { url, payload });
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📖 Story generation response status:', res.status);
    console.log('📖 Story generation response ok:', res.ok);

    if (!res.ok) {
      const msg = await res.text();
      console.error('❌ Story generation failed:', msg);
      throw new Error(msg || '物語生成に失敗しました');
    }

    const result = await res.json();
    console.log('📖 Story generation result:', result);
    return result;
  } catch (error) {
    console.error('❌ Story generation fetch error:', error);
    throw error;
  }
}

/**
 * テーマを確定してストーリーブックを作成
 * - backend: POST /storybook/confirm-theme-and-create
 */
async function confirmThemeAndCreate(storyPlotId: number, selectedTheme: string): Promise<ThemeConfirmationResponse> {
  const url = `${API_BASE_URL}/storybook/confirm-theme-and-create`;
  const payload = { story_plot_id: storyPlotId, selected_theme: selectedTheme };
  
  console.log('📚 Theme confirmation request:', { url, payload });
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('📚 Theme confirmation response status:', res.status);
    console.log('📚 Theme confirmation response ok:', res.ok);

    if (!res.ok) {
      const msg = await res.text();
      console.error('❌ Theme confirmation failed:', msg);
      throw new Error(msg || 'テーマ確定に失敗しました');
    }

    const result = await res.json();
    console.log('📚 Theme confirmation result:', result);
    return result;
  } catch (error) {
    console.error('❌ Theme confirmation fetch error:', error);
    throw error;
  }
}

/**
 * 生成された画像のファイルパスをGeneratedStoryBookに紐づけ
 * - backend: POST /storybook/update-image-urls
 */
async function updateStorybookImageUrls(payload: StorybookImageUrlUpdateRequest): Promise<StorybookImageUrlUpdateResponse> {
  const url = `${API_BASE_URL}/storybook/update-image-urls`;
  
  console.log('🔄 Image URL update request:', { url, payload });
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('🔄 Image URL update response status:', res.status);
    console.log('🔄 Image URL update response ok:', res.ok);

    if (!res.ok) {
      const msg = await res.text();
      console.error('❌ Image URL update failed:', msg);
      throw new Error(msg || '画像URLの更新に失敗しました');
    }

    const result = await res.json();
    console.log('🔄 Image URL update result:', result);
    return result;
  } catch (error) {
    console.error('❌ Image URL update fetch error:', error);
    throw error;
  }
}

/**
 * テーマ選択処理（物語生成と画像生成を含む）
 * @param currentTheme 選択されたテーマ
 * @param storySettingId ストーリー設定ID
 * @param onProgress 進捗更新のコールバック関数
 * @returns 生成された画像数とstorybook_id
 */
export async function handleSelectTheme(
  currentTheme: TitleItem,
  storySettingId: number,
  onProgress?: (current: number, total: number, pageNumber?: number, status?: 'generating' | 'completed' | 'failed') => void
): Promise<{ totalGenerated: number; storybookId: number }> {
  if (!currentTheme) {
    throw new Error('テーマが選択されていません');
  }

  // selected_theme は UI上のタイトルを採用（サーバ側のtheme_optionsキーと一致する前提）
  const themeKey = currentTheme.selected_theme ?? currentTheme.title;

  // 1) 選択されたテーマの物語本文を生成
  console.log('📖 ステップ1: 選択されたテーマの物語を生成中...');
  const storyResult = await generateStoryForTheme(storySettingId, themeKey);
  const storyPlotId = storyResult.story_plot_id;
  console.log(`✅ 物語生成完了: story_plot_id=${storyPlotId}`);

  // 2) テーマ確定して StoryBook を作成
  console.log('📚 ステップ2: ストーリーブックを作成中...');
  const { storybook_id } = await confirmThemeAndCreate(storyPlotId, themeKey);
  console.log(`✅ ストーリーブック作成完了: storybook_id=${storybook_id}`);

  // 3) 画像生成（全ページ i2i 生成）: アップロード画像の参照パスを明示指定
  console.log('🖼️ ステップ3: 画像生成中...');
  let referencePath: string | undefined = undefined;
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('uploaded_image_path') : null;
    if (stored && stored.trim().length > 0) {
      referencePath = stored;
    }
  } catch {}
  
  // 進捗更新コールバックを呼び出し
  onProgress?.(0, 5);
  
  const result: ImageGenerationResult = await generateStoryPlotImages(storyPlotId, undefined, 'storyplot_i2i_all', referencePath);
  console.log(`✅ 画像生成完了: ${result.total_generated}枚`);

  // 4) 生成結果を page_n_image_url に割り当てて更新
  console.log('🔄 ステップ4: 画像URLを更新中...');
  if (Array.isArray(result?.images) && result.images.length > 0) {
    // page_number でソートし、対応するpage_nに入れる
    const byPage = new Map<number, string>();
    result.images.forEach((img: GeneratedImage) => {
      if (typeof img?.page_number === 'number' && typeof img?.filepath === 'string') {
        byPage.set(img.page_number, img.filepath);
      }
    });

    const updatePayload: StorybookImageUrlUpdateRequest = {
      storybook_id,
      page_1_image_url: byPage.get(1),
      page_2_image_url: byPage.get(2),
      page_3_image_url: byPage.get(3),
      page_4_image_url: byPage.get(4),
      page_5_image_url: byPage.get(5),
    };

    try {
      await updateStorybookImageUrls(updatePayload);
      console.log('✅ 画像URL更新完了');
    } catch (e) {
      // 画像URL更新に失敗しても、生成枚数は返す
      console.error('⚠️ 画像URL更新エラー:', e);
    }
  }

  console.log('✅ 全処理完了');
  return { totalGenerated: result.total_generated, storybookId: storybook_id };
}
