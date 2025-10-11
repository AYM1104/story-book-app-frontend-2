"use client"
import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import BackgroundStars from '../../../components/BackgroundStars'
import Header from "@/components/Header"
import StoryBookCard from "@/components/Card/StoryBookCard"
import Button from "@/components/Button/Button"
import HeadingText from "@/components/HeadingText/HeadingText"
import ImageGenerationAnimation from "@/components/ImageGenerationAnimation"

// バックエンドAPIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
  uploaded_image?: {
    id: number
    filename: string
    file_path: string
    public_url?: string
    uploaded_at: string
  }
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
    
    // 画像生成中のアニメーション状態
    const [isGeneratingImages, setIsGeneratingImages] = useState(false)
    const [generationProgress, setGenerationProgress] = useState(0)
    const [generationCurrent, setGenerationCurrent] = useState(0)
    const [generationTotal, setGenerationTotal] = useState(5)
    const [generationMessage, setGenerationMessage] = useState("素敵な絵を描いています...")

    // 画像生成の進捗をシミュレートする関数
    const simulateImageGenerationProgress = () => {
        setGenerationProgress(0)
        setGenerationCurrent(0)
        setGenerationTotal(5)
        
        // 画像生成の進捗をシミュレート
        const interval = setInterval(() => {
            setGenerationCurrent(prev => {
                const newCurrent = prev + 1
                const newProgress = (newCurrent / 5) * 100
                
                setGenerationProgress(newProgress)
                
                // メッセージを更新
                if (newCurrent === 1) {
                    setGenerationMessage("1枚目の絵を描いています...")
                } else if (newCurrent === 2) {
                    setGenerationMessage("2枚目の絵を描いています...")
                } else if (newCurrent === 3) {
                    setGenerationMessage("3枚目の絵を描いています...")
                } else if (newCurrent === 4) {
                    setGenerationMessage("4枚目の絵を描いています...")
                } else if (newCurrent === 5) {
                    setGenerationMessage("5枚目の絵を描いています...")
                    // 完了
                    setTimeout(() => {
                        setIsGeneratingImages(false)
                        clearInterval(interval)
                    }, 1000)
                }
                
                return newCurrent
            })
        }, 2000) // 2秒間隔で進捗を更新
        
        // コンポーネントがアンマウントされた場合のクリーンアップ
        return () => clearInterval(interval)
    }

    // 絵本データを取得 
    useEffect(() => {
        const fetchStorybook = async () => {
            try {
                setLoading(true)
                setError(null)
                
                const response = await fetch(`${API_BASE_URL}/storybook/${storybookId}`)
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('絵本が見つかりません')
                    }
                    throw new Error('絵本の取得に失敗しました')
                }
                
                const data = await response.json()
                console.log('📚 Storybook data received:', data)
                console.log('🖼️ Uploaded image data:', data.uploaded_image)
                setStorybook(data)
                
                // 画像生成状態をチェック
                if (data.image_generation_status === 'generating' || data.image_generation_status === 'pending') {
                    setIsGeneratingImages(true)
                    setGenerationMessage("絵本の絵を描いています...")
                    // 画像生成の進捗をシミュレート（実際のAPIから進捗を取得できない場合）
                    simulateImageGenerationProgress()
                }
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
        
        // バックエンドからGCSの公開URLが返されるため、そのまま使用
        return imageUrl
    }

    // アップロード画像のURLを変換する関数
    const convertUploadedImageUrl = (uploadedImage: StoryBook['uploaded_image']): string | null => {
        if (!uploadedImage) {
            console.log('❌ uploadedImage is null')
            return null
        }
        
        console.log('🔍 uploadedImage data:', uploadedImage)
        
        // GCSの公開URLがある場合はそれを使用
        if (uploadedImage.public_url) {
            console.log('✅ Using public_url:', uploadedImage.public_url)
            // スマホ対応のためURL形式を変換
            const imageUrl = uploadedImage.public_url
            
            // 複数のURL形式を試す
            if (imageUrl.startsWith('https://storage.googleapis.com/')) {
                // 1. storage.cloud.google.com形式に変換
                const cloudUrl = imageUrl.replace('https://storage.googleapis.com/', 'https://storage.cloud.google.com/')
                console.log('📱 スマホ対応URL変換 (cloud):', cloudUrl)
                
                // 2. 元のURLも保持してフォールバック用に
                console.log('📱 元のURL (googleapis):', imageUrl)
                
                // デバイス判定（簡易版）
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                if (isMobile) {
                    console.log('📱 モバイルデバイス検出、cloud.google.com形式を使用')
                    return cloudUrl
                } else {
                    console.log('💻 PCデバイス検出、googleapis.com形式を使用')
                    return imageUrl
                }
            }
            return imageUrl
        }
        
        // バックエンドからGCSの公開URLが返されるため、file_pathをそのまま使用
        console.log('📁 Using file_path:', uploadedImage.file_path)
        return uploadedImage.file_path
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
                    <div className="w-full">
                        <StoryBookCard width="full">
                            <div className="w-full h-full flex flex-col items-center justify-start">
                                {/* アップロード画像の表示 */}
                                {(() => {
                                    const imageUrl = convertUploadedImageUrl(storybook.uploaded_image)
                                    console.log('🖼️ Image URL for display:', imageUrl)
                                    return storybook.uploaded_image && imageUrl
                                })() && (
                                    <div className="mb-4 w-full">
                                        <div className="text-center mb-2">
                                            <span className="text-sm text-white/80 bg-white/20 px-3 py-1 rounded-full">
                                                アップロードした画像
                                            </span>
                                        </div>

                                        {/* Next.js Imageコンポーネントを使用 */}
                                        <div className="relative w-full overflow-hidden rounded-xl shadow-lg" style={{ aspectRatio: '16/9' }}>
                                            <Image
                                                src={convertUploadedImageUrl(storybook.uploaded_image)!}
                                                alt="アップロードした画像"
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                                priority={true}
                                                onError={(e) => {
                                                    const currentUrl = e.currentTarget.src;
                                                    console.error('アップロード画像読み込みエラー:', currentUrl);
                                                    
                                                    // フォールバック: 元のURL形式を試す
                                                    if (currentUrl.includes('storage.cloud.google.com')) {
                                                        const fallbackUrl = currentUrl.replace('https://storage.cloud.google.com/', 'https://storage.googleapis.com/');
                                                        console.log('🔄 フォールバックURLを試行:', fallbackUrl);
                                                        e.currentTarget.src = fallbackUrl;
                                                    } else if (currentUrl.includes('storage.googleapis.com')) {
                                                        const fallbackUrl = currentUrl.replace('https://storage.googleapis.com/', 'https://storage.cloud.google.com/');
                                                        console.log('🔄 フォールバックURLを試行:', fallbackUrl);
                                                        e.currentTarget.src = fallbackUrl;
                                                    } else {
                                                        console.error('❌ すべてのURL形式で失敗、画像を非表示');
                                                        e.currentTarget.style.display = 'none';
                                                    }
                                                }}
                                                onLoad={(e) => {
                                                    console.log('✅ アップロード画像読み込み成功:', e.currentTarget.src);
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* 現在のページの画像表示 */}
                                {currentPageData?.image && (
                                    <div className="mb-4 w-full">
                                        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                                            <Image 
                                                src={currentPageData.image!} 
                                                alt={`${currentPage}ページ目の画像`}
                                                fill
                                                className="object-fill rounded-xl shadow-lg"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                                priority={currentPage === 1}
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