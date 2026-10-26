import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectRoot, "dist");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await cp(path.join(projectRoot, "index.html"), path.join(outputDirectory, "index.html"));
await cp(path.join(projectRoot, "src"), path.join(outputDirectory, "src"), { recursive: true });
await cp(path.join(projectRoot, "public"), outputDirectory, { recursive: true });

const requiredFiles = [
  "index.html",
  "src/main.js",
  "src/content.js",
  "src/styles.css",
  "cv/cv-mehmet-burak-aktas-tr.pdf",
  "cv/cv-mehmet-burak-aktas-en.pdf",
  "favicon.svg"
];

for (const relativePath of requiredFiles) {
  const entry = await stat(path.join(outputDirectory, relativePath));
  if (!entry.isFile() || entry.size === 0) {
    throw new Error(`Build output is missing or empty: ${relativePath}`);
  }
}

console.log(`Static site built in ${outputDirectory}`);
