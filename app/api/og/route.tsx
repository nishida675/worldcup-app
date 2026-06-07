import { ImageResponse } from "next/og";
import { getCountryById } from "../../data/countries";

export const runtime = "edge";

// Emojis for OGP mascots
function getAnimalEmoji(countryId: string): string {
  const code = countryId.toUpperCase();
  if (code === "JP") return "🐕"; // Shiba
  if (code === "AU") return "🐨"; // Koala
  if (code === "NZ") return "🥝"; // Kiwi
  if (code === "MX") return "🦎"; // Axolotl
  if (["EN", "NL", "BE", "MA", "SN", "ZA"].includes(code)) return "🦁"; // Lion
  if (code === "CA") return "🦫"; // Beaver
  if (code === "EG") return "🐪"; // Camel
  if (["BR", "CO"].includes(code)) return "🦜"; // Toucan
  if (code === "AR") return "🦙"; // Llama
  if (code === "FR") return "🐶"; // Dog
  return "🐱"; // Fallback
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("country");
    const country = countryId ? getCountryById(countryId) : null;

    const size = {
      width: 1200,
      height: 630,
    };

    if (!country) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#6366F1",
              color: "#fff",
              fontSize: "48px",
              fontWeight: 900,
            }}
          >
            W杯優勝予想しようよ 🏆
          </div>
        ),
        { ...size }
      );
    }

    const flagUrl = `https://flagcdn.com/w1280/${country.id.toLowerCase()}.png`;
    const animalEmoji = getAnimalEmoji(country.id);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#fff",
            position: "relative",
            padding: "50px 80px 45px 80px",
          }}
        >
          {/* Background flag image (more reliable for satori) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flagUrl}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Soft pop white gradient wash */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.6) 100%)",
              display: "flex",
            }}
          />

          {/* Confetti decorations */}
          <div style={{ position: "absolute", top: "12%", left: "18%", fontSize: "36px", display: "flex" }}>✨</div>
          <div style={{ position: "absolute", top: "78%", left: "45%", fontSize: "32px", display: "flex" }}>🎉</div>
          <div style={{ position: "absolute", top: "15%", right: "15%", fontSize: "40px", display: "flex" }}>✨</div>
          <div style={{ position: "absolute", top: "75%", left: "14%", fontSize: "28px", display: "flex" }}>⚡</div>
          <div style={{ position: "absolute", top: "76%", right: "18%", fontSize: "34px", display: "flex" }}>🎉</div>

          {/* Thick double pop borders */}
          <div
            style={{
              position: "absolute",
              top: 25,
              left: 25,
              right: 25,
              bottom: 25,
              border: "8px solid #000000",
              borderRadius: "32px",
              display: "flex",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 33,
              left: 33,
              right: 33,
              bottom: 33,
              border: "3px solid #FFFFFF",
              borderRadius: "26px",
              display: "flex",
            }}
          />

          {/* Top: Subtitle */}
          <div
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#FBBF24",
              textShadow: "2.5px 2.5px 0px #000000",
              letterSpacing: "4px",
              zIndex: 10,
            }}
          >
            2026 WORLD CUP PREDICTION
          </div>

          {/* Middle: Trophy and Animal side by side (leaving the center free) */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              flex: 1,
              zIndex: 10,
            }}
          >
            {/* Left: Trophy */}
            <div
              style={{
                fontSize: "140px",
                textShadow: "4px 4px 0px #000000",
                display: "flex",
              }}
            >
              🏆
            </div>

            {/* Right: Mascot */}
            <div
              style={{
                fontSize: "140px",
                textShadow: "4px 4px 0px #000000",
                display: "flex",
              }}
            >
              {animalEmoji}
            </div>
          </div>

          {/* Bottom: Unified single-line prediction text */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color: "#FB7185",
              textShadow: "4.5px 4.5px 0px #000000",
              zIndex: 10,
              textAlign: "center",
              display: "flex",
            }}
          >
            W杯優勝は、{country.name.toUpperCase()}!
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error("Failed to generate dynamic OGP image", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
