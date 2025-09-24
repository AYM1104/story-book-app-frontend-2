"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character"
import Card from "@/components/Card/Card";
import Button from "@/components/button/Button";
import styles from './Question.module.css';
import QuestionInput from "@/components/QuestionInput";
import ProgressDots from "@/components/ProgressDots";

export default function Page() {
  const router = useRouter()
  const [storySettingId, setStorySettingId] = useState<number | null>(null)
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

  // テスト用: 画面表示時に固定IDで質問を取得
  useEffect(() => {
    const DEFAULT_STORY_SETTING_ID = 4 // ← テスト用に存在するIDに合わせて変更可
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
    fetchQuestions(DEFAULT_STORY_SETTING_ID)
  }, [])

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
      <Header />

      {/* 見出し */}
      <div className="flex justify-center text-center">
        <p className={`${styles.desc} relative z-10`}>
          どんなえほんにしようかな？
          <br className={styles.mobileBreak} />
          おしえてね！
        </p>
      </div>

      {/* カード */}
      <div className="flex justify-center">
        <Card height="400px" offsetY={70}>
        しつもん
          <Card height="300px" offsetY={30} style={{ background: "rgba(255, 255, 255, 0.5)" }}>
          {questions.length === 0 ? (
            <div className="text-center">しつもんをよみこみちゅう...</div>
          ) : (
            <div className="flex h-full flex-col justify-between">
              <div className="mt-2">
                <QuestionInput
                  question={questions[currentIndex]}
                  value={currentAnswer}
                  onChange={setCurrentAnswer}
                />
              </div>

              {/* ナビゲーションも内側Cardに配置 */}
              <div className="mt-3 flex items-center justify-between">
                <Button width={100} onClick={handlePrev}>まえへ</Button>
                <ProgressDots total={questions.length} currentIndex={currentIndex} />
                <Button width={100} onClick={handleNext} disabled={isSubmitting || isCompleted}>
                  {isSubmitting ? 'ほぞん中...' : (currentIndex === questions.length - 1 ? 'おわり' : 'つぎへ')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </Card>
            
      </div>

      {/* キャラクター */}
      <div className="min-h-screen flex items-center justify-center pb-48 md:pb-56">
        <Character className="fixed left-1/2 bottom-0 -translate-x-1/2 pb-8 z-0" />
      </div>

    </BackgroundStars>
  )
}
    