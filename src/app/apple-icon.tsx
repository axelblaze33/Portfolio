import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b1020, #060912)",
          color: "#e8ecf7",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: -4,
          border: "6px solid #5ee1f9",
          borderRadius: 40,
        }}
      >
        PM
      </div>
    ),
    size,
  );
}
