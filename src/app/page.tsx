"use client"
import React, { useState } from 'react'
import BackgroundStars from '../components/BackgroundStars'
import { UploadImageResponse } from '../services/imageUploadService'
import WalkingCharacters from '@/components/Animation/WalkingCharacters'

export default function Page() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showTestOverlay, setShowTestOverlay] = useState(false); // テスト用オーバーレイ表示フラグ

  // アップロード成功時の処理
  const handleUploadSuccess = (result: UploadImageResponse) => {
    console.log('アップロード成功:', result);
    // ギャラリーを更新
    setRefreshTrigger(prev => prev + 1);
  };

  // アップロードエラー時の処理
  const handleUploadError = (error: string) => {
    console.error('アップロードエラー:', error);
    alert(`アップロードエラー: ${error}`);
  };

  return (
    <BackgroundStars>
      <main className="page">
        <div className="header">
          <h1>てすと</h1>
          <p className="description">
            GCPに画像をアップロードして、アップロードされた画像を表示します
          </p>
          {/* テスト用ボタン */}
          <button 
            onClick={() => setShowTestOverlay(!showTestOverlay)}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: showTestOverlay ? '#dc3545' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {showTestOverlay ? 'オーバーレイを閉じる' : 'アニメーションオーバーレイをテスト'}
          </button>
        </div>

        {/* @animation/ のSVGアニメーション */}
        <section className="character-section">
          <WalkingCharacters />
        </section>

        <style jsx>{`
          .page { 
            padding: 24px; 
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .header {
            text-align: center;
            margin-bottom: 32px;
          }
          
          .header h1 { 
            font-size: 32px; 
            margin: 0 0 8px; 
            color: #333;
          }
          
          .description { 
            color: #666; 
            margin: 0; 
            font-size: 16px;
          }

          .upload-section {
            margin-bottom: 32px;
          }

          .gallery-section {
            margin-bottom: 32px;
          }

          .character-section {
            margin: 40px 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 200px;
            overflow: hidden;
          }

          /* セクションだけ既存の余白・レスポンシブは維持 */

          .card-content {
            padding: 24px;
          }

          .card-content h2 {
            margin: 0 0 24px 0;
            color: #333;
            font-size: 24px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 8px;
          }

          @media (max-width: 768px) {
            .page {
              padding: 16px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .description {
              font-size: 14px;
            }
            
            .character-section {
              margin: 20px 0;
              min-height: 150px;
            }

            
            
            .card-content {
              padding: 16px;
            }
            
            .card-content h2 {
              font-size: 20px;
            }
          }
        `}</style>
      </main>

      {/* テスト用: 画像生成中オーバーレイ */}
      {showTestOverlay && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }} />
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            padding: '0 16px',
            maxWidth: '100vw',
            width: '100%'
          }}>
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <WalkingCharacters loop={false} speedSeconds={30} enableClickPause={false} />
            </div>
            <div style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)'
            }}>
              テスト中・・・
            </div>
          </div>
        </div>
      )}
    </BackgroundStars>
  )
}
