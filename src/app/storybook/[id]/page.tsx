"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import BackgroundStars from '../../../components/BackgroundStars'
import Header from "@/components/Header"
import Card from "@/components/Card/Card"
import Button from "@/components/Button/Button"

// 絵本データの型定義
interface StoryBook {
  id: number
  title: string
  description?: string
  page_1: string
  page_2: string
  page_3: string
  page_4: string
  page_5: string
  page_1_image_url?: string
  page_2_image_url?: string
  page_3_image_url?: string
  page_4_image_url?: string
  page_5_image_url?: string
  image_generation_status: string
  created_at: string
}

export default function StoryBookPage() {
  const params = useParams()
  const storybookId = params.id as string
  const [storybook, setStorybook] = useState<StoryBook | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 絵本データを取得
  useEffect(() => {
    const fetchStorybook = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`http://localhost:8000/storybook/${storybookId}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('絵本が見つかりません')
          }
          throw new Error('絵本の取得に失敗しました')
        }
        
        const data = await response.json()
        setStorybook(data)
      } catch (error) {
        console.error('絵本の取得エラー:', error)
        setError(error instanceof Error ? error.message : '不明なエラーが発生しました')
      } finally {
        setLoading(false)
      }
    }

    if (storybookId) {
      fetchStorybook()
    }
  }, [storybookId])

  // 画像URLを変換する関数
  const convertImageUrl = (imageUrl: string | null | undefined): string | null => {
    if (!imageUrl) return null
    
    // 絶対パスの場合は相対パスに変換
    if (imageUrl.includes('\\') || imageUrl.includes('C:')) {
      const parts = imageUrl.replace(/\\/g, '/').split('/')
      const filename = parts[parts.length - 1]
      return `http://localhost:8000/uploads/generated_images/${filename}`
    }
    
    // 既に相対パスの場合はそのまま
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`
  }

  // ページデータの準備
  const pages = storybook ? [
    { text: storybook.page_1, image: convertImageUrl(storybook.page_1_image_url), pageNum: 1 },
    { text: storybook.page_2, image: convertImageUrl(storybook.page_2_image_url), pageNum: 2 },
    { text: storybook.page_3, image: convertImageUrl(storybook.page_3_image_url), pageNum: 3 },
    { text: storybook.page_4, image: convertImageUrl(storybook.page_4_image_url), pageNum: 4 },
    { text: storybook.page_5, image: convertImageUrl(storybook.page_5_image_url), pageNum: 5 },
  ] : []

  const currentPageData = pages[currentPage - 1]

  // ローディング状態
  if (loading) {
    return (
      <BackgroundStars>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <Card height="400px" maxWidth="600px">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg text-[#362D30] mb-4">読み込み中...</div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#362D30] mx-auto"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </BackgroundStars>
    )
  }

  // エラー状態
  if (error) {
    return (
      <BackgroundStars>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <Card height="400px" maxWidth="600px">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg text-red-600 mb-4">エラー</div>
                  <div className="text-[#362D30] mb-4">{error}</div>
                  <Button 
                    onClick={() => window.history.back()}
                    width={150}
                  >
                    戻る
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </BackgroundStars>
    )
  }

  // 絵本データが存在しない場合
  if (!storybook) {
    return (
      <BackgroundStars>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <Card height="400px" maxWidth="600px">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg text-[#362D30] mb-4">絵本が見つかりません</div>
                  <Button 
                    onClick={() => window.history.back()}
                    width={150}
                  >
                    戻る
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </BackgroundStars>
    )
  }

  return (
    <BackgroundStars>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        {/* 絵本タイトル */}
        <div className="text-center mt-8 mb-4">
          <h1 className="text-3xl font-bold text-white mb-2" style={{
            textShadow: '0 0 6px rgba(255, 255, 255, 0.5), 0 0 14px rgba(227, 102, 42, 0.35)'
          }}>
            {storybook.title}
          </h1>
          {storybook.description && (
            <p className="text-white/80 text-lg">{storybook.description}</p>
          )}
        </div>

        {/* 絵本ページ表示エリア */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Card height="600px" maxWidth="800px">
            <div className="h-full flex flex-col">
              {/* ページコンテンツ */}
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                {/* 画像表示 */}
                {currentPageData?.image && (
                  <div className="mb-6 w-full max-w-md">
                    <img 
                      src={currentPageData.image} 
                      alt={`ページ ${currentPage}`}
                      className="w-full h-auto max-h-64 object-contain rounded-lg shadow-lg"
                      onError={(e) => {
                        // 画像読み込みエラーの場合、画像要素を非表示
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                
                {/* テキスト表示 */}
                {currentPageData?.text && (
                  <div className="w-full max-w-lg">
                    <div className="bg-white/90 rounded-lg p-6 shadow-lg">
                      <p className="text-lg text-[#362D30] leading-relaxed text-center">
                        {currentPageData.text}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* 画像がない場合の表示 */}
                {!currentPageData?.image && currentPageData?.text && (
                  <div className="w-full max-w-lg">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-8 shadow-lg border-2 border-orange-200">
                      <p className="text-xl text-[#362D30] leading-relaxed text-center">
                        {currentPageData.text}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ページナビゲーション */}
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <Button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  width={120}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← 前のページ
                </Button>
                
                <div className="text-center">
                  <span className="text-lg font-medium text-[#362D30]">
                    {currentPage} / {pages.length}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {storybook.image_generation_status === 'completed' ? '画像付き' : 'テキストのみ'}
                  </div>
                </div>
                
                <Button 
                  onClick={() => setCurrentPage(Math.min(pages.length, currentPage + 1))}
                  disabled={currentPage === pages.length}
                  width={120}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次のページ →
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* フッター */}
        <div className="text-center pb-4">
          <Button 
            onClick={() => window.history.back()}
            width={150}
            className="bg-gray-500 hover:bg-gray-600"
          >
            絵本一覧に戻る
          </Button>
        </div>
      </div>
    </BackgroundStars>
  )
}
