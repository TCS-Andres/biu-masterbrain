import type { Dict } from "./i18n";
import type { Answers, DisclosureValue, FieldId } from "./builder";
import { fmt } from "./format";

const DISCLOSURE_KEY: Record<DisclosureValue, "disclosureAlways" | "disclosureAsked" | "disclosureCaseByCase"> = {
  always: "disclosureAlways",
  asked: "disclosureAsked",
  caseByCase: "disclosureCaseByCase",
};

/** Trims a value. Line breaks inside long answers are kept as typed. */
function val(a: Answers, id: FieldId): string {
  return (a[id] ?? "").trim();
}

/** Drops trailing punctuation so a value can sit inside a sentence. */
function clause(s: string): string {
  return s.replace(/[\s.;,:]+$/, "");
}

/**
 * Builds the copy-paste prompt in the selected language.
 * Empty fields are left out, and a section with no answers is left out entirely.
 * Returns an empty string when there is nothing to assemble yet.
 */
export function buildPrompt(a: Answers, t: Dict): string {
  const p = t.prompt;
  const sections: string[] = [];

  const line = (label: string, id: FieldId): string | null => {
    const v = val(a, id);
    return v ? `${label}: ${v}` : null;
  };

  const section = (heading: string, lines: (string | null)[]) => {
    const kept = lines.filter((l): l is string => Boolean(l));
    if (kept.length) sections.push([heading, ...kept].join("\n"));
  };

  section(p.voiceHeading, [
    line(p.voice_words, "voice_words"),
    line(p.voice_never, "voice_never"),
    line(p.voice_audience, "voice_audience"),
    line(p.voice_sample, "voice_sample"),
  ]);

  section(p.valuesHeading, [
    line(p.values_principles, "values_principles"),
    line(p.values_trust, "values_trust"),
    line(p.values_story, "values_story"),
  ]);

  const who = clause(val(a, "vp_who"));
  const what = clause(val(a, "vp_what"));
  const outcome = clause(val(a, "vp_outcome"));
  const vpLines: (string | null)[] =
    who && what && outcome
      ? [fmt(p.vpSentence, { vp_who: who, vp_what: what, vp_outcome: outcome })]
      : [line(p.vp_who, "vp_who"), line(p.vp_what, "vp_what"), line(p.vp_outcome, "vp_outcome")];
  vpLines.push(line(p.vp_proof, "vp_proof"));
  section(p.vpHeading, vpLines);

  const disclosure = val(a, "limits_disclosure") as DisclosureValue | "";
  const disclosureText = disclosure && DISCLOSURE_KEY[disclosure] ? p[DISCLOSURE_KEY[disclosure]] : "";
  section(p.limitsHeading, [
    line(p.limits_never, "limits_never"),
    line(p.limits_ask, "limits_ask"),
    disclosureText ? `${p.limits_disclosure}: ${disclosureText}` : null,
  ]);

  if (!sections.length) return "";

  const rules = [p.rulesHeading, `1. ${p.rule1}`, `2. ${p.rule2}`, `3. ${p.rule3}`, `4. ${p.rule4}`, `5. ${p.rule5}`].join(
    "\n",
  );

  return [p.intro, ...sections, rules, p.closing].join("\n\n");
}
