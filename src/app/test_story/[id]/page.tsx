"use client"
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import BackgroundStars from '../../../components/BackgroundStars'
import Header from "@/components/Header"
import StoryBookCard from "@/components/Card/StoryBookCard"
import Button from "@/components/Button/Button"
import HeadingText from "@/components/HeadingText/HeadingText"

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

export default function Page() {
    const params = useParams()
    const storybookId = params.id as string
    const [storybook, setStorybook] = useState<StoryBook | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showNextButton, setShowNextButton] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)

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

    // クリーンアップ処理
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [])

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

    // スクロール位置を監視する関数（デバウンス付き）
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement
        const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 10 // 10pxの余裕を持たせる
        
        // 既存のタイムアウトをクリア
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }
        
        // デバウンス処理（50ms後に状態を更新）
        scrollTimeoutRef.current = setTimeout(() => {
            setShowNextButton(isAtBottom)
        }, 50)
    }, [])

    // 現在のページのデータを取得する関数
    const getCurrentPageData = () => {
        if (!storybook) return null
        
        const pages = [
            { text: storybook.page_1, image: convertImageUrl(storybook.page_1_image_url) },
            { text: storybook.page_2, image: convertImageUrl(storybook.page_2_image_url) },
            { text: storybook.page_3, image: convertImageUrl(storybook.page_3_image_url) },
            { text: storybook.page_4, image: convertImageUrl(storybook.page_4_image_url) },
            { text: storybook.page_5, image: convertImageUrl(storybook.page_5_image_url) }
        ]
        
        return pages[currentPage - 1] || null
    }

    // 次のページに進む関数
    const goToNextPage = () => {
        if (currentPage < 5) {
            setCurrentPage(currentPage + 1)
            setShowNextButton(false) // ボタンを非表示にする
            
            // スクロールを一番上に戻す
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0
            }
        }
    }

    // 前のページに戻る関数
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            setShowNextButton(false) // ボタンを非表示にする
            
            // スクロールを一番上に戻す
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0
            }
        }
    }

    const currentPageData = getCurrentPageData()

    // ローディング状態
    if (loading) {
        return (
            <BackgroundStars>
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-lg text-white mb-4">読み込み中...</div>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        </div>
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
                        <StoryBookCard height="400px" maxWidth="600px">
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-lg text-red-400 mb-4">エラー</div>
                                    <div className="text-white mb-4">{error}</div>
                                    <Button 
                                        onClick={() => window.history.back()}
                                        width={150}
                                    >
                                        戻る
                                    </Button>
                                </div>
                            </div>
                        </StoryBookCard>
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
                        <StoryBookCard height="400px" maxWidth="600px">
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-lg text-white mb-4">絵本が見つかりません</div>
                                    <Button 
                                        onClick={() => window.history.back()}
                                        width={150}
                                    >
                                        戻る
                                    </Button>
                                </div>
                            </div>
                        </StoryBookCard>
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
                <div className="flex justify-center text-center mt-2 md:mt-8 lg:mt-1 px-6">
                    <div className="relative z-10">
                        <HeadingText>
                            {storybook.title} ({currentPage}/5)
                        </HeadingText>
                    </div>
                </div>

                {/* StoryBookCard表示エリア */}
                <div className="flex-1 flex justify-center items-center px-4">
                    <div className="w-full max-w-2xl">
                        <StoryBookCard>
                            <div className="w-full h-full flex flex-col items-center justify-start">
                                {/* 現在のページの画像表示 */}
                                {currentPageData?.image && (
                                    <div className="mb-4 w-full max-w-md">
                                        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                                            <img 
                                                src={currentPageData.image} 
                                                alt={`${currentPage}ページ目の画像`}
                                                className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-lg"
                                                onError={(e) => {
                                                    console.error('画像読み込みエラー:', currentPageData.image);
                                                    e.currentTarget.style.display = 'none'
                                                }}
                                                onLoad={() => {
                                                    console.log('画像読み込み成功:', currentPageData.image);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="text-center">
                                    {/* 現在のページのテキスト表示 */}
                                    {currentPageData?.text && (
                                        <div className="mb-1 w-full max-w-lg">
                                            <div 
                                                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-lg max-h-60 flex flex-col"
                                                style={{
                                                    scrollbarWidth: 'thin',
                                                    scrollbarColor: '#10b981 transparent'
                                                }}
                                            >
                                                <div 
                                                    ref={scrollContainerRef}
                                                    className="flex-1 overflow-y-scroll emerald-scrollbar"
                                                    onScroll={handleScroll}
                                                >
                                                    <p className="text-2xl text-white leading-relaxed text-center drop-shadow-lg mb-4">
                                                        {currentPageData.text}
                                                    </p>
                                                    
                                                    {/* ナビゲーションボタン */}
                                                    <div className="flex justify-between items-center mt-4">
                                                        {/* 戻るボタン - 1ページ目以外で表示 */}
                                                        {currentPage > 1 ? (
                                                            <Button 
                                                                onClick={goToPreviousPage}
                                                                width={120}
                                                            >
                                                                戻る
                                                            </Button>
                                                        ) : (
                                                            <div></div> // スペーサー
                                                        )}
                                                        
                                                        {/* 次へボタン - スクロールが一番下に来た時のみ表示（最後のページ以外） */}
                                                        {currentPage < 5 && (
                                                            <div 
                                                                className={`transition-all duration-300 ease-in-out ${
                                                                    showNextButton 
                                                                        ? 'opacity-100 transform translate-y-0' 
                                                                        : 'opacity-0 transform translate-y-2 pointer-events-none'
                                                                }`}
                                                            >
                                                                <Button 
                                                                    onClick={goToNextPage}
                                                                    width={120}
                                                                >
                                                                    次へ
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </StoryBookCard>
                    </div>
                </div>
            </div>
        </BackgroundStars>
    )
}