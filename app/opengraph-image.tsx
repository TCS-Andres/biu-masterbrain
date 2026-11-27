import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import es from "@/content/es.json";

export const alt = es.meta.ogAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [quicksand, dmSans, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/Quicksand-Bold.ttf")),
    readFile(join(process.cwd(), "assets/DMSans-Regular.ttf")),
    readFile(join(process.cwd(), "public/brand/tcs-logo-white-text-trim.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#1C192A",
          backgroundImage:
            "radial-gradient(circle at 92% 8%, rgba(242,141,61,0.45), rgba(28,25,42,0) 45%), radial-gradient(circle at 0% 100%, rgba(43,105,216,0.45), rgba(28,25,42,0) 45%)",
          color: "#FFFFFF",
          fontFamily: "DM Sans",
        }}
      >
        <img src={logoSrc} width={244} height={80} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "#F28D3D", letterSpacing: 2, textTransform: "uppercase" }}>
            MasterClass | Aula Virtual SUJIS
          </div>
          <div style={{ fontFamily: "Quicksand", fontSize: 78, lineHeight: 1.05, marginTop: 18, maxWidth: 980 }}>
            Identidad primero, herramientas después
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.82)", marginTop: 22 }}>Master Brain</div>
        </div>
        <div style={{ display: "flex", height: 8, width: 140, backgroundColor: "#F28D3D", borderRadius: 4 }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Quicksand", data: quicksand, style: "normal", weight: 700 },
        { name: "DM Sans", data: dmSans, style: "normal", weight: 400 },
      ],
    },
  );
}
