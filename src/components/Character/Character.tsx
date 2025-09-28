"use client";

type Props = {
  // 親から配置・余白などのクラスを渡す（Tailwind可）
  className?: string;       // imgに直接付ける場合はこちらを使用
  // 画面下部基準の配置を有効にするかどうか
  bottomAligned?: boolean;
  // コンテナスタイルを適用するかどうか（test_characterページ用）
  useContainerStyle?: boolean;
};

// 端末共通のキャラクター画像を表示（親側でサイズ・配置を制御）
export default function Character({ className, bottomAligned = false, useContainerStyle = false }: Props) {

  // キャラクターのサイズ
  const baseClasses = 
    "w-[380px] xs:w-[400px] sm:w-[430px] md:w-[600px] lg:w-[750px] xl:w-[350px] max-w-none h-auto select-none pointer-events-none";
  
  // 画面下部基準の配置クラス
  const bottomAlignmentClasses = bottomAligned 
    ? "fixed left-1/2 bottom-0 xl:bottom-10 transform -translate-x-1/2 pb-2 z-0" 
    : "";

  // コンテナスタイル（test_character.module.cssの内容をTailwindに変換）
  const containerClasses = useContainerStyle
    ? "min-h-screen flex items-center justify-center pb-48 md:pb-0 max-md:pb-40"
    : "";
  
  if (useContainerStyle) {
    return (
      <div className={containerClasses}>
        <img
          src="/charactor/charactor-smartphone.svg"
          alt="character"
          className={`${baseClasses} ${bottomAlignmentClasses} ${className ?? ""}`}
        />
      </div>
    );
  }
  
  return (
    <img
      src="/charactor/charactor-smartphone.svg"
      alt="character"
      className={`${baseClasses} ${bottomAlignmentClasses} ${className ?? ""}`}
    />
  );
}

// className の意味（カスタムTailwind CSS）
// w-[400px]: デフォルト幅400px（400px未満）
// xs:w-[500px]: 画面幅400px以上で500px（iPhone 16 Pro等）
// sm:w-[600px]: 画面幅768px以上で600px（iPad mini等）
// md:w-[700px]: 画面幅1024px以上で700px（iPad等）
// lg:w-[800px]: 画面幅1280px以上で800px（PC等）
// xl:w-[900px]: 画面幅1536px以上で900px（20インチ画面以上等）


// max-w-none: 画像の最大幅制限を解除（親のmax-width: 100%などの影響を受けず、指定幅を優先）
// h-auto: 縦横比を保って高さを自動計算（幅に合わせて高さが決まる）
// select-none: 画像をテキスト選択できないようにする（ドラッグ選択の防止）
// pointer-events-none: クリックなどのポインタイベントを無効化（画像を押しても反応しない。装飾用途向け）
// ポイント
// 画面サイズに応じて段階的にサイズが変わるレスポンシブ対応
// 小さなスマホから大きなデスクトップまで適切なサイズで表示
// 画像をUIとして扱わず飾りに徹するためにselect-noneとpointer-events-noneを付与。