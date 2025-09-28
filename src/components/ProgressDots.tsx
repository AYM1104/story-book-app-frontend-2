"use client"
import React from 'react'

// 日本語コメント: 現在の設問インデックスと全体数からドット表示するコンポーネント

type Props = {
  total: number
  currentIndex: number
}

export default function ProgressDots({ total, currentIndex }: Props) {
  if (total <= 0) return null
  return (
    <div className="flex gap-1 items-center justify-center h-10">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`inline-block h-2 w-2 rounded-full ${i === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
        />)
      )}
    </div>
  )
}


