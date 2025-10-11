"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character/Character"
import Card from "@/components/Card/Card";
import InnerCard from "@/components/Card/InnerCard";
import HeadingText from "@/components/HeadingText/HeadingText";
import Button from "@/components/Button/Button";
import ProgressDots from "@/components/ProgressDots";
import ImageGenerationAnimation from "@/components/ImageGenerationAnimation";
import WalkingCharacters from "@/components/Animation/WalkingCharacters";

// バックエンドAPIのベースURL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function Page() {
  const router = useRouter()
  const [storySettingId, setStorySettingId] = useState<number | null>(null)
  const [storySettingData, setStorySettingData] = useState<{
    protagonist_type?: string
    protagonist_name?: string
    setting_place?: string
    title_suggestion?: string
  } | null>(null)
  const [questions, setQuestions] = useState<Array<{
    field: string
    question: string
    type: string
    placeholder?: string
    required?: boolean
    options?: Array<{ value: string; label: string }>
  }>>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentAnswer, setCurrentAnswer] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
  // 処理中アニメーション用の状態
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingCurrent, setProcessingCurrent] = useState(0)
  const [processingTotal, setProcessingTotal] = useState(3)
  const [processingMessage, setProcessingMessage] = useState("回答を送信中...")

  // ローカルストレージから物語設定データを読み込み
  useEffect(() => {
    try {
      const savedStorySettingId = localStorage.getItem('story_setting_id')
      const savedStorySettingData = localStorage.getItem('story_setting_data')
      
      if (savedStorySettingId && savedStorySettingData) {
        const storySettingId = parseInt(savedStorySettingId)
        const storySettingData = JSON.parse(savedStorySettingData)
        setStorySettingId(storySettingId)
        setStorySettingData(storySettingData)
        
        // 質問を取得
        fetchQuestions(storySettingId)
      } else {
        // データが見つからない場合はエラー表示
        console.error('物語設定データが見つかりません。画像アップロードからやり直してください。')
        alert('物語設定データが見つかりません。画像アップロードからやり直してください。')
      }
    } catch (err) {
      console.error('ローカルストレージ読み込みエラー:', err)
      alert('データの読み込みに失敗しました。画像アップロードからやり直してください。')
    }
  }, [])

  const fetchQuestions = async (id: number) => {
    try {
      const qres = await fetch(`${API_BASE_URL}/story/story_settings/${id}/questions`)
      if (!qres.ok) {
        const msg = await qres.text()
        throw new Error(msg || 'Fetch questions failed')
      }
      const qdata = await qres.json()
      setStorySettingId(id)
      setQuestions(Array.isArray(qdata?.questions) ? qdata.questions : [])
    } catch (err) {
      console.error(err)
    }
  }

  // 質問が更新されたらインデックスを先頭に戻す
  useEffect(() => {
    setCurrentIndex(0)
  }, [questions])

  // 表示中の質問が変わったら、保存済み回答を入力欄に反映
  useEffect(() => {
    const field = questions[currentIndex]?.field
    if (field) {
      setCurrentAnswer(answers[field] ?? '')
    } else {
      setCurrentAnswer('')
    }
  }, [currentIndex, questions, answers])

  const handlePrev = () => {
    setCurrentIndex(i => Math.max(0, i - 1))
  }

  // フリックスワイプの処理
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < questions.length - 1) {
      // 左スワイプ（次の質問へ）
      handleNext()
    } else if (isRightSwipe && currentIndex > 0) {
      // 右スワイプ（前の質問へ）
      handlePrev()
    }
  }

  const handleNext = async () => {
    if (!storySettingId) return
    const q = questions[currentIndex]
    if (!q) return

    // 必須で未入力はブロック
    if (q.required && !currentAnswer) {
      alert('このしつもんにはこたえてね')
      return
    }

    try {
      const isLast = currentIndex === questions.length - 1
      // まずローカルに保存
      const merged = { ...answers, [q.field]: currentAnswer }
      setAnswers(merged)

      if (!isLast) {
        // 次の設問へ（送信はしない）
        setCurrentIndex(i => Math.min(questions.length - 1, i + 1))
        return
      }

      // 最後の設問: 確認画面を表示
      setShowConfirmation(true)
      return
    } catch (err) {
      console.error('質問処理エラー:', err)
      alert('エラーが発生しました。もう一度お試しください。')
    }
  }

  // 回答を送信する関数
  const submitAnswers = async () => {
    if (!storySettingId) return
    
    setIsSubmitting(true)
    try {
      const entries = Object.entries(answers).filter(([, value]) => value !== '')
      for (const [field, answer] of entries) {
        const res = await fetch(`${API_BASE_URL}/story/story_settings/${storySettingId}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ field, answer })
        })
        if (!res.ok) {
          const msg = await res.text()
          throw new Error(msg || `Submit answer failed: ${field}`)
        }
      }

      // 回答保存がすべて成功したら、ストーリー生成を起動
      const genRes = await fetch(`${API_BASE_URL}/story/story_generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_setting_id: storySettingId })
      })
      if (!genRes.ok) {
        const msg = await genRes.text()
        throw new Error(msg || 'Failed to trigger story generation')
      }
      
      setIsCompleted(true)
      // 送信完了後にテーマ選択ページへ遷移
      router.push('/story-theme')
    } catch (e) {
      console.error(e)
      alert('こたえの保存にしっぱいしました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BackgroundStars>
      <div className="min-h-screen flex flex-col safe-area-inset-all">
        <Header />

      {/* 見出し */}
      <div className="flex justify-center text-center mt-2 md:mt-8 lg:mt-1">
        <div className="relative z-10">
          <HeadingText>
            どんな えほん にしようかな？
            <br className="md:hidden" />
            おしえてね！
          </HeadingText>
        </div>
      </div>

      {/* 物語設定情報 */}
      {false && storySettingData && (
        <div className="flex justify-center mb-4">
          <div className="bg-white/80 rounded-lg p-4 max-w-md relative z-20">
            <h3 className="text-lg font-bold text-center mb-3">📖 物語の設定</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">主人公:</span>
                <span className="flex items-center gap-1">
                  {storySettingData?.protagonist_type === '男の子' && '👦'}
                  {storySettingData?.protagonist_type === '女の子' && '👧'}
                  {storySettingData?.protagonist_type === '子供' && '👶'}
                  {storySettingData?.protagonist_type === '動物' && '🐾'}
                  {storySettingData?.protagonist_type === 'ロボット' && '🤖'}
                  {storySettingData?.protagonist_type || '子供'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">名前:</span>
                <span>{storySettingData?.protagonist_name || '主人公'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">舞台:</span>
                <span>{storySettingData?.setting_place || '公園'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ボタン　※余白用に配置 */}
      <div className="flex justify-center invisible">
        <div className="relative z-10">
          <Button className="!opacity-0 !animate-none">        
            余白用のボタン
          </Button>
        </div>
      </div>

      {/* カード */}
      <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] left-0 right-0 flex justify-center px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 z-50">
        <Card>
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="w-full h-full"
          >
            {showConfirmation ? (
              <div className="w-full h-full p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 rounded-2xl flex flex-col justify-center items-center" style={{ background: "rgba(255, 255, 255, 0.5)" }}>
                <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#362D30] mb-8 text-center">
                  こたえを おくる？
                </h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="px-6 py-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    もどる
                  </button>
                  <button
                    onClick={submitAnswers}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#FFC31C] text-[#362D30] rounded-lg hover:bg-[#E6B019] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'おくりちゅう...' : 'おくる'}
                  </button>
                </div>
              </div>
            ) : (
              <InnerCard
                questions={questions}
                currentIndex={currentIndex}
                currentAnswer={currentAnswer}
                onAnswerChange={setCurrentAnswer}
                onPrev={handlePrev}
                onNext={handleNext}
                isSubmitting={isSubmitting}
                isCompleted={isCompleted}
              />
            )}
          </div>
          
          {/* 外側カード内に配置されたナビゲーションボタン - 垂直中央揃え */}
          <div className="absolute top-1/2 left-2 right-2 transform -translate-y-1/2 flex items-center justify-between z-20">
            {/* まえへボタン - 左端近くに配置 */}
            <button
              onClick={handlePrev}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFC31C',
                color: '#362D30',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E6B019';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFC31C';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            
            {/* 中央のプログレスドットを削除 */}
            
            {/* つぎへボタン - 右端近くに配置 */}
            <button
              onClick={handleNext}
              disabled={isSubmitting || isCompleted}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: isSubmitting || isCompleted ? '#FFC31C80' : '#FFC31C',
                color: '#362D30',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isSubmitting || isCompleted ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                opacity: isSubmitting || isCompleted ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !isCompleted) {
                  e.currentTarget.style.backgroundColor = '#E6B019';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && !isCompleted) {
                  e.currentTarget.style.backgroundColor = '#FFC31C';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseDown={(e) => {
                if (!isSubmitting && !isCompleted) {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }
              }}
              onMouseUp={(e) => {
                if (!isSubmitting && !isCompleted) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
              </svg>
            </button>
          </div>
          
          {/* カード下部にプログレスドット */}
          {!showConfirmation && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <ProgressDots total={questions.length} currentIndex={currentIndex} />
            </div>
          )}
        </Card>
            
      </div>

      {/* キャラクター */}
      <Character bottomAligned={true} useContainerStyle={true} />

      {/* 送信中オーバーレイ: 全画面に半透明背景 + SVGアニメーション */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-full max-w-[100vw] flex flex-col items-center gap-6 px-4">
              <WalkingCharacters loop={false} speedSeconds={30} enableClickPause={false} />
              <div className="text-white text-xl md:text-2xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                そうしんちゅう・・・
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </BackgroundStars>
  )
}
    