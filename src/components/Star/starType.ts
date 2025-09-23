// ==============================
// 星空描画用の型定義と基本データ
// ------------------------------
// ・Star型: 星1つの位置・大きさ・動きなどの情報を定義
// ・starImages: 星の画像パス一覧（色違いの星を用意）
// ・BASE_DENSITY: 画面サイズに応じて配置する星の数を決める基準値
// ==============================


// 星の型定義
export type Star = {
    src: string;        // 星の画像ファイル（どの色・形の星か）
    left: number;       // 配置するX座標（px単位）
    top: number;        // 配置するY座標（px単位）
    size: number;       // 星の大きさ（px）
    opacity: number;    // 星の透明度（0～1）
    rotate: number;     // 星の回転角度（°）
    twinkleDur: number; // 点滅（twinkle）にかかる時間（秒）
    twinkleDelay: number; // 点滅の開始タイミング（秒）
    floatDur: number;   // 上下に揺れる（floatY）動きの周期（秒）
  };
  
  // 星のsvgファイルのパス一覧
  export const starImages = [
    "star/star-yellow.svg",
    "star/star-blue.svg",
    "star/star-green.svg",
    "star/star-purple.svg",
    "star/star-red.svg",
    "star/star-white.svg",
  ];
  
  // 画面の広さに対するベース密度（1pxあたりの星数）
  // 例: 1920x1080 ≒ 2,073,600px * 0.0003 ≒ 622個
  export const BASE_DENSITY = 0.0003;