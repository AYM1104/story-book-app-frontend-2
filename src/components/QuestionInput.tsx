"use client"
import React from 'react'

// 日本語コメント: 質問の種類に応じて入力UIを出し分けるプレゼンテーショナルコンポーネント

export type QuestionOption = {
  value: string
  label: string
}

export type QuestionDefinition = {
  field: string
  question: string
  type: string
  placeholder?: string
  required?: boolean
  options?: Array<QuestionOption>
}

type Props = {
  question: QuestionDefinition | undefined
  value: string
  onChange: (value: string) => void
}

export default function QuestionInput({ question, value, onChange }: Props) {
  // ガード: 質問が未取得の場合のプレースホルダ
  if (!question) {
    return <div className="text-center">しつもんをよみこみちゅう...</div>
  }

  return (
    <div className="p-3">
      <div className="mb-12 font-medium text-[#362D30]">{question.question}</div>
      {question.type === 'text_input' && (
        <input
          type="text"
          placeholder={question.placeholder ?? ''}
          className="w-full border rounded px-2 py-1 text-[#362D30]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {question.type === "select" && (
        <select
          className="w-full border rounded px-2 py-1 text-[#362D30]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">えらんでください</option>
          {(question.options ?? []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}


