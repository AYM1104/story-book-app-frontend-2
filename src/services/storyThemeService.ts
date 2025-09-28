import { StoryPlotItem as TitleItem, ImageGenerationResult, GeneratedImage } from '../lib/types';

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
  strength: number = 0.8,
  prefix: string = "storyplot_i2i_all",
  referenceImagePath?: string
): Promise<ImageGenerationResponse> {
  const response = await fetch('http://localhost:8000/images/generation/generate-storyplot-all-pages-image-to-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      story_plot_id: storyPlotId,
      strength,
      prefix,
      // backend側は未指定の場合に自動解決するが、ここで明示指定すると確実
      reference_image_path: referenceImagePath
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || '画像生成に失敗しました');
  }

  return await response.json();
}

/**
 * テーマを確定してストーリーブックを作成
 * - backend: POST /storybook/confirm-theme-and-create
 */
async function confirmThemeAndCreate(storyPlotId: number, selectedTheme: string): Promise<ThemeConfirmationResponse> {
  const res = await fetch('http://localhost:8000/storybook/confirm-theme-and-create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ story_plot_id: storyPlotId, selected_theme: selectedTheme })
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || 'テーマ確定に失敗しました');
  }

  return await res.json();
}

/**
 * 生成された画像のファイルパスをGeneratedStoryBookに紐づけ
 * - backend: POST /storybook/update-image-urls
 */
async function updateStorybookImageUrls(payload: StorybookImageUrlUpdateRequest): Promise<StorybookImageUrlUpdateResponse> {
  const res = await fetch('http://localhost:8000/storybook/update-image-urls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || '画像URLの更新に失敗しました');
  }

  return await res.json();
}

/**
 * テーマ選択処理（画像生成を含む）
 * @param currentTheme 選択されたテーマ
 * @returns 生成された画像数
 */
export async function handleSelectTheme(currentTheme: TitleItem): Promise<number> {
  if (!currentTheme) {
    throw new Error('テーマが選択されていません');
  }

  // 1) テーマ確定して StoryBook を作成
  //    - selected_theme は UI上のタイトルを採用（サーバ側のgenerated_storiesキーと一致する前提）
  const themeKey = currentTheme.selected_theme ?? currentTheme.title;
  const { storybook_id } = await confirmThemeAndCreate(currentTheme.story_plot_id, themeKey);

  // 2) 画像生成（全ページ i2i 生成）: アップロード画像の参照パスを明示指定
  let referencePath: string | undefined = undefined;
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('uploaded_image_path') : null;
    if (stored && stored.trim().length > 0) {
      referencePath = stored;
    }
  } catch {}
  const result: ImageGenerationResult = await generateStoryPlotImages(currentTheme.story_plot_id, 0.8, 'storyplot_i2i_all', referencePath);

  // 3) 生成結果を page_n_image_url に割り当てて更新
  //    - backendはURL想定だが、現状はローカルのファイルパスをそのまま保存
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
    } catch (e) {
      // 画像URL更新に失敗しても、生成枚数は返す
      console.error(e);
    }
  }

  return result.total_generated;
}
