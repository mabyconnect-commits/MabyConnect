import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#070707",
          borderRadius: 14,
          color: "#fff",
          fontSize: 34,
          fontWeight: 600,
          letterSpacing: -2,
          fontFamily: "Georgia, serif",
        }}
      >
        M
        <span style={{ color: "#d6b35a" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
