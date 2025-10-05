"use client"
import { useState, useCallback } from 'react'

interface ImageGenerationProgress {
  current: number
  total: number
  isGenerating: boolean
  currentImageDetails?: {
    pageNumber?: number
    prompt?: string
    status: 'generating' | 'completed' | 'failed'
  }
  errors: Array<{
    pageNumber: number
    error: string
  }>
}

interface UseImageGenerationProgressReturn {
  progress: ImageGenerationProgress
  startGeneration: (totalImages: number) => void
  updateProgress: (current: number, details?: ImageGenerationProgress['currentImageDetails']) => void
  setImageCompleted: (pageNumber: number) => void
  setImageFailed: (pageNumber: number, error: string) => void
  setImageGenerating: (pageNumber: number, prompt?: string) => void
  finishGeneration: () => void
  resetProgress: () => void
}

export default function useImageGenerationProgress(): UseImageGenerationProgressReturn {
  const [progress, setProgress] = useState<ImageGenerationProgress>({
    current: 0,
    total: 0,
    isGenerating: false,
    currentImageDetails: undefined,
    errors: []
  })

  const startGeneration = useCallback((totalImages: number) => {
    setProgress({
      current: 0,
      total: totalImages,
      isGenerating: true,
      currentImageDetails: undefined,
      errors: []
    })
  }, [])

  const updateProgress = useCallback((
    current: number, 
    details?: ImageGenerationProgress['currentImageDetails']
  ) => {
    setProgress(prev => ({
      ...prev,
      current,
      currentImageDetails: details
    }))
  }, [])

  const setImageGenerating = useCallback((pageNumber: number, prompt?: string) => {
    setProgress(prev => ({
      ...prev,
      currentImageDetails: {
        pageNumber,
        prompt,
        status: 'generating'
      }
    }))
  }, [])

  const setImageCompleted = useCallback((pageNumber: number) => {
    setProgress(prev => ({
      ...prev,
      current: prev.current + 1,
      currentImageDetails: {
        pageNumber,
        status: 'completed'
      }
    }))
  }, [])

  const setImageFailed = useCallback((pageNumber: number, error: string) => {
    setProgress(prev => ({
      ...prev,
      current: prev.current + 1,
      currentImageDetails: {
        pageNumber,
        status: 'failed'
      },
      errors: [...prev.errors, { pageNumber, error }]
    }))
  }, [])

  const finishGeneration = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      isGenerating: false,
      currentImageDetails: undefined
    }))
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({
      current: 0,
      total: 0,
      isGenerating: false,
      currentImageDetails: undefined,
      errors: []
    })
  }, [])

  return {
    progress,
    startGeneration,
    updateProgress,
    setImageCompleted,
    setImageFailed,
    setImageGenerating,
    finishGeneration,
    resetProgress
  }
}
