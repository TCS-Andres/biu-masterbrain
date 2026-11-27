// The shape of the questionnaire. Copy (labels, placeholders) lives in content/*.json.

export type FieldId =
  | "voice_words"
  | "voice_never"
  | "voice_audience"
  | "voice_sample"
  | "values_principles"
  | "values_trust"
  | "values_story"
  | "vp_who"
  | "vp_what"
  | "vp_outcome"
  | "vp_proof"
  | "limits_never"
  | "limits_ask"
  | "limits_disclosure";

export type FieldType = "short" | "long" | "select";
export type FieldDef = { id: FieldId; type: FieldType; optional?: boolean };

export type DisclosureValue = "always" | "asked" | "caseByCase";
export const DISCLOSURE_OPTIONS: DisclosureValue[] = ["always", "asked", "caseByCase"];

export type RoundKey = "voice" | "values" | "vp" | "limits";
export type RoundDef = { key: RoundKey; n: number; fields: FieldDef[] };

export const ROUNDS: RoundDef[] = [
  {
    key: "voice",
    n: 1,
    fields: [
      { id: "voice_words", type: "short" },
      { id: "voice_never", type: "short" },
      { id: "voice_audience", type: "short" },
      { id: "voice_sample", type: "long", optional: true },
    ],
  },
  {
    key: "values",
    n: 2,
    fields: [
      { id: "values_principles", type: "long" },
      { id: "values_trust", type: "short" },
      { id: "values_story", type: "long", optional: true },
    ],
  },
  {
    key: "vp",
    n: 3,
    fields: [
      { id: "vp_who", type: "short" },
      { id: "vp_what", type: "short" },
      { id: "vp_outcome", type: "short" },
      { id: "vp_proof", type: "long", optional: true },
    ],
  },
  {
    key: "limits",
    n: 4,
    fields: [
      { id: "limits_never", type: "long" },
      { id: "limits_ask", type: "long" },
      { id: "limits_disclosure", type: "select" },
    ],
  },
];

export const ALL_FIELDS: FieldDef[] = ROUNDS.flatMap((r) => r.fields);
export const REQUIRED_FIELDS: FieldDef[] = ALL_FIELDS.filter((f) => !f.optional);

export type Answers = Partial<Record<FieldId, string>>;

export function hasValue(a: Answers, id: FieldId): boolean {
  return (a[id] ?? "").trim().length > 0;
}

export function countRequired(a: Answers, fields: FieldDef[] = REQUIRED_FIELDS) {
  const req = fields.filter((f) => !f.optional);
  return { done: req.filter((f) => hasValue(a, f.id)).length, total: req.length };
}

/** Copy unlocks once every required field in Round 1 and Round 4 has content. */
export function canCopyPrompt(a: Answers): boolean {
  return ROUNDS.filter((r) => r.key === "voice" || r.key === "limits")
    .flatMap((r) => r.fields)
    .filter((f) => !f.optional)
    .every((f) => hasValue(a, f.id));
}

/** Only keeps known fields with string values, so old or tampered storage cannot break the page. */
export function sanitizeAnswers(raw: unknown): Answers {
  const out: Answers = {};
  if (!raw || typeof raw !== "object") return out;
  for (const f of ALL_FIELDS) {
    const v = (raw as Record<string, unknown>)[f.id];
    if (typeof v !== "string") continue;
    if (f.type === "select" && !DISCLOSURE_OPTIONS.includes(v as DisclosureValue)) continue;
    out[f.id] = v;
  }
  return out;
}
