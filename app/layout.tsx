import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://worldcup-prediction-app.vercel.app/");
const SITE_NAME = "W杯優勝予想しようよ";
const SITE_DESCRIPTION =
  "あなたのW杯優勝国予想を画像に！予選グループから国を選択するだけで、SNSシェア用のカッコいい優勝予想画像を秒速で生成・ダウンロードできます。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "W杯優勝予想しようよ | 優勝国を画像でシェアしよう",
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "W杯",
    "ワールドカップ",
    "優勝予想",
    "画像生成",
    "シミュレーション",
    "サッカー予想",
    "SNSシェア",
    "無料アプリ",
  ],
  authors: [{ name: "W杯ファンプロジェクト" }],
  creator: "W杯ファンプロジェクト",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "W杯優勝予想しようよ",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "W杯優勝予想しようよ - 優勝国を画像でシェアしよう",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F8FAFC] text-slate-900`}
      >
        <div className="flex justify-center w-full min-h-screen bg-gradient-to-br from-indigo-100 via-pink-100 to-amber-100 bg-dot-pattern text-slate-900 font-sans p-0 sm:p-4 md:p-6">
          <div className="flex flex-col justify-between w-full max-w-[640px] min-h-screen sm:min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] bg-[#F8FAFC] border-2 border-slate-900 sm:rounded-3xl shadow-[8px_8px_0px_rgba(15,23,42,1)] relative overflow-hidden">
            <Header />
            <main className="flex-1 w-full bg-dot-pattern">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}