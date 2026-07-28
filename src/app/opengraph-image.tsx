import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = `${site.person} — ${site.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  // Embed the real portrait for rich social share previews.
  let portrait = "";
  try {
    const data = await readFile(join(process.cwd(), "public", "portrait.jpg"));
    portrait = `data:image/jpeg;base64,${data.toString("base64")}`;
  } catch {
    portrait = "";
  }

  // Brand mark.
  let mark = "";
  try {
    const data = await readFile(
      join(process.cwd(), "public", "logo", "maby-icon-1024-transparent.png"),
    );
    mark = `data:image/png;base64,${data.toString("base64")}`;
  } catch {
    mark = "";
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#070707",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            left: -120,
            width: 620,
            height: 620,
            borderRadius: "50%",
            background: "rgba(214,179,90,0.20)",
            filter: "blur(120px)",
          }}
        />

        {/* Text column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 24,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: 6,
              fontFamily: "monospace",
            }}
          >
            {mark ? (
              <img src={mark} width={34} height={34} alt="" />
            ) : (
              <div style={{ width: 12, height: 12, borderRadius: 12, background: "#d6b35a" }} />
            )}
            MABY CONNECT
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 82, color: "#fff", lineHeight: 1, letterSpacing: -4, display: "flex" }}>
              Matthew Adeleye
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 34,
                color: "rgba(255,255,255,0.62)",
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
              fontSize: 22,
              color: "rgba(255,255,255,0.45)",
              fontFamily: "monospace",
            }}
          >
            <span>Founder · Builder · Believer</span>
          </div>
        </div>

        {/* Portrait column */}
        {portrait ? (
          <div style={{ display: "flex", width: 430, height: "100%", position: "relative" }}>
            <img
              src={portrait}
              width={430}
              height={630}
              style={{ objectFit: "cover", width: 430, height: 630 }}
              alt=""
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, #070707 0%, rgba(7,7,7,0) 28%)",
              }}
            />
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
