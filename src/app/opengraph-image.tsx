import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.person} — ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#070707",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "rgba(214,179,90,0.22)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: 6,
            fontFamily: "monospace",
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#d6b35a" }} />
          MABY CONNECT
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 96,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: -4,
              display: "flex",
            }}
          >
            Matthew Adeleye
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 40,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: -1,
              display: "flex",
            }}
          >
            Building companies. Communities. People.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "monospace",
          }}
        >
          <span>Founder · Builder · Believer</span>
          <span style={{ color: "#d6b35a" }}>mabyconnect.com</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
