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
    
    // GCSの公開URLが返されている場合はそのまま使用
    if (uploadedImagePath.startsWith('http')) {
      return uploadedImagePath
    }
    
    // ローカルファイルの場合は従来の処理
    // バックエンドのパスからファイル名を抽出してフロントエンド用URLに変換
    const parts = uploadedImagePath.replace(/\\/g, '/').split('/')
    const filename = parts[parts.length - 1]
    
    // 現在のバックエンドサーバーのアドレスとポートを使用
    const baseUrl = 'http://localhost:8000'
    return `${baseUrl}/uploads/${filename}`
  }, [uploadedImagePath])

  // ファイル選択後にアップロード実行
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // ユーザーIDを固定値1に設定
    const savedUserId = '1'

    const formData = new FormData()
    formData.append('file', file)
    formData.append('user_id', savedUserId)

    setIsUploading(true)
    try {
      console.log('アップロイドを開始...', file.name)
      
      const res = await fetch('http://localhost:8000/images/upload', {
        method: 'POST',
        body: formData,
      })
      
      console.log('レスポンスステータス:', res.status)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('アップロードエラー:', errorText)
        throw new Error(`Upload failed: ${res.status} - ${errorText}`)
      }
      
      const data = await res.json()
      console.log('アップロード成功:', data)
      
      // public_urlを優先、なければfile_pathを使用
      const imagePath = data?.public_url ?? data?.file_path ?? null
      console.log('public_url:', data?.public_url)
      console.log('file_path:', data?.file_path)
      console.log('選択された画像パス:', imagePath)
      
      setUploadedImagePath(imagePath)
      try {
        if (imagePath) {
          localStorage.setItem('uploaded_image_path', imagePath)
        }
        if (typeof data?.id === 'number') {
          localStorage.setItem('uploaded_image_id', String(data.id))
        }
      } catch (storageError) {
        console.warn('ローカルストレージ保存失敗:', storageError)
      }
      setUploadedImageId(typeof data?.id === 'number' ? data.id : null)
      e.target.value = ''
    } catch (err) {
      console.error('アップロードエラー:', err)
      // エラーの詳細を表示
      alert(`画像のアップロードに失敗しました: ${err.message || err}`)
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
      
      // 物語設定の詳細情報をローカルストレージに保存
      if (result.generated_data) {
        localStorage.setItem('story_setting_data', JSON.stringify(result.generated_data))
        localStorage.setItem('story_setting_id', String(result.story_setting_id))
      }
      
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


