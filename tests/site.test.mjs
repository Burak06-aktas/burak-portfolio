import assert from "node:assert/strict";
import test from "node:test";
import { portfolio, translations } from "../src/content.js";

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

test("optional contact details and project examples stay unpublished until supplied", () => {
  assert.equal(portfolio.contact.email, "");
  assert.equal(portfolio.contact.linkedin, "");
  assert.deepEqual(portfolio.projects, []);
});

test("unverified technical areas are marked editable", () => {
  assert.deepEqual(portfolio.editableSkillAreas.map((area) => area.id), [
    "python",
    "machine-learning",
    "artificial-intelligence"
  ]);
  assert.ok(portfolio.editableSkillAreas.every((area) => area.editable === true));
});
