"use client"
import React from 'react'
import BackgroundStars from '../components/BackgroundStars'
import Card from '../components/Card/Card'

export default function Page() {
  return (
    <BackgroundStars>
    <main className="page">
      <h1>レスポンシブテスト</h1>
      <p className="desc">
        ウィンドウ幅を変えてカードの列数と配置の変化を
        <br className="mobileBreak" />
        確認してください。
      </p>

      <section className="grid">
        <article className="card">カード 1</article>
        <article className="card">カード 2</article>
        <article className="card">カード 3</article>
        <article className="card">カード 4</article>
        <article className="card">カード 5</article>
        <article className="card">カード 6</article>
      </section>

      <section className="layoutTest">
        <aside className="sidebar">サイドバー</aside>
        <div className="content">コンテンツ領域（幅が狭い時は縦並び、広い時は横並び）</div>
      </section>

      <style jsx>{`
        .page { padding: 24px; }
        h1 { font-size: 24px; margin: 0 0 8px; }
        .desc { color: #666; margin: 0 0 24px; }
        .mobileBreak { display: none; }
        @media (max-width: 599px) {
          .desc { text-align: center; }
          .mobileBreak { display: inline; }
        }

        /* カードのグリッド（幅によって列数が 1 → 2 → 3 に変化） */
        .grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 600px) { .grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 900px) { .grid { grid-template-columns: repeat(3, 1fr); } }

        .card {
          background: #f5f5f5;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 16px;
        }

        /* レイアウト検証：縦並び→横並び */
        .layoutTest { display: flex; flex-direction: column; gap: 12px; margin-top: 24px; }
        .sidebar { background: #eef6ff; border: 1px solid #cfe3ff; border-radius: 8px; padding: 12px; }
        .content { background: #fff7e6; border: 1px solid #ffe0b2; border-radius: 8px; padding: 12px; }
        @media (min-width: 800px) {
          .layoutTest { flex-direction: row; }
          .sidebar { width: 240px; flex: 0 0 auto; }
          .content { flex: 1 1 auto; }
        }
      `}</style>
    </main>
    <Card>
      <h1>カード</h1>
    </Card>
    </BackgroundStars>
  )
}
