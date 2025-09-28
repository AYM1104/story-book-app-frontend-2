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
      const qres = await fetch(`http://localhost:8000/story/story_settings/${id}/questions`)
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

      // 最後の設問: ここでまとめて送信
      setIsSubmitting(true)
      const entries = Object.entries(merged).filter(([, value]) => value !== '')
      for (const [field, answer] of entries) {
        const res = await fetch(`http://localhost:8000/story/story_settings/${storySettingId}/answers`, {
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
      {
        const genRes = await fetch('http://localhost:8000/story/story_generator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story_setting_id: storySettingId })
        })
        if (!genRes.ok) {
          const msg = await genRes.text()
          throw new Error(msg || 'Failed to trigger story generation')
        }
        // 必要ならレスポンスを利用
        // const genData = await genRes.json()
      }
      setIsCompleted(true)
      alert('ぜんぶのこたえをおくりました！')
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
      {storySettingData && (
        <div className="flex justify-center mb-4">
          <div className="bg-white/80 rounded-lg p-4 max-w-md">
            <h3 className="text-lg font-bold text-center mb-3">📖 物語の設定</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">主人公:</span>
                <span className="flex items-center gap-1">
                  {storySettingData.protagonist_type === '男の子' && '👦'}
                  {storySettingData.protagonist_type === '女の子' && '👧'}
                  {storySettingData.protagonist_type === '子供' && '👶'}
                  {storySettingData.protagonist_type === '動物' && '🐾'}
                  {storySettingData.protagonist_type === 'ロボット' && '🤖'}
                  {storySettingData.protagonist_type || '子供'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">名前:</span>
                <span>{storySettingData.protagonist_name || '主人公'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">舞台:</span>
                <span>{storySettingData.setting_place || '公園'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* ボタン　※余白用に配置 */}
      <div className="flex justify-center opacity-0">
        <div className="relative z-10">
          <Button>        
            余白用のボタン
          </Button>
        </div>
      </div>

      {/* カード */}
      <div className="flex justify-center">
        <Card>
        しつもん
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
        </Card>
            
      </div>

      {/* キャラクター */}
      <Character bottomAligned={true} useContainerStyle={true} />
      </div>
    </BackgroundStars>
  )
}
    