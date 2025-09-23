// 星データの型（座標・サイズ・回転・アニメーション時間など）
import { starImages, Star, BASE_DENSITY } from "./starType";   

// StarLayer コンポーネントの props 型
interface StarLayerProps {
    stars: Star[];                     // 星の配列（位置・見た目の情報を持つ）
    layerType: "far" | "mid" | "near"; // 星のレイヤー種類（遠景／中景／近景）
}
  
// ----------------------
// 星を配置するレイヤー
// ---------------------
function StarLayer({ stars, layerType }: StarLayerProps) {
    return (
        <>
            {stars.map((s, i) => {
            // レイヤータイプごとにスタイルを切り替える
            const getLayerStyles = () => {
                switch (layerType) {
                
                // 遠景の星
                case "far": 
                    return {
                    opacity: s.opacity * 0.8, // 少し薄めに表示
                    filter: "blur(0.2px)",    // ほんの少しぼかして遠さを演出
                    animation: `
                        twinkle ${s.twinkleDur}s ease-in-out ${s.twinkleDelay}s infinite alternate,  // 点滅
                        floatY ${s.floatDur}s ease-in-out ${s.twinkleDelay / 2}s infinite            // 上下にゆっくり揺れる
                    `,
                    };

                // 中景の星
                case "mid": 
                    return {
                    opacity: s.opacity,       // そのままの明るさ
                    animation: `
                        twinkle ${s.twinkleDur}s ease-in-out ${s.twinkleDelay}s infinite alternate,
                        floatY ${s.floatDur * 0.7}s ease-in-out ${s.twinkleDelay / 3}s infinite
                    `,
                    };
                
                // 近景の星
                case "near": 
                    return {
                    opacity: s.opacity,       // はっきり見える
                    animation: `
                        twinkle ${s.twinkleDur * 0.8}s ease-in-out ${s.twinkleDelay}s infinite alternate,
                        floatY ${s.floatDur * 0.5}s ease-in-out ${s.twinkleDelay / 4}s infinite
                    `,
                    };
                }
            };
  
            // レイヤーごとのスタイルを適用
            const layerStyles = getLayerStyles();
    
            // 星の画像を表示
            return (
                <img
                    key={`${layerType}-${i}`} // React用のユニークキー
                    src={s.src}               // 星の画像（SVGなど）
                    className={`absolute will-change-transform ${
                        layerType === "near" ? "drop-shadow" : "" // 近景だけ光をにじませる
                    }`}
                    style={{
                        left: s.left,           // X座標（px）
                        top: s.top,             // Y座標（px）
                        width: s.size,          // 星の大きさ（px）
                        height: s.size,
                        transform: `translateZ(0) rotate(${s.rotate}deg)`, // 星を回転させる
                        ...layerStyles,         // レイヤーごとのスタイルを適用
                    }}
                    alt=""
                />
            );
            })}
        </>
    );
}
  
  // StarField コンポーネントの props 型
  interface StarFieldProps {
    far: Star[];  // 遠景の星データ
    mid: Star[];  // 中景の星データ
    near: Star[]; // 近景の星データ
  }
  
  // ----------------------
  // 星空全体のコンポーネント
  // ----------------------
  export default function StarField({ far, mid, near }: StarFieldProps) {
    return (
        // 画面いっぱいに広がる星空（クリックなどのイベントは通すため pointer-events-none）
        <div className="pointer-events-none absolute inset-0">
            {/* 遠景：薄くてゆったりした動きの星 */}
            <StarLayer stars={far} layerType="far" />
            
            {/* 中景：標準の明るさと動きの星 */}
            <StarLayer stars={mid} layerType="mid" />
            
            {/* 近景：強く光り、大きめ＆影付きの星 */}
            <StarLayer stars={near} layerType="near" />
        </div>
    );
  }