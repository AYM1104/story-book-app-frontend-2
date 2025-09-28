"use client"
import BackgroundStars from '../../components/BackgroundStars'
import Header from "@/components/Header"
import Character from "@/components/Character/Character"
import Button from '@/components/Button/Button';
import Card from "@/components/Card/Card";
import HeadingText from "@/components/HeadingText/HeadingText";
import { useRouter } from "next/navigation";
import { useRef } from 'react';
import useImageUpload from '@/hooks/useImageUpload';

export default function Page() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 画像アップロードフック
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

  return (
    <BackgroundStars>
      <Header />

      {/* 見出し */}
      <div className="flex justify-center text-center mt-2 md:mt-8 lg:mt-1">
        <div className="relative z-10">
          <HeadingText>
            どんな え でえほんを
            <br className="md:hidden" />
            つくろうかな？
          </HeadingText>
        </div>
      </div>

      {/* ボタン */}
      <div className="flex justify-center">
        <div className="relative z-10">
          <Button onClick={handleClickUpload}>        
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
      </div>

      {/* カード */}
      <div className="flex justify-center">
        <Card>
        {publicImageUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <img
                src={publicImageUrl}
                alt="uploaded"
                style={{ maxWidth: '100%', maxHeight: '220px', objectFit: 'contain' }}
              />
              <Button className="relative mt-10 z-10" onClick={handleConfirmImage}>
                この画像にけってい
              </Button>
            </div>
          ) : (
            'アップロードされた画像'
          )}
        </Card>
      </div>  

      {/* キャラクター */}
      <Character bottomAligned={true} useContainerStyle={true} />
    </BackgroundStars>
  )
}
    