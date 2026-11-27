// Fails if any key exists in one language file but not the other.
// Also reports (without failing) how many Spanish strings still match English,
// so it is easy to see what is left to translate.
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "content");
const load = (f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));

function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}

const en = flatten(load("en.json"));
const es = flatten(load("es.json"));

const missingInEs = Object.keys(en).filter((k) => !(k in es));
const missingInEn = Object.keys(es).filter((k) => !(k in en));
const typeMismatch = Object.keys(en).filter((k) => k in es && typeof en[k] !== typeof es[k]);
const emptyEs = Object.keys(es).filter((k) => typeof es[k] === "string" && es[k] === "" && en[k] !== "");

let failed = false;
const report = (label, list) => {
  if (!list.length) return;
  failed = true;
  console.error(`\n${label} (${list.length}):`);
  for (const k of list) console.error(`  ${k}`);
};

report("Missing in es.json", missingInEs);
report("Missing in en.json", missingInEn);
report("Type mismatch", typeMismatch);
report("Empty in es.json but not in en.json", emptyEs);

const total = Object.keys(en).length;
const untranslated = Object.keys(en).filter((k) => es[k] === en[k] && en[k] !== "").length;

if (failed) {
  console.error("\ncheck:i18n FAILED");
  process.exit(1);
}
console.log(`check:i18n passed: ${total} keys in both files.`);
console.log(`Note: ${untranslated} of ${total} Spanish strings are still identical to English.`);
