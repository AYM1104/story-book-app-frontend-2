"use client"
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * 画像アップロードに関するロジックをまとめたカスタムフック
 * - ファイル選択後のアップロード
 * - アップロード結果の公開URL算出
 * - アップロード画像IDを用いた物語設定の作成/更新
 */
export function useImageUpload() {
  // ルーター（成功時に /question へ遷移）
  const router = useRouter()
  // アップロード中フラグ
  const [isUploading, setIsUploading] = useState(false)
  // バックエンドが返す保存パス (サーバ内パス)
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null)
  // 画像レコードID
  const [uploadedImageId, setUploadedImageId] = useState<number | null>(null)

  // 公開用URLへ変換
  const publicImageUrl = useMemo(() => {
    if (!uploadedImagePath) return null
    // バックスラッシュをスラッシュへ統一し、末尾のファイル名から公開URLを組み立て
    const parts = uploadedImagePath.replace(/\\/g, '/').split('/')
    const filename = parts[parts.length - 1]
    return `http://localhost:8000/uploads/${filename}`
  }, [uploadedImagePath])

  // ファイル選択後にアップロード実行
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    // 認証導入後に実ユーザーIDへ置き換え
    formData.append('user_id', String(1))

    setIsUploading(true)
    try {
      const res = await fetch('http://localhost:8000/images/upload', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Upload failed')
      }
      const data = await res.json()
      setUploadedImagePath(data?.file_path ?? null)
      setUploadedImageId(typeof data?.id === 'number' ? data.id : null)
      e.target.value = ''
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }, [])

  // 選択した画像で物語設定を作成/更新
  const handleConfirmImage = useCallback(async () => {
    if (!uploadedImageId) {
      alert('先に画像をアップロードしてください')
      return
    }
    try {
      const res = await fetch(`http://localhost:8000/story/story_settings/${uploadedImageId}`, {
        method: 'POST',
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Create story setting failed')
      }
      const result = await res.json()
      // 物語設定が完了したら question ページへ遷移
      router.push('/question')
    } catch (err) {
      console.error(err)
    }
  }, [uploadedImageId, router])

  return {
    // state
    isUploading,
    uploadedImagePath,
    uploadedImageId,
    publicImageUrl,
    // actions
    handleFileChange,
    handleConfirmImage,
    // setter（必要に応じて外部からも操作可能に）
    setUploadedImagePath,
    setUploadedImageId,
  }
}

export default useImageUpload


