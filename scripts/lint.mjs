import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { portfolio } from "../src/content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(projectRoot, "index.html"), "utf8");
const sourceFiles = [
  "index.html",
  "src/content.js",
  "src/main.js",
  "src/styles.css",
  "scripts/build.mjs",
  "scripts/serve.mjs",
  "scripts/lint.mjs"
];

assert.match(html, /^<!doctype html>/i, "index.html must declare the HTML doctype");
assert.match(html, /<html lang="tr">/, "Turkish must be the initial page language");
assert.equal((html.match(/<h1\b/g) || []).length, 1, "The page must have one primary heading");
assert.match(html, /<main\b[\s>]/, "The page must have a main landmark");
assert.match(html, /name="description"/, "The page must include an SEO description");
assert.match(html, /name="viewport"/, "The page must declare a responsive viewport");

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
const fragmentLinks = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((match) => match[1]);
for (const target of fragmentLinks) {
  assert.ok(ids.has(target), `Anchor target #${target} does not exist`);
}

for (const match of html.matchAll(/<img\b([^>]*)>/gi)) {
  assert.match(match[1], /\balt=/i, "Images must have alt text");
}

const checkedText = [];
for (const relativePath of sourceFiles) {
  const source = await readFile(path.join(projectRoot, relativePath), "utf8");
  checkedText.push(source);
  if (relativePath.endsWith(".js") || relativePath.endsWith(".mjs")) {
    const result = spawnSync(process.execPath, ["--check", path.join(projectRoot, relativePath)], { encoding: "utf8" });
    assert.equal(result.status, 0, `${relativePath} has a syntax error\n${result.stderr}`);
  }
}

const pageCopy = checkedText.join("\n");
const publicEmails = [...pageCopy.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)].map(([email]) => email);
const configuredEmail = portfolio.contact.email.trim();
if (configuredEmail) assert.match(configuredEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, "The optional contact email must be valid");
assert.deepEqual(publicEmails, configuredEmail ? [configuredEmail] : [], "Only the explicitly configured contact email may be published");
assert.doesNotMatch(pageCopy, /\b\d{11}\b/, "Identity numbers must not be included");
assert.doesNotMatch(pageCopy, /\b\d{2}[./-]\d{2}[./-]\d{4}\b/, "Dates of birth must not be included");
assert.doesNotMatch(pageCopy, /\b(?:053|054|055|050)\d{8}\b/, "Personal phone numbers must not be included");
assert.doesNotMatch(pageCopy, /CV\s*[-–—]\s*Mehmet Burak Aktaş\.pdf/i, "The source CV must not be copied to the public site");

const skill = await readFile(path.join(projectRoot, "src/content.js"), "utf8");
assert.match(skill, /editableSkillAreas/, "Editable skill areas must be defined in the portfolio data");

const unexpectedImageFiles = (await readdir(path.join(projectRoot, "public"))).filter((entry) => /\.(png|jpe?g|webp)$/i.test(entry));
assert.equal(unexpectedImageFiles.length, 0, "Unreviewed image files should not be published");

console.log("Lint checks passed.");
