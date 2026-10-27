import { portfolio, translations } from "./content.js";

const supportedLanguages = Object.keys(translations);
const languageButtons = [...document.querySelectorAll("[data-language]")];
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const educationList = document.querySelector("#education-list");
const skillAreas = document.querySelector("#skill-areas");
const contactLinks = document.querySelector("#contact-links");
const projectsContent = document.querySelector("#projects-content");
const verifiedSkill = document.querySelector("#verified-skill");
const experiencePeriod = document.querySelector("#experience-period");
const experienceCompany = document.querySelector("#experience-company");
const cvView = document.querySelector("#cv-view");
const cvDownload = document.querySelector("#cv-download");
let activeLanguage = "tr";

document.documentElement.classList.add("js-enabled");

function translatePage(language) {
  const dictionary = translations[language];

  document.documentElement.lang = language;
  document.title = dictionary["meta.title"];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (dictionary[key] !== undefined) element.textContent = dictionary[key];
  });

  document.querySelectorAll("[data-i18n-content]").forEach((element) => {
    const key = element.dataset.i18nContent;
    if (dictionary[key] !== undefined) element.setAttribute("content", dictionary[key]);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (dictionary[key] !== undefined) element.setAttribute("aria-label", dictionary[key]);
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderEducation(language, dictionary);
  renderSkills(language, dictionary);
  renderProjects(language, dictionary);
  renderContacts(language, dictionary);
  verifiedSkill.textContent = portfolio.verifiedSkills[0][language];
  experiencePeriod.textContent = portfolio.experience.period[language].toLocaleUpperCase(language === "tr" ? "tr-TR" : "en-US");
  experienceCompany.textContent = portfolio.experience.company;
  updateCvLinks(language);
  activeLanguage = language;
}

function renderEducation(language, dictionary) {
  educationList.replaceChildren();

  portfolio.education.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "education-card";

    const number = document.createElement("span");
    number.className = "education-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = `0${index + 1}`;

    const copy = document.createElement("div");
    copy.className = "education-copy";

    const institution = document.createElement("h3");
    institution.textContent = item.institution[language];

    const program = document.createElement("p");
    program.className = "education-program";
    program.textContent = dictionary[item.program];

    copy.append(institution, program);

    const dateText = dictionary[item.date];
    if (dateText) {
      const date = document.createElement("p");
      date.className = "education-date";
      date.textContent = dateText;
      article.append(number, copy, date);
    } else {
      article.append(number, copy);
    }

    educationList.append(article);
  });
}

function renderSkills(language, dictionary) {
  skillAreas.replaceChildren();

  portfolio.editableSkillAreas
    .filter((item) => item.editable)
    .forEach((item, index) => {
      const card = document.createElement("li");
      card.className = "skill-area-card";

      const meta = document.createElement("div");
      meta.className = "skill-area-meta";
      const category = document.createElement("span");
      category.className = "skill-area-category";
      category.textContent = item.category[language];
      const number = document.createElement("span");
      number.className = "skill-area-number";
      number.setAttribute("aria-hidden", "true");
      number.textContent = `0${index + 1}`;
      meta.append(category, number);

      const label = document.createElement("h4");
      label.className = "skill-area-title";
      label.textContent = item[language];

      const status = document.createElement("span");
      status.className = "skill-tag-status";

      const statusDot = document.createElement("span");
      statusDot.className = "skill-area-status-dot";
      statusDot.setAttribute("aria-hidden", "true");
      const statusLabel = document.createElement("span");
      statusLabel.textContent = dictionary["skills.focusLabel"];
      status.replaceChildren(statusDot, statusLabel);

      card.append(meta, label, status);
      skillAreas.append(card);
    });
}

function renderProjects(language, dictionary) {
  if (portfolio.projects.length > 0) {
    projectsContent.classList.add("has-projects");
    projectsContent.replaceChildren();

    portfolio.projects.forEach((project) => {
      const article = document.createElement("article");
      article.className = "project-card";
      const title = document.createElement("h3");
      title.textContent = project.title[language];
      const description = document.createElement("p");
      description.textContent = project.description[language];
      article.append(title, description);

      if (isPublicHttpsUrl(project.url)) {
        const link = document.createElement("a");
        link.className = "project-link";
        link.href = project.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = dictionary["projects.open"];
        article.append(link);
      }

      projectsContent.append(article);
    });
    return;
  }

  projectsContent.classList.remove("has-projects");
  projectsContent.replaceChildren();
  const orbit = document.createElement("span");
  orbit.className = "empty-orbit";
  orbit.setAttribute("aria-hidden", "true");
  orbit.append(document.createElement("span"));

  const copy = document.createElement("div");
  const label = document.createElement("p");
  label.className = "empty-label";
  label.textContent = dictionary["projects.emptyLabel"];
  const title = document.createElement("h3");
  title.textContent = dictionary["projects.emptyTitle"];
  const note = document.createElement("p");
  note.textContent = dictionary["projects.emptyNote"];
  copy.append(label, title, note);

  const index = document.createElement("span");
  index.className = "empty-index";
  index.setAttribute("aria-hidden", "true");
  index.textContent = "— / —";

  projectsContent.append(orbit, copy, index);
}

function renderContacts(language, dictionary) {
  const entries = [];
  const email = portfolio.contact.email.trim();
  const linkedin = portfolio.contact.linkedin.trim();

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    entries.push({ href: `mailto:${email}`, label: dictionary["contact.email"], value: email });
  }

  if (isLinkedInProfile(linkedin)) {
    entries.push({ href: linkedin, label: dictionary["contact.linkedin"], external: true });
  }

  contactLinks.replaceChildren();

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "contact-empty";
    empty.textContent = dictionary["contact.empty"];
    contactLinks.append(empty);
    return;
  }

  entries.forEach((entry) => {
    const link = document.createElement("a");
    link.className = "contact-link";
    link.href = entry.href;
    link.textContent = entry.value || entry.label;
    if (entry.value) link.setAttribute("aria-label", `${entry.label}: ${entry.value}`);
    if (entry.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    contactLinks.append(link);
  });
}

function isLinkedInProfile(value) {
  try {
    const parsed = new URL(value);
    return ["linkedin.com", "www.linkedin.com"].includes(parsed.hostname) && parsed.protocol === "https:" && parsed.pathname.startsWith("/in/");
  } catch {
    return false;
  }
}

function isPublicHttpsUrl(value) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function updateCvLinks(language) {
  const suffix = language === "en" ? "en" : "tr";
  const href = `./cv/cv-mehmet-burak-aktas-${suffix}.pdf`;
  cvView.href = href;
  cvDownload.href = href;
  cvDownload.download = `Mehmet-Burak-Aktas-CV-${suffix.toUpperCase()}.pdf`;
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextLanguage = button.dataset.language;
    if (supportedLanguages.includes(nextLanguage) && nextLanguage !== activeLanguage) {
      translatePage(nextLanguage);
    }
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", translations[activeLanguage][isOpen ? "a11y.menu" : "a11y.closeMenu"] || translations[activeLanguage]["a11y.menu"]);
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", translations[activeLanguage]["a11y.menu"]);
    navLinks.classList.remove("is-open");
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

translatePage("tr");
