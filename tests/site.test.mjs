import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { portfolio, translations } from "../src/content.js";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("Turkish and English provide the same interface keys", () => {
  assert.deepEqual(Object.keys(translations.tr).sort(), Object.keys(translations.en).sort());
  for (const language of Object.keys(translations)) {
    for (const [key, value] of Object.entries(translations[language])) {
      assert.equal(typeof value, "string", `${language}.${key} must be a string`);
    }
  }
});

test("the verified internship and education facts match the CV", () => {
  assert.equal(portfolio.experience.company, "Küçükpazarlı Kardeşler Kalıp ve Mak. San. Ltd. Şti.");
  assert.equal(portfolio.experience.period.tr, "Eylül 2024 — Haziran 2025");
  assert.equal(portfolio.experience.period.en, "September 2024 — June 2025");
  assert.deepEqual(portfolio.verifiedSkills[0], {
    tr: "Boeing parça montajı",
    en: "Boeing parts assembly"
  });
  assert.equal(portfolio.education.length, 2);
});

test("the supplied email is available while optional LinkedIn and project examples stay unpublished", () => {
  assert.equal(portfolio.contact.email, "m.burakk0644@gmail.com");
  assert.equal(portfolio.contact.linkedin, "");
  assert.deepEqual(portfolio.projects, []);
});

test("unverified technical focus areas are marked editable", () => {
  assert.deepEqual(portfolio.editableSkillAreas.map((area) => area.id), [
    "python",
    "machine-learning",
    "data-analysis",
    "aircraft-maintenance"
  ]);
  assert.ok(portfolio.editableSkillAreas.every((area) => area.editable === true));
  assert.ok(portfolio.editableSkillAreas.every((area) => area.category.tr && area.category.en));
});

test("the requested local aviation image is present for the production build", async () => {
  const imagePath = path.join(projectRoot, "public/images/aviation-hud-blueprint.png");
  const imageInfo = await stat(imagePath);
  assert.ok(imageInfo.isFile());
  assert.ok(imageInfo.size > 0);
});
