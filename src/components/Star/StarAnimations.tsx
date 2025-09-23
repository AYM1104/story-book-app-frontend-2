// 星空アニメーション用のCSS定義コンポーネント
// ---------------------------------------------
// StarField.tsx などで参照するアニメーション（twinkle, floatY, shimmer）を
// <style jsx global> でグローバルに定義する。
// また、MUIのUIエフェクトやページ全体の挙動もここにまとめている。
export default function StarAnimations() {
    return (
      <style jsx global>{`
        /* 星の点滅アニメーション */
        @keyframes twinkle {
          0%   { opacity: 0.45; transform: translateY(0) scale(0.95); } // 少し暗く小さめ
          100% { opacity: 1.0;  transform: translateY(0) scale(1.05); } // 明るく大きめ
        }
  
        /* 星が上下にふわふわ揺れるアニメーション */
        @keyframes floatY {
          0%   { transform: translateY(-2px); }
          50%  { transform: translateY(2px); }
          100% { transform: translateY(-2px); }
        }
  
        /* ガラスUI（Paperなど）に使う光のきらめき */
        @keyframes shimmer {
          0%   { transform: translateX(-100%) translateY(-100%) rotate(30deg); opacity: 0; }
          50%  { opacity: 1; } // 真ん中で最も光る
          100% { transform: translateX(100%) translateY(100%) rotate(30deg); opacity: 0; }
        }
  
        /* 近景の星だけ光がにじむ効果を付与 */
        .drop-shadow {
          filter: drop-shadow(0 0 4px rgba(255,255,255,0.35));
        }
        
        /* MUIコンポーネントにガラス風のトランジションを効かせる */
        .MuiPaper-root, .MuiTextField-root, .MuiButton-root {
          will-change: transform, backdrop-filter, box-shadow;
        }
        
        /* ページ全体をスムーズスクロールにする */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    );
  }
  