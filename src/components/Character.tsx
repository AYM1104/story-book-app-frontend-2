"use client";

type Props = {
  // 親から配置・余白などのクラスを渡す（Tailwind可）
  className?: string;       // imgに直接付ける場合はこちらを使用
  // 必要ならラッパーdivに付けたい場合は、下のようにwrapperClassNameを用意してdivで囲む案も可
  // wrapperClassName?: string;
};

// 端末共通のキャラクター画像を表示（親側でサイズ・配置を制御）
export default function Character({ className }: Props) {
  return (
    <img
      src="/charactor/charactor-smartphone.svg"
      alt="character"
      className={
        `w-[550px] sm:w-[500px] max-w-none h-auto select-none pointer-events-none ` +
        (className ?? "")
      }
    />
  );
}

// className の意味（Tailwind CSS）
// w-[500px]: 幅を500pxに固定（デフォルトの画面幅で適用）
// sm:w-[400px]: 画面幅がsm以上のとき、幅を400pxに変更
// （Tailwindのレスポンシブ。smは一般に640px以上）
// つまり「通常500px、少し広い画面からは400px」に切り替え
// max-w-none: 画像の最大幅制限を解除（親のmax-width: 100%などの影響を受けず、指定幅を優先）
// h-auto: 縦横比を保って高さを自動計算（幅に合わせて高さが決まる）
// select-none: 画像をテキスト選択できないようにする（ドラッグ選択の防止）
// pointer-events-none: クリックなどのポインタイベントを無効化（画像を押しても反応しない。装飾用途向け）
// ポイント
// 幅はクラスで決め、高さはh-autoで比率維持。
// max-w-noneがないと、親のスタイルで縮まることがあり、意図通りの大きさにならない場合がある。
// 画像をUIとして扱わず飾りに徹するためにselect-noneとpointer-events-noneを付与。