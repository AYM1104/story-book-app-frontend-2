import { Yusei_Magic } from "next/font/google";
import "./globals.css";

const yuseiMagic = Yusei_Magic({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={yuseiMagic.className}>{children}</body>
    </html>
  );
}
