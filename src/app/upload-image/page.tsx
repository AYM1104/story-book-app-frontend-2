"use client"
import { useRef } from 'react'
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character"
import Button from "@/components/button/Button";
import Card from "@/components/Card/Card";
import styles from './UploadImage.module.css';
import useImageUpload from '@/hooks/useImageUpload'

export default function Page() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const {
    isUploading,
    publicImageUrl,
    handleFileChange,
    handleConfirmImage,
  } = useImageUpload()

  // 画像選択ダイアログを開く
  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  // アップロード後の確定はフック内のハンドラを使用

  return (
    <BackgroundStars>
      <Header />

      {/* 見出し */}
      <div className="flex justify-center text-center">
        <p className={`${styles.desc} relative z-10`}>
          どの え でえほんを
          <br className={styles.mobileBreak} />
          つくろうかな？
        </p>
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <Button width={280} className="relative -mt-2 z-10" onClick={handleClickUpload}>
          {isUploading ? 'アップロード中...' : '画像をアップロード'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* カード */}
      <div className="flex justify-center">
        <Card height="400px" offsetY={70}>
          {publicImageUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <img
                src={publicImageUrl}
                alt="uploaded"
                style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }}
              />
              <Button width={180} className="relative mt-10 z-10" onClick={handleConfirmImage}>
                この画像にけってい
              </Button>
            </div>
          ) : (
            'アップロードされた画像'
          )}
        </Card>
      </div>

      {/* キャラクター */}
      <div className="min-h-screen flex items-center justify-center pb-48 md:pb-56">
        <Character className="fixed left-1/2 bottom-0 -translate-x-1/2 pb-8 z-0" />
      </div>

    </BackgroundStars>
  )
}
    