import type { Dict, Lang } from "./i18n";
import { ROUNDS, type Answers, type DisclosureValue } from "./builder";
import { fmt } from "./format";

const NAVY = "#1C192A";
const ORANGE = "#F28D3D";
const INK = "#4A4658";
const MIST = "#EDECF1";

type JsPdf = import("jspdf").jsPDF;

async function fetchBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load ${url}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** Embeds Quicksand and DM Sans. Returns false if they could not be loaded. */
async function registerFonts(doc: JsPdf): Promise<boolean> {
  try {
    const [qsBold, dmRegular, dmBold] = await Promise.all([
      fetchBase64("/fonts/Quicksand-Bold.ttf"),
      fetchBase64("/fonts/DMSans-Regular.ttf"),
      fetchBase64("/fonts/DMSans-Bold.ttf"),
    ]);
    doc.addFileToVFS("Quicksand-Bold.ttf", qsBold);
    doc.addFont("Quicksand-Bold.ttf", "Quicksand", "bold");
    doc.addFileToVFS("DMSans-Regular.ttf", dmRegular);
    doc.addFont("DMSans-Regular.ttf", "DMSans", "normal");
    doc.addFileToVFS("DMSans-Bold.ttf", dmBold);
    doc.addFont("DMSans-Bold.ttf", "DMSans", "bold");
    return true;
  } catch {
    return false;
  }
}

/**
 * Builds "My Master Brain" as a PDF with the user's answers only (not the prompt)
 * and downloads it. Everything happens in the browser.
 */
export async function downloadAnswersPdf(answers: Answers, t: Dict, lang: Lang): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const fontsOk = await registerFonts(doc);
  const heading = (size: number) => {
    if (fontsOk) doc.setFont("Quicksand", "bold");
    else doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
  };
  const body = (size: number, bold = false) => {
    if (fontsOk) doc.setFont("DMSans", bold ? "bold" : "normal");
    else doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
  };

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 56;
  const maxW = W - M * 2;
  const bottom = H - 64;

  // Cover band: the navy banner logo, cropped to its center band.
  let y = 0;
  try {
    const band = await fetchBase64("/brand/tcs-pdf-cover-band.jpg");
    const bandH = (W * 315) / 1400;
    doc.addImage("data:image/jpeg;base64," + band, "JPEG", 0, 0, W, bandH);
    y = bandH;
  } catch {
    doc.setFillColor(NAVY);
    doc.rect(0, 0, W, 120, "F");
    y = 120;
  }

  y += 52;
  heading(30);
  doc.setTextColor(NAVY);
  doc.text(t.pdf.title, M, y);

  y += 14;
  doc.setDrawColor(ORANGE);
  doc.setLineWidth(3);
  doc.line(M, y, M + 64, y);

  y += 26;
  body(13);
  doc.setTextColor(INK);
  doc.text(t.pdf.subtitle, M, y);
  y += 18;
  body(10);
  doc.text(t.pdf.event, M, y);
  y += 15;
  const date = new Date().toLocaleDateString(lang === "es" ? "es-US" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(fmt(t.pdf.created, { date }), M, y);
  y += 40;

  const ensure = (needed: number) => {
    if (y + needed > bottom) {
      doc.addPage();
      y = M + 8;
    }
  };

  const disclosureLabel = (v: string) => {
    const key = v as DisclosureValue;
    return key === "always" || key === "asked" || key === "caseByCase" ? t.fields.limits_disclosure[key] : v;
  };

  const roundTitles = [t.builder.round1Title, t.builder.round2Title, t.builder.round3Title, t.builder.round4Title];

  ROUNDS.forEach((round, i) => {
    const answered = round.fields.filter((f) => (answers[f.id] ?? "").trim());
    if (!answered.length) return;

    ensure(70);
    doc.setFillColor(ORANGE);
    doc.rect(M, y - 13, 4, 18, "F");
    heading(17);
    doc.setTextColor(NAVY);
    doc.text(roundTitles[i], M + 14, y);
    y += 12;
    doc.setDrawColor(MIST);
    doc.setLineWidth(1);
    doc.line(M, y, W - M, y);
    y += 22;

    for (const f of answered) {
      const raw = (answers[f.id] ?? "").trim();
      const value = f.type === "select" ? disclosureLabel(raw) : raw;

      body(9.5, true);
      doc.setTextColor(INK);
      const labelLines = doc.splitTextToSize(t.fields[f.id].label, maxW) as string[];
      ensure(labelLines.length * 13 + 30);
      for (const l of labelLines) {
        doc.text(l, M, y);
        y += 13;
      }
      y += 3;

      body(11.5);
      doc.setTextColor(NAVY);
      const valueLines = doc.splitTextToSize(value, maxW) as string[];
      for (const l of valueLines) {
        ensure(16);
        doc.text(l, M, y);
        y += 16;
      }
      y += 14;
    }
    y += 10;
  });

  // Footer on every page.
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setDrawColor(ORANGE);
    doc.setLineWidth(1);
    doc.line(M, H - 44, W - M, H - 44);
    body(8.5);
    doc.setTextColor(INK);
    doc.text(t.pdf.footer, M, H - 30);
    const label = fmt(t.pdf.page, { n: p, total: pages });
    doc.text(label, W - M - doc.getTextWidth(label), H - 30);
  }

  doc.setProperties({ title: t.pdf.title, author: "The Creative Strategist", subject: t.pdf.subtitle });
  doc.save(t.pdf.fileName);
}
