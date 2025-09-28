import React from 'react'
import Card from '../Card/Card'
import QuestionInput from '../QuestionInput'
import Button from '../Button/Button'
import ProgressDots from '../ProgressDots'

interface Question {
  field: string
  question: string
  type: string
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
}

interface InnerCardProps {
  questions: Question[]
  currentIndex: number
  currentAnswer: string
  onAnswerChange: (answer: string) => void
  onPrev: () => void
  onNext: () => void
  isSubmitting: boolean
  isCompleted: boolean
}

/**
 * 質問表示用のインナーカードコンポーネント
 * 質問入力とナビゲーション機能を提供
 */
const InnerCard: React.FC<InnerCardProps> = ({
  questions,
  currentIndex,
  currentAnswer,
  onAnswerChange,
  onPrev,
  onNext,
  isSubmitting,
  isCompleted
}) => {
  return (
    <Card offsetY={300} style={{ background: "rgba(255, 255, 255, 0.5)" }}>
      {questions.length === 0 ? (
        <div className="text-center">しつもんをよみこみちゅう...</div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          <div className="mt-2">
            <QuestionInput
              question={questions[currentIndex]}
              value={currentAnswer}
              onChange={onAnswerChange}
            />
          </div>

          {/* ナビゲーションも内側Cardに配置 */}
          <div className="mt-3 flex items-center justify-between">
            <Button width={100} onClick={onPrev}>まえへ</Button>
            <ProgressDots total={questions.length} currentIndex={currentIndex} />
            <Button width={100} onClick={onNext} disabled={isSubmitting || isCompleted}>
              {isSubmitting ? 'ほぞん中...' : (currentIndex === questions.length - 1 ? 'おわり' : 'つぎへ')}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default InnerCard
