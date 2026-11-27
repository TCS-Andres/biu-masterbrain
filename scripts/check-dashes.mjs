// Fails if the em dash character appears in any project text file.
import fs from "node:fs";
import path from "node:path";

const EM_DASH = String.fromCharCode(0x2014);
const skipDirs = new Set(["node_modules", ".next", ".git", ".vercel", "out"]);
const textExt = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".json", ".md", ".css", ".html", ".txt", ".yml", ".yaml", ".example", ""]);
const hits = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (textExt.has(path.extname(entry.name)) || entry.name.startsWith(".")) {
      const lines = fs.readFileSync(p, "utf8").split("\n");
      lines.forEach((line, i) => {
        if (line.includes(EM_DASH)) hits.push(`${p}:${i + 1}`);
      });
    }
  }
}

walk(process.cwd());
if (hits.length) {
  console.error("Em dashes found:\n" + hits.join("\n"));
  process.exit(1);
}
console.log("check:dashes clean");
