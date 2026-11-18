import { ImageResponse } from "next/og";

export const alt = "Evan Lei — a climber at the summit of a mountain";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The share card: the mountain at dusk with the climber's flag at the top.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #e5cfe4 0%, #f8d8c2 70%, #faf9f6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M0 630 L0 420 L120 360 L240 400 L380 330 L520 390 L640 350 L760 400 L900 340 L1040 390 L1200 350 L1200 630 Z" fill="#d4ded6" />
          <path d="M520 630 L820 120 L1120 630 Z" fill="#ecf0e7" />
          <path d="M820 120 L1000 630 L1120 630 Z" fill="#d8e0d2" />
          <path d="M820 120 L770 210 L800 200 L825 225 L850 198 L875 212 Z" fill="#ffffff" />
          <path d="M560 630 C700 560 640 520 760 470 C860 430 780 380 840 330 C880 290 800 250 845 200 C830 170 828 150 822 124" stroke="#45634f" strokeWidth="7" fill="none" strokeLinecap="round" />
          <line x1="836" y1="122" x2="836" y2="62" stroke="#23261f" strokeWidth="4" />
          <path d="M838 62 L884 74 L838 88 Z" fill="#d2672f" />
          <circle cx="250" cy="150" r="46" fill="#ffe6cf" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", position: "absolute", left: 80, top: 210 }}>
          <div style={{ fontSize: 88, fontWeight: 700, color: "#23261f", letterSpacing: -3 }}>Evan Lei</div>
          <div style={{ fontSize: 34, color: "#45634f", marginTop: 12 }}>CS at Columbia · climb to see what I&apos;ve built</div>
        </div>
      </div>
    ),
    size,
  );
}
