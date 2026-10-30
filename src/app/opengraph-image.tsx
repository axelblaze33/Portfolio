import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#060912",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(162,139,255,0.35), transparent 45%), radial-gradient(circle at 10% 95%, rgba(94,225,249,0.25), transparent 40%)",
          color: "#e8ecf7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 18,
              border: "3px solid #5ee1f9",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            PM
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#a3adc8" }}>{site.location}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 30, color: "#5ee1f9", marginBottom: 18 }}>{site.title}</div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{site.name}</div>
          <div style={{ display: "flex", fontSize: 36, color: "#a3adc8", marginTop: 28, maxWidth: 900 }}>
            {site.headline}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {["Angular", "TypeScript", "REST APIs", "SQL", "FastAPI"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,210,0.3)",
                fontSize: 22,
                color: "#e8ecf7",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
