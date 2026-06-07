"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCountryById, getFlagUrl } from "../data/countries";

export default function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const countryId = searchParams.get("country");
  const country = countryId ? getCountryById(countryId) : null;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // If no country is found, redirect to home page
  useEffect(() => {
    if (!country) {
      router.push("/");
    }
  }, [country, router]);

  useEffect(() => {
    if (!country || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions (1200x630, OGP standards)
    const w = 1200;
    const h = 630;
    canvas.width = w;
    canvas.height = h;

    // 1. Draw flag as background
    drawFlag(ctx, country.id, w, h);

    // 2. Draw bright white radial overlay (to keep the flag clear and bright)
    const radialGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.1, w / 2, h / 2, w * 0.65);
    radialGrad.addColorStop(0, "rgba(255, 255, 255, 0.05)");
    radialGrad.addColorStop(0.55, "rgba(255, 255, 255, 0.25)");
    radialGrad.addColorStop(1, "rgba(255, 255, 255, 0.55)");
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, w, h);

    // 3. Draw border styling (Thick black outer border and white inner line like a pop sticker)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 18;
    ctx.strokeRect(9, 9, w - 18, h - 18);
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    // 4. Draw Colorful Confetti Celebration
    const confettiColors = ["#38BDF8", "#34D399", "#FB7185", "#FBBF24", "#A78BFA", "#F97316"];
    for (let i = 0; i < 60; i++) {
      const px = Math.random() * (w - 60) + 30;
      const py = Math.random() * (h - 60) + 30;
      const size = Math.random() * 8 + 6;
      ctx.fillStyle = confettiColors[Math.floor(Math.random() * confettiColors.length)];

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(Math.random() * Math.PI * 2);

      const shapeType = Math.floor(Math.random() * 3);
      if (shapeType === 0) {
        // Rectangle
        ctx.fillRect(-size / 2, -size / 4, size, size / 2);
      } else if (shapeType === 1) {
        // Circle
        ctx.beginPath();
        ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Triangle
        ctx.beginPath();
        ctx.moveTo(-size / 2, size / 2);
        ctx.lineTo(size / 2, size / 2);
        ctx.lineTo(0, -size / 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // 5. Draw Gold Trophy on the Left and Cute Mascot Animal on the Right (leaving the center of the flag completely visible!)
    drawTrophy(ctx, 220, h * 0.45, 150);
    drawAnimal(ctx, country.id, w - 220, h * 0.45, 140);

    // 6. Draw Text Elements (no bounding box to preserve flag details)
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.lineJoin = "round";

    // Header Text (2026 WORLD CUP PREDICTION)
    ctx.font = "bold 24px 'Geist', 'system-ui', 'Hiragino Kaku Gothic ProN', sans-serif";
    ctx.letterSpacing = "6px";

    // Shadow
    ctx.fillStyle = "#000000";
    ctx.fillText("2026 WORLD CUP PREDICTION", w / 2 + 2, h * 0.14 + 2);

    // Stroke
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 6;
    ctx.strokeText("2026 WORLD CUP PREDICTION", w / 2, h * 0.14);

    // Fill
    ctx.fillStyle = "#FBBF24";
    ctx.fillText("2026 WORLD CUP PREDICTION", w / 2, h * 0.14);

    // Combined Main Text ("W杯優勝は、●●！")
    const resultText = `W杯優勝は、${country.name.toUpperCase()}!`;
    ctx.font = "900 68px 'Geist', 'system-ui', 'Hiragino Kaku Gothic ProN', sans-serif";

    const textGrad = ctx.createLinearGradient(w / 2 - 350, 0, w / 2 + 350, 0);
    textGrad.addColorStop(0, "#FBBF24");
    textGrad.addColorStop(0.5, "#F43F5E");
    textGrad.addColorStop(1, "#FBBF24");

    const textY = h * 0.84; // 84% from top (lowest section)

    // Shadow
    ctx.fillStyle = "#000000";
    ctx.fillText(resultText, w / 2 + 5, textY + 5);

    // Stroke
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 16;
    ctx.strokeText(resultText, w / 2, textY);

    // Fill
    ctx.fillStyle = textGrad;
    ctx.fillText(resultText, w / 2, textY);

    // Reset shadow/stroke for exporting
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Convert canvas to image url
    try {
      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
      setLoading(false);
    } catch (err) {
      console.error("Failed to generate image URL", err);
      setLoading(false);
    }
  }, [country]);

  const handleDownload = () => {
    if (!imageUrl || !country) return;
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `W杯優勝予想_${country.name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleXShare = async () => {
    if (!country) return;

    // Try to copy image to clipboard
    try {
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 5000);
      }
    } catch (err) {
      console.warn("Clipboard copy failed, fallback to text-only share", err);
    }

    const shareText = `2026年W杯、私の優勝予想は「${country.name}」！\n#こめこめW杯予言祭り\n#W杯優勝予想しようよ\n#当てたらこめがなんかくれるかも`;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://worldcup-prediction-app.vercel.app/';
    const shareUrl = `${baseUrl}/result?country=${country.id}`;
    const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterIntentUrl, "_blank", "noopener,noreferrer");
  };

  if (!country) return null;

  return (
    <div className="pb-20 pt-8 px-4 sm:px-6 select-none">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-8">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-slate-900 bg-indigo-50 text-indigo-650 shadow-[2px_2px_0px_#000] mb-3">
            画像生成が完了しました！ 🎉
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            予想画像プレビュー
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            画像を保存して、X（Twitter）などでシェアしましょう。
          </p>
        </div>

        {/* Hidden Canvas (used to export PNG) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Image Preview Container */}
        <div className="relative w-full aspect-[1200/630] rounded-[2rem] overflow-hidden border-2 border-slate-900 bg-white shadow-[6px_6px_0px_#000] hover:scale-[1.01] transition-transform duration-300">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-xs text-slate-500 font-black">画像を構築中...</p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={`${country.name} 優勝予想`}
              className="w-full h-full object-cover select-none pointer-events-none"
            />
          )}
        </div>

        {/* Selected Country Badge */}
        <div className="mt-6 flex items-center gap-2.5 px-4 py-2 bg-white border-2 border-slate-900 rounded-full shadow-[2.5px_2.5px_0px_#000]">
          <div className="w-6 h-6 rounded-full border border-slate-900 overflow-hidden shrink-0">
            <img
              src={getFlagUrl(country.id)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-xs text-slate-800">選んだ国: {country.name}</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-10 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleDownload}
              disabled={loading || !imageUrl}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 text-slate-900 font-black rounded-2xl shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
              <span>画像をダウンロード</span>
            </button>

            <button
              onClick={handleXShare}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-850 border-2 border-slate-900 text-white font-black rounded-2xl shadow-[3px_3px_0px_#6366F1] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#6366F1] transition-all cursor-pointer"
            >
              {/* Custom SVG logo for X (Twitter) */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>Xで予想をシェア</span>
            </button>
          </div>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 border-2 border-slate-900 text-slate-700 font-black rounded-2xl shadow-[3px_3px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_#000] transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            <span>もう一度予想する</span>
          </Link>

          {/* Guideline Box */}
          <div className={`p-4 border-2 border-slate-900 rounded-2xl transition-all duration-300 text-left w-full select-none ${copied ? "bg-emerald-50 border-emerald-500 shadow-[3px_3px_0px_rgba(52,211,153,0.35)]" : "bg-indigo-50 shadow-[3px_3px_0px_rgba(99,102,241,0.2)]"}`}>
            <p className="text-xs text-slate-850 font-bold leading-relaxed flex items-start gap-2">
              <span className="text-sm shrink-0">{copied ? "📋" : "💡"}</span>
              {copied ? (
                <span className="text-emerald-950">
                  <strong>予想画像がクリップボードにコピーされました！</strong><br />
                  開いたXの投稿画面で、<strong>「貼り付け（Ctrl+V または長押し）」</strong>を行うと、画像がそのまま添付されます！
                </span>
              ) : (
                <span className="text-indigo-950">
                  XでURLをポストすると、<strong>予想画像が自動でカード表示されます！</strong><br />
                  また、ボタンを押すと<strong>画像がクリップボードに自動コピー</strong>されますので、投稿画面でそのまま<strong>「貼り付け（Ctrl+V）」</strong>して画像付きで投稿することも可能です！
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom function to draw flag on Canvas
function drawFlag(ctx: CanvasRenderingContext2D, countryId: string, w: number, h: number) {
  ctx.save();
  switch (countryId) {
    case "JP":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#BC002D";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.28, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "FR":
      ctx.fillStyle = "#002395";
      ctx.fillRect(0, 0, w / 3, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w / 3, 0, w / 3, h);
      ctx.fillStyle = "#ED2939";
      ctx.fillRect((w * 2) / 3, 0, w / 3, h);
      break;

    case "NL":
      ctx.fillStyle = "#AE1C28";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#21468B";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      break;

    case "SN":
      ctx.fillStyle = "#118C4F";
      ctx.fillRect(0, 0, w / 3, h);
      ctx.fillStyle = "#FCD116";
      ctx.fillRect(w / 3, 0, w / 3, h);
      ctx.fillStyle = "#DA121A";
      ctx.fillRect((w * 2) / 3, 0, w / 3, h);
      drawStar(ctx, w / 2, h / 2, 5, h * 0.12, h * 0.05, "#118C4F");
      break;

    case "EC":
      ctx.fillStyle = "#FFDD00";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#001489";
      ctx.fillRect(0, h / 2, w, h / 4);
      ctx.fillStyle = "#DA121A";
      ctx.fillRect(0, (h * 3) / 4, w, h / 4);
      ctx.fillStyle = "#8B5A2B";
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, h * 0.08, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "QA":
      ctx.fillStyle = "#8A1538";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w * 0.28, h);
      ctx.beginPath();
      ctx.moveTo(w * 0.28, 0);
      const points = 9;
      const step = h / points;
      for (let i = 0; i < points; i++) {
        const yTop = i * step;
        const yMid = yTop + step / 2;
        const yBot = (i + 1) * step;
        ctx.lineTo(w * 0.38, yMid);
        ctx.lineTo(w * 0.28, yBot);
      }
      ctx.closePath();
      ctx.fill();
      break;

    case "EN":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#CF081F";
      ctx.fillRect(w / 2 - w * 0.04, 0, w * 0.08, h);
      ctx.fillRect(0, h / 2 - h * 0.06, w, h * 0.12);
      break;

    case "US":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#BF0A30";
      const uStripeH = h / 13;
      for (let i = 0; i < 13; i += 2) {
        ctx.fillRect(0, i * uStripeH, w, uStripeH);
      }
      ctx.fillStyle = "#002868";
      ctx.fillRect(0, 0, w * 0.42, uStripeH * 7);
      ctx.fillStyle = "#FFFFFF";
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 6; c++) {
          ctx.beginPath();
          ctx.arc(
            w * 0.035 + c * (w * 0.07),
            uStripeH * 0.7 + r * (uStripeH * 1.3),
            2.5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
      break;

    case "IR":
      ctx.fillStyle = "#239E46";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#DA251D";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      ctx.fillStyle = "#DA251D";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.08, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "WA":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#00AD43";
      ctx.fillRect(0, h / 2, w, h / 2);
      ctx.fillStyle = "#CF081F";
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.5, h * 0.15, h * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "AR":
      ctx.fillStyle = "#75AADB";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#75AADB";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      ctx.fillStyle = "#FCBF49";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.07, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "MX":
      ctx.fillStyle = "#006847";
      ctx.fillRect(0, 0, w / 3, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w / 3, 0, w / 3, h);
      ctx.fillStyle = "#CE1126";
      ctx.fillRect((w * 2) / 3, 0, w / 3, h);
      ctx.fillStyle = "#8B5A2B";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.06, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "PL":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#DC143C";
      ctx.fillRect(0, h / 2, w, h / 2);
      break;

    case "SA":
      ctx.fillStyle = "#006C35";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w * 0.32, h * 0.65, w * 0.36, h * 0.025);
      ctx.fillRect(w * 0.32, h * 0.6, w * 0.02, h * 0.09);
      break;

    case "DK":
      ctx.fillStyle = "#C60C30";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w * 0.35, 0, w * 0.07, h);
      ctx.fillRect(0, h * 0.46, w, h * 0.08);
      break;

    case "AU":
      ctx.fillStyle = "#000031";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w * 0.4, h * 0.45);
      ctx.fillStyle = "#000031";
      ctx.fillRect(0, 0, w * 0.17, h * 0.2);
      ctx.fillRect(w * 0.23, 0, w * 0.17, h * 0.2);
      ctx.fillRect(0, h * 0.25, w * 0.17, h * 0.2);
      ctx.fillRect(w * 0.23, h * 0.25, w * 0.17, h * 0.2);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(w * 0.18, 0, w * 0.04, h * 0.45);
      ctx.fillRect(0, h * 0.2, w * 0.4, h * 0.05);
      ctx.fillStyle = "#FFFFFF";
      drawStar(ctx, w * 0.72, h * 0.25, 7, 12, 5, "#FFFFFF");
      drawStar(ctx, w * 0.72, h * 0.75, 7, 12, 5, "#FFFFFF");
      drawStar(ctx, w * 0.62, h * 0.5, 7, 10, 4, "#FFFFFF");
      drawStar(ctx, w * 0.82, h * 0.55, 7, 10, 4, "#FFFFFF");
      break;

    case "TN":
      ctx.fillStyle = "#E70013";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#E70013";
      ctx.beginPath();
      ctx.arc(w * 0.52, h / 2, h * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(w * 0.56, h / 2, h * 0.13, 0, Math.PI * 2);
      ctx.fill();
      drawStar(ctx, w * 0.48, h / 2, 5, h * 0.06, h * 0.025, "#E70013");
      break;

    case "ES":
      ctx.fillStyle = "#C60B1E";
      ctx.fillRect(0, 0, w, h / 4);
      ctx.fillStyle = "#FFC400";
      ctx.fillRect(0, h / 4, w, h / 2);
      ctx.fillStyle = "#C60B1E";
      ctx.fillRect(0, (h * 3) / 4, w, h / 4);
      ctx.fillStyle = "#C60B1E";
      ctx.fillRect(w * 0.25, h * 0.42, w * 0.05, h * 0.12);
      break;

    case "DE":
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#FFCC00";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      break;

    case "CR":
      ctx.fillStyle = "#002B7F";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h * 0.15, w, h * 0.7);
      ctx.fillStyle = "#CE1126";
      ctx.fillRect(0, h * 0.3, w, h * 0.4);
      break;

    case "HR":
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#0021C4";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(w / 2 - 20, h / 2 - 25, 40, 50);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.strokeRect(w / 2 - 20, h / 2 - 25, 40, 50);
      break;

    case "BE":
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w / 3, h);
      ctx.fillStyle = "#FFE936";
      ctx.fillRect(w / 3, 0, w / 3, h);
      ctx.fillStyle = "#EF3340";
      ctx.fillRect((w * 2) / 3, 0, w / 3, h);
      break;

    case "MA":
      ctx.fillStyle = "#C1272D";
      ctx.fillRect(0, 0, w, h);
      drawStarOutline(ctx, w / 2, h / 2, 5, h * 0.2, h * 0.08, "#006233", 4);
      break;

    case "CA":
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(0, 0, w / 4, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w / 4, 0, w / 2, h);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect((w * 3) / 4, 0, w / 4, h);
      ctx.fillStyle = "#FF0000";
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.3);
      ctx.lineTo(w * 0.55, h * 0.45);
      ctx.lineTo(w * 0.63, h * 0.42);
      ctx.lineTo(w * 0.6, h * 0.56);
      ctx.lineTo(w * 0.52, h * 0.56);
      ctx.lineTo(w * 0.52, h * 0.7);
      ctx.lineTo(w * 0.48, h * 0.7);
      ctx.lineTo(w * 0.48, h * 0.56);
      ctx.lineTo(w * 0.4, h * 0.56);
      ctx.lineTo(w * 0.37, h * 0.42);
      ctx.lineTo(w * 0.45, h * 0.45);
      ctx.closePath();
      ctx.fill();
      break;

    case "BR":
      ctx.fillStyle = "#009C3B";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFDF00";
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.12);
      ctx.lineTo(w * 0.9, h / 2);
      ctx.lineTo(w / 2, h * 0.88);
      ctx.lineTo(w * 0.1, h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#002776";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.68, h * 0.4, Math.PI * 1.35, Math.PI * 1.65);
      ctx.stroke();
      break;

    case "CH":
      ctx.fillStyle = "#D52B1E";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w / 2 - w * 0.04, h * 0.2, w * 0.08, h * 0.6);
      ctx.fillRect(w * 0.22, h / 2 - h * 0.05, w * 0.56, h * 0.1);
      break;

    case "SR":
      ctx.fillStyle = "#C6363C";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#0C4076";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      break;

    case "CM":
      ctx.fillStyle = "#007A5E";
      ctx.fillRect(0, 0, w / 3, h);
      ctx.fillStyle = "#CE1126";
      ctx.fillRect(w / 3, 0, w / 3, h);
      ctx.fillStyle = "#FCD116";
      ctx.fillRect((w * 2) / 3, 0, w / 3, h);
      drawStar(ctx, w / 2, h / 2, 5, h * 0.1, h * 0.04, "#FCD116");
      break;

    case "PT":
      ctx.fillStyle = "#006600";
      ctx.fillRect(0, 0, w * 0.4, h);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(w * 0.4, 0, w * 0.6, h);
      ctx.fillStyle = "#FCD116";
      ctx.beginPath();
      ctx.arc(w * 0.4, h / 2, h * 0.15, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "UY":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0081C8";
      const uyStripeH = h / 9;
      for (let i = 1; i < 9; i += 2) {
        ctx.fillRect(0, i * uyStripeH, w, uyStripeH);
      }
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w * 0.32, uyStripeH * 5);
      ctx.fillStyle = "#FCBF49";
      ctx.beginPath();
      ctx.arc(w * 0.16, uyStripeH * 2.5, uyStripeH * 1.5, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "KR":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#CD1226";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.18, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = "#0047A0";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.18, 0, Math.PI);
      ctx.fill();
      break;

    case "GH":
      ctx.fillStyle = "#DA121A";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FCD116";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#006B3F";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      drawStar(ctx, w / 2, h / 2, 5, h * 0.1, h * 0.04, "#000000");
      break;

    // --- NEW COUNTRIES ---

    case "CZ":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#D7141A";
      ctx.fillRect(0, h / 2, w, h / 2);
      ctx.fillStyle = "#11457E";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.45, h / 2);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      break;

    case "ZA": {
      ctx.fillStyle = "#E03C31";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#001489";
      ctx.fillRect(0, h / 2, w, h / 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.48, h / 2);
      ctx.lineTo(0, h);
      ctx.lineTo(0, h - h * 0.18);
      ctx.lineTo(w * 0.35, h / 2);
      ctx.lineTo(0, h * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(0, h / 2 - h * 0.15, w, h * 0.3);
      ctx.fillStyle = "#007A4D";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.08);
      ctx.lineTo(w * 0.42, h / 2);
      ctx.lineTo(0, h - h * 0.08);
      ctx.lineTo(0, h - h * 0.22);
      ctx.lineTo(w * 0.30, h / 2);
      ctx.lineTo(0, h * 0.22);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(0, h / 2 - h * 0.08, w, h * 0.16);
      ctx.fillStyle = "#FFB81C";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.12);
      ctx.lineTo(w * 0.28, h / 2);
      ctx.lineTo(0, h - h * 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.moveTo(0, h * 0.2);
      ctx.lineTo(w * 0.22, h / 2);
      ctx.lineTo(0, h - h * 0.2);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case "BA":
      ctx.fillStyle = "#002F6C";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FECB00";
      ctx.beginPath();
      ctx.moveTo(w * 0.35, 0);
      ctx.lineTo(w * 0.82, 0);
      ctx.lineTo(w * 0.82, h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      for (let i = 0; i < 8; i++) {
        const sx = w * 0.32 + i * (w * 0.06);
        const sy = i * (h * 0.13) + h * 0.04;
        drawStar(ctx, sx, sy, 5, 8, 3, "#FFFFFF");
      }
      break;

    case "SCO":
      ctx.fillStyle = "#005EB8";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = w * 0.09;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, h);
      ctx.moveTo(w, 0);
      ctx.lineTo(0, h);
      ctx.stroke();
      break;

    case "HT":
      ctx.fillStyle = "#00209F";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#D21034";
      ctx.fillRect(0, h / 2, w, h / 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w / 2 - w * 0.12, h / 2 - h * 0.14, w * 0.24, h * 0.28);
      ctx.fillStyle = "#8B5A2B";
      ctx.fillRect(w / 2 - 3, h / 2 - h * 0.08, 6, h * 0.14);
      ctx.fillStyle = "#007A4D";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2 - h * 0.05, 18, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "TR":
      ctx.fillStyle = "#E30A17";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(w * 0.45, h / 2, h * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#E30A17";
      ctx.beginPath();
      ctx.arc(w * 0.49, h / 2, h * 0.175, 0, Math.PI * 2);
      ctx.fill();
      drawStar(ctx, w * 0.63, h / 2, 5, h * 0.08, h * 0.03, "#FFFFFF");
      break;

    case "PY":
      ctx.fillStyle = "#D52B1E";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#0038A8";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 3;
      ctx.stroke();
      break;

    case "CI":
      ctx.fillStyle = "#F77F00";
      ctx.fillRect(0, 0, w / 3, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w / 3, 0, w / 3, h);
      ctx.fillStyle = "#009E60";
      ctx.fillRect((w * 2) / 3, 0, w / 3, h);
      break;

    case "CW":
      ctx.fillStyle = "#002B7F";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#F9E814";
      ctx.fillRect(0, h * 0.68, w, h * 0.1);
      drawStar(ctx, w * 0.18, h * 0.22, 5, 20, 8, "#FFFFFF");
      drawStar(ctx, w * 0.28, h * 0.36, 5, 14, 6, "#FFFFFF");
      break;

    case "SE":
      ctx.fillStyle = "#006AA7";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FECC00";
      ctx.fillRect(w * 0.32, 0, w * 0.08, h);
      ctx.fillRect(0, h * 0.45, w, h * 0.1);
      break;

    case "EG":
      ctx.fillStyle = "#C1272D";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      ctx.fillStyle = "#C5A059";
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, h * 0.06, h * 0.09, 0, 0, Math.PI * 2);
      ctx.fill();
      break;

    case "NZ":
      ctx.fillStyle = "#000031";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w * 0.4, h * 0.45);
      ctx.fillStyle = "#000031";
      ctx.fillRect(0, 0, w * 0.17, h * 0.2);
      ctx.fillRect(w * 0.23, 0, w * 0.17, h * 0.2);
      ctx.fillRect(0, h * 0.25, w * 0.17, h * 0.2);
      ctx.fillRect(w * 0.23, h * 0.25, w * 0.17, h * 0.2);
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(w * 0.18, 0, w * 0.04, h * 0.45);
      ctx.fillRect(0, h * 0.2, w * 0.4, h * 0.05);
      drawStar(ctx, w * 0.72, h * 0.25, 5, 12, 5, "#FFFFFF");
      drawStar(ctx, w * 0.72, h * 0.25, 5, 9.5, 4, "#CC0000");
      drawStar(ctx, w * 0.72, h * 0.75, 5, 12, 5, "#FFFFFF");
      drawStar(ctx, w * 0.72, h * 0.75, 5, 9.5, 4, "#CC0000");
      drawStar(ctx, w * 0.62, h * 0.5, 5, 10, 4, "#FFFFFF");
      drawStar(ctx, w * 0.62, h * 0.5, 5, 7.5, 3, "#CC0000");
      drawStar(ctx, w * 0.82, h * 0.55, 5, 10, 4, "#FFFFFF");
      drawStar(ctx, w * 0.82, h * 0.55, 5, 7.5, 3, "#CC0000");
      break;

    case "CV": {
      ctx.fillStyle = "#003893";
      ctx.fillRect(0, 0, w, h);
      const bandY = h * 0.5;
      const stripeH = h * 0.05;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, bandY, w, stripeH * 3);
      ctx.fillStyle = "#F70A24";
      ctx.fillRect(0, bandY + stripeH, w, stripeH);
      const cx = w * 0.32;
      const cy = bandY + stripeH * 1.5;
      const r = h * 0.18;
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI * 2) / 10;
        const sx = cx + Math.cos(angle) * r;
        const sy = cy + Math.sin(angle) * r;
        drawStar(ctx, sx, sy, 5, 10, 4, "#FCD116");
      }
      break;
    }

    case "NO":
      ctx.fillStyle = "#EF2B2D";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w * 0.32, 0, w * 0.12, h);
      ctx.fillRect(0, h * 0.43, w, h * 0.14);
      ctx.fillStyle = "#002868";
      ctx.fillRect(w * 0.35, 0, w * 0.06, h);
      ctx.fillRect(0, h * 0.47, w, h * 0.06);
      break;

    case "IQ":
      ctx.fillStyle = "#DA291C";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      ctx.fillStyle = "#007A3D";
      ctx.font = "bold 26px sans-serif";
      ctx.fillText("الله أكبر", w / 2, h / 2);
      break;

    case "AT":
      ctx.fillStyle = "#ED2939";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#ED2939";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      break;

    case "DZ": {
      ctx.fillStyle = "#006633";
      ctx.fillRect(0, 0, w / 2, h);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(w / 2, 0, w / 2, h);
      ctx.fillStyle = "#D21034";
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, h * 0.16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(w * 0.53, h / 2, h * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w / 2, h);
      ctx.clip();
      ctx.fillStyle = "#006633";
      ctx.beginPath();
      ctx.arc(w * 0.53, h / 2, h * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      drawStar(ctx, w * 0.54, h / 2, 5, h * 0.07, h * 0.03, "#D21034");
      break;
    }

    case "JO":
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h / 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h / 3, w, h / 3);
      ctx.fillStyle = "#006633";
      ctx.fillRect(0, (h * 2) / 3, w, h / 3);
      ctx.fillStyle = "#C1272D";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.45, h / 2);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      drawStar(ctx, w * 0.15, h / 2, 7, h * 0.05, h * 0.02, "#FFFFFF");
      break;

    case "CO":
      ctx.fillStyle = "#FCD116";
      ctx.fillRect(0, 0, w, h / 2);
      ctx.fillStyle = "#003893";
      ctx.fillRect(0, h / 2, w, h / 4);
      ctx.fillStyle = "#CE1126";
      ctx.fillRect(0, (h * 3) / 4, w, h / 4);
      break;

    case "CD":
      ctx.fillStyle = "#007FFF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#FCD116";
      ctx.beginPath();
      ctx.moveTo(0, h - 20);
      ctx.lineTo(w - 20, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, 30);
      ctx.lineTo(20, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#CE1126";
      ctx.beginPath();
      ctx.moveTo(0, h - 5);
      ctx.lineTo(w - 5, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, 15);
      ctx.lineTo(5, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
      drawStar(ctx, w * 0.15, h * 0.22, 5, h * 0.12, h * 0.05, "#FCD116");
      break;

    case "UZ":
      ctx.fillStyle = "#0099B5";
      ctx.fillRect(0, 0, w, h * 0.32);
      ctx.fillStyle = "#CE1126";
      ctx.fillRect(0, h * 0.32, w, h * 0.03);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, h * 0.35, w, h * 0.3);
      ctx.fillStyle = "#CE1126";
      ctx.fillRect(0, h * 0.65, w, h * 0.03);
      ctx.fillStyle = "#3C9B27";
      ctx.fillRect(0, h * 0.68, w, h * 0.32);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(w * 0.12, h * 0.16, h * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#0099B5";
      ctx.beginPath();
      ctx.arc(w * 0.14, h * 0.16, h * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      const uzSx = w * 0.18;
      const uzSy = h * 0.07;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3 - r; c++) {
          ctx.beginPath();
          ctx.arc(uzSx + c * 15 + r * 7, uzSy + r * 15, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;

    case "PA":
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#DA121A";
      ctx.fillRect(w / 2, 0, w / 2, h / 2);
      ctx.fillStyle = "#001689";
      ctx.fillRect(0, h / 2, w / 2, h / 2);
      drawStar(ctx, w * 0.25, h * 0.25, 5, h * 0.12, h * 0.05, "#001689");
      drawStar(ctx, w * 0.75, h * 0.75, 5, h * 0.12, h * 0.05, "#DA121A");
      break;

    default:
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, w, h);
      break;
  }
  ctx.restore();
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawStarOutline(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, color: string, lineWidth: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.restore();
}

// Draw a beautiful vector Gold Trophy on canvas
function drawTrophy(ctx: CanvasRenderingContext2D, cx: number, cy: number, h: number) {
  ctx.save();
  ctx.fillStyle = "#FBBF24"; // Gold
  ctx.strokeStyle = "#D97706"; // Amber border
  ctx.lineWidth = 3.5;

  // Cup Bowl
  ctx.beginPath();
  ctx.moveTo(cx - h * 0.24, cy - h * 0.35);
  ctx.quadraticCurveTo(cx - h * 0.24, cy + h * 0.05, cx, cy + h * 0.12);
  ctx.quadraticCurveTo(cx + h * 0.24, cy + h * 0.05, cx + h * 0.24, cy - h * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Lid
  ctx.beginPath();
  ctx.ellipse(cx, cy - h * 0.35, h * 0.24, h * 0.05, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Lid Crown
  ctx.beginPath();
  ctx.arc(cx, cy - h * 0.41, h * 0.035, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Stem
  ctx.fillRect(cx - h * 0.035, cy + h * 0.12, h * 0.07, h * 0.15);
  ctx.strokeRect(cx - h * 0.035, cy + h * 0.12, h * 0.07, h * 0.15);

  // Base
  ctx.beginPath();
  ctx.moveTo(cx - h * 0.13, cy + h * 0.27);
  ctx.lineTo(cx + h * 0.13, cy + h * 0.27);
  ctx.lineTo(cx + h * 0.18, cy + h * 0.38);
  ctx.lineTo(cx - h * 0.18, cy + h * 0.38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Handles (Left and Right)
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#FBBF24";
  ctx.beginPath();
  // Left handle
  ctx.moveTo(cx - h * 0.24, cy - h * 0.22);
  ctx.bezierCurveTo(cx - h * 0.44, cy - h * 0.22, cx - h * 0.4, cy - h * 0.02, cx - h * 0.21, cy + h * 0.04);
  // Right handle
  ctx.moveTo(cx + h * 0.24, cy - h * 0.22);
  ctx.bezierCurveTo(cx + h * 0.44, cy - h * 0.22, cx + h * 0.4, cy - h * 0.02, cx + h * 0.21, cy + h * 0.04);
  ctx.stroke();

  // Handle outlines
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = "#D97706";
  ctx.stroke();

  ctx.restore();
}

// Draw a cute country mascot animal standing next to the trophy
function drawAnimal(ctx: CanvasRenderingContext2D, countryId: string, cx: number, cy: number, size: number) {
  ctx.save();
  ctx.shadowBlur = 0;

  let animalType = "FALLBACK";
  const code = countryId.toUpperCase();

  if (code === "JP") animalType = "SHIBA";
  else if (code === "AU") animalType = "KOALA";
  else if (code === "NZ") animalType = "KIWI";
  else if (code === "MX") animalType = "AXOLOTL";
  else if (["EN", "NL", "BE", "MA", "SN", "ZA"].includes(code)) animalType = "LION";
  else if (code === "CA") animalType = "BEAVER";
  else if (code === "EG") animalType = "CAMEL";
  else if (["BR", "CO"].includes(code)) animalType = "TOUCAN";
  else if (code === "AR") animalType = "LLAMA";
  else if (code === "FR") animalType = "DOG";

  switch (animalType) {
    case "SHIBA": {
      // Shiba Inu (Japan)
      ctx.fillStyle = "#E28743";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.45, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(cx - size * 0.18, cy + size * 0.1, size * 0.22, size * 0.2, 0, 0, Math.PI * 2);
      ctx.ellipse(cx + size * 0.18, cy + size * 0.1, size * 0.22, size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#E28743";
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.4, cy - size * 0.1);
      ctx.lineTo(cx - size * 0.45, cy - size * 0.5);
      ctx.lineTo(cx - size * 0.15, cy - size * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + size * 0.4, cy - size * 0.1);
      ctx.lineTo(cx + size * 0.45, cy - size * 0.5);
      ctx.lineTo(cx + size * 0.15, cy - size * 0.35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#FADBD8";
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.36, cy - size * 0.12);
      ctx.lineTo(cx - size * 0.4, cy - size * 0.42);
      ctx.lineTo(cx - size * 0.2, cy - size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + size * 0.36, cy - size * 0.12);
      ctx.lineTo(cx + size * 0.4, cy - size * 0.42);
      ctx.lineTo(cx + size * 0.2, cy - size * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.12, size * 0.15, size * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(cx - size * 0.18, cy - size * 0.05, 5, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.18, cy - size * 0.05, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.08, 6, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#0F172A";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx - 5, cy + size * 0.12, 6, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 5, cy + size * 0.12, 6, 0, Math.PI);
      ctx.stroke();

      ctx.fillStyle = "rgba(231, 76, 60, 0.4)";
      ctx.beginPath();
      ctx.arc(cx - size * 0.3, cy + size * 0.06, 8, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.3, cy + size * 0.06, 8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "KOALA": {
      // Koala (Australia)
      ctx.fillStyle = "#94A3B8";
      ctx.beginPath();
      ctx.arc(cx - size * 0.35, cy - size * 0.2, size * 0.25, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.35, cy - size * 0.2, size * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(cx - size * 0.35, cy - size * 0.2, size * 0.16, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.35, cy - size * 0.2, size * 0.16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#94A3B8";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(cx - size * 0.16, cy - size * 0.04, 4.5, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.16, cy - size * 0.04, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.08, size * 0.12, size * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "KIWI": {
      // Kiwi Bird (New Zealand)
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 15, cy + size * 0.3);
      ctx.lineTo(cx - 15, cy + size * 0.45);
      ctx.moveTo(cx + 15, cy + size * 0.3);
      ctx.lineTo(cx + 15, cy + size * 0.45);
      ctx.stroke();

      ctx.fillStyle = "#78350F";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(cx - size * 0.14, cy - size * 0.08, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx - size * 0.14, cy - size * 0.08, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#FBBF24";
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.22, cy);
      ctx.quadraticCurveTo(cx - size * 0.65, cy + size * 0.12, cx - size * 0.7, cy + size * 0.28);
      ctx.stroke();
      ctx.lineCap = "butt";
      break;
    }
    case "AXOLOTL": {
      // Axolotl (Mexico)
      ctx.fillStyle = "#EC4899";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx - size * 0.42, cy - size * 0.15 + i * 16, 22, 8, Math.PI * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx + size * 0.42, cy - size * 0.15 + i * 16, 22, 8, -Math.PI * 0.1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#FBCFE8";
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 0.48, size * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx - size * 0.2, cy - size * 0.02, 5, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.2, cy - size * 0.02, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#DB2777";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy + size * 0.08, 10, 0, Math.PI);
      ctx.stroke();

      ctx.fillStyle = "rgba(244, 63, 94, 0.45)";
      ctx.beginPath();
      ctx.arc(cx - size * 0.3, cy + size * 0.06, 9, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.3, cy + size * 0.06, 9, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "LION": {
      // Lion (England, Netherlands, Senegal, South Africa, Belgium, Morocco)
      ctx.fillStyle = "#D97706";
      const manePoints = 12;
      const maneR = size * 0.44;
      for (let i = 0; i < manePoints; i++) {
        const angle = (i * Math.PI * 2) / manePoints;
        const mx = cx + Math.cos(angle) * maneR;
        const my = cy + Math.sin(angle) * maneR;
        ctx.beginPath();
        ctx.arc(mx, my, size * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#FBBF24";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.38, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FBBF24";
      ctx.beginPath();
      ctx.arc(cx - size * 0.26, cy - size * 0.26, size * 0.1, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.26, cy - size * 0.26, size * 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(cx - size * 0.14, cy - size * 0.04, 4, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.14, cy - size * 0.04, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.1, size * 0.12, size * 0.08, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#451A03";
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy + size * 0.05);
      ctx.lineTo(cx + 5, cy + size * 0.05);
      ctx.lineTo(cx, cy + size * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "BEAVER": {
      // Beaver (Canada)
      ctx.fillStyle = "#7C2D12";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.42, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#451A03";
      ctx.beginPath();
      ctx.arc(cx - size * 0.32, cy - size * 0.26, size * 0.11, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.32, cy - size * 0.26, size * 0.11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx - size * 0.16, cy - size * 0.04, 4, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.16, cy - size * 0.04, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#DDB892";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.1, size * 0.14, size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(cx, cy + size * 0.06, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(cx - 6, cy + size * 0.16, 5, 12);
      ctx.fillRect(cx + 1, cy + size * 0.16, 5, 12);
      break;
    }
    case "TOUCAN": {
      // Toucan (Brazil, Colombia)
      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FEF08A";
      ctx.beginPath();
      ctx.ellipse(cx - size * 0.1, cy - size * 0.04, size * 0.22, size * 0.26, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#38BDF8";
      ctx.beginPath();
      ctx.arc(cx - size * 0.12, cy - size * 0.06, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx - size * 0.12, cy - size * 0.06, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#F97316";
      ctx.beginPath();
      ctx.arc(cx + size * 0.15, cy + size * 0.08, size * 0.35, Math.PI * 1.5, Math.PI * 0.5);
      ctx.lineTo(cx, cy + size * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#EF4444";
      ctx.beginPath();
      ctx.arc(cx + size * 0.38, cy + size * 0.08, size * 0.12, Math.PI * 1.5, Math.PI * 0.5);
      ctx.lineTo(cx + size * 0.25, cy + size * 0.15);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "LLAMA": {
      // Llama (Argentina)
      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.05, size * 0.28, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.ellipse(cx - size * 0.14, cy - size * 0.34, size * 0.08, size * 0.24, Math.PI * 0.05, 0, Math.PI * 2);
      ctx.ellipse(cx + size * 0.14, cy - size * 0.34, size * 0.08, size * 0.24, -Math.PI * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#F1F5F9";
      ctx.beginPath();
      ctx.ellipse(cx - size * 0.14, cy - size * 0.34, size * 0.04, size * 0.18, Math.PI * 0.05, 0, Math.PI * 2);
      ctx.ellipse(cx + size * 0.14, cy - size * 0.34, size * 0.04, size * 0.18, -Math.PI * 0.05, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.arc(cx - size * 0.1, cy - size * 0.02, 5, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.1, cy - size * 0.02, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.18, size * 0.14, size * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#64748B";
      ctx.beginPath();
      ctx.arc(cx, cy + size * 0.14, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "DOG": {
      // Dog / French Bulldog (France)
      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.41, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.ellipse(cx - size * 0.28, cy - size * 0.3, size * 0.15, size * 0.25, -Math.PI * 0.08, 0, Math.PI * 2);
      ctx.ellipse(cx + size * 0.28, cy - size * 0.3, size * 0.15, size * 0.25, Math.PI * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FCA5A5";
      ctx.beginPath();
      ctx.ellipse(cx - size * 0.28, cy - size * 0.3, size * 0.08, size * 0.18, -Math.PI * 0.08, 0, Math.PI * 2);
      ctx.ellipse(cx + size * 0.28, cy - size * 0.3, size * 0.08, size * 0.18, Math.PI * 0.08, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E293B";
      ctx.beginPath();
      ctx.arc(cx - size * 0.16, cy - size * 0.02, 5.5, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.16, cy - size * 0.02, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#64748B";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.12, size * 0.16, size * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0F172A";
      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.08, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "CAMEL": {
      // Camel (Egypt)
      ctx.fillStyle = "#D97706";
      ctx.beginPath();
      ctx.ellipse(cx, cy, size * 0.36, size * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cx, cy + size * 0.18, size * 0.16, size * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cx - size * 0.26, cy - size * 0.26, size * 0.06, size * 0.14, -Math.PI * 0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + size * 0.26, cy - size * 0.26, size * 0.06, size * 0.14, Math.PI * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx - size * 0.12, cy - size * 0.04, 4.5, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.12, cy - size * 0.04, 4.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default: {
      // Fallback: Championship Kitty
      ctx.fillStyle = "#F59E0B";
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx - size * 0.38, cy - size * 0.1);
      ctx.lineTo(cx - size * 0.38, cy - size * 0.45);
      ctx.lineTo(cx - size * 0.1, cy - size * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + size * 0.38, cy - size * 0.1);
      ctx.lineTo(cx + size * 0.38, cy - size * 0.45);
      ctx.lineTo(cx + size * 0.1, cy - size * 0.35);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#FECDD3";
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.34, cy - size * 0.12);
      ctx.lineTo(cx - size * 0.34, cy - size * 0.38);
      ctx.lineTo(cx - size * 0.15, cy - size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + size * 0.34, cy - size * 0.12);
      ctx.lineTo(cx + size * 0.34, cy - size * 0.38);
      ctx.lineTo(cx + size * 0.15, cy - size * 0.3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx - size * 0.16, cy - size * 0.02, 5, 0, Math.PI * 2);
      ctx.arc(cx + size * 0.16, cy - size * 0.02, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#F43F5E";
      ctx.beginPath();
      ctx.moveTo(cx - 4, cy + size * 0.08);
      ctx.lineTo(cx + 4, cy + size * 0.08);
      ctx.lineTo(cx, cy + size * 0.12);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.32, cy + size * 0.12); ctx.lineTo(cx - size * 0.55, cy + size * 0.08);
      ctx.moveTo(cx - size * 0.32, cy + size * 0.16); ctx.lineTo(cx - size * 0.58, cy + size * 0.16);
      ctx.moveTo(cx + size * 0.32, cy + size * 0.12); ctx.lineTo(cx + size * 0.55, cy + size * 0.08);
      ctx.moveTo(cx + size * 0.32, cy + size * 0.16); ctx.lineTo(cx + size * 0.58, cy + size * 0.16);
      ctx.stroke();

      ctx.fillStyle = "#FACC15";
      ctx.strokeStyle = "#D97706";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - size * 0.35);
      ctx.lineTo(cx - 30, cy - size * 0.55);
      ctx.lineTo(cx - 10, cy - size * 0.45);
      ctx.lineTo(cx, cy - size * 0.62);
      ctx.lineTo(cx + 10, cy - size * 0.45);
      ctx.lineTo(cx + 30, cy - size * 0.55);
      ctx.lineTo(cx + 20, cy - size * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}
