import { Suspense } from "react";
import { Metadata } from "next";
import ResultContent from "./ResultContent";
import { getCountryById } from "../data/countries";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }> | { country?: string };
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const countryId = typeof resolvedSearchParams === "object" ? (resolvedSearchParams as any)?.country : undefined;
  const country = countryId ? getCountryById(countryId) : null;

  const title = country ? `${country.name} 優勝予想` : "W杯優勝予想しようよ";
  const description = country
    ? `私の2026年W杯優勝予想は「${country.name}」！あなたも予想しよう！`
    : "予選グループから優勝国を予想して画像をシェアしよう。";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/result/opengraph-image?country=${countryId || ""}`,
          width: 1200,
          height: 630,
          alt: country ? `${country.name} 優勝予想` : "W杯優勝予想しようよ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/result/opengraph-image?country=${countryId || ""}`],
    },
  };
}


export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-white text-slate-500 gap-3">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-black">読込中...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
