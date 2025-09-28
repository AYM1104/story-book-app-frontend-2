"use client";
import React from 'react';
import QuestionInput from '../QuestionInput';
import Button from '../Button/Button';
import ProgressDots from '../ProgressDots';

interface Question {
  field: string;
  question: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

interface InnerCardProps {
  questions: Question[];
  currentIndex: number;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onPrev: () => void;
  onNext: () => void;
  isSubmitting: boolean;
  isCompleted: boolean;
}

/**
 * 質問表示用のインナーカードコンポーネント
 * 質問入力とナビゲーション機能を提供
 */
export default function InnerCard({
  questions,
  currentIndex,
  currentAnswer,
  onAnswerChange,
  onPrev,
  onNext,
  isSubmitting,
  isCompleted
}: InnerCardProps) {
  return (
    <div 
      className="w-full h-full p-4 xs:p-5 sm:p-6 md:p-7 lg:p-8 rounded-2xl" 
      style={{ background: "rgba(255, 255, 255, 0.5)" }}
    >
      {questions.length === 0 ? (
        <div className="text-center text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          しつもんをよみこみちゅう...
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          <div className="mt-2 xs:mt-3 sm:mt-4 md:mt-5 lg:mt-6">
            <QuestionInput
              question={questions[currentIndex]}
              value={currentAnswer}
              onChange={onAnswerChange}
            />
          </div>

          {/* ナビゲーションも内側Cardに配置 */}
          <div className="mt-3 xs:mt-4 sm:mt-5 md:mt-6 lg:mt-7 flex flex-col xs:flex-row items-center justify-between gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <Button width={100} onClick={onPrev}>まえへ</Button>
            <ProgressDots total={questions.length} currentIndex={currentIndex} />
            <Button width={100} onClick={onNext} disabled={isSubmitting || isCompleted}>
              {isSubmitting ? 'ほぞん中...' : (currentIndex === questions.length - 1 ? 'おわり' : 'つぎへ')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}