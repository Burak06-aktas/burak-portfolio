---
name: vercel-web-deployment
description: Prepare, deploy, verify, and troubleshoot a website hosted on Vercel from a GitHub repository.
---

# GitHub to Vercel deployment

Use this skill when preparing or operating a website deployment from GitHub to Vercel. Follow the repository’s own instructions and deployment configuration first. This portfolio is a dependency-free static site that builds to `dist/`.

## Preflight

1. Inspect the repository status, active branch, project instructions, build configuration, and expected output directory. Confirm the exact commit intended for release.
2. Run the project’s checks locally. For this site, run `npm run lint`, `npm test`, and `npm run build`; then serve the output with `npm run preview` and inspect the page and generated assets.
3. Review `dist/` before publishing. Confirm both language versions, CV PDFs, favicon, and static assets exist. Search the output for secrets and personal information that should not be public. Never deploy the original source CV.
4. Confirm the project root and Vercel build settings match `vercel.json`: build command `npm run build`, output directory `dist`.

## Connect GitHub and configure Vercel

1. In Vercel, import the intended GitHub repository and choose its project root. Verify the connected repository and production branch before saving.
2. Use the repository settings unless Vercel detects conflicting framework settings. For this static project, use the Other framework preset, `npm run build` as the build command, and `dist` as the output directory.
3. Set only environment variables the project actually needs. This portfolio has no runtime secrets or required environment variables; do not add contact details or private data as build variables.
4. Preview the first deployment and check its build log before assigning production traffic. Keep the source branch and commit identifiable in the deployment record.

## Production verification

After the production deployment completes, open the production URL and verify:

- the home page, page title, description, and favicon load;
- Turkish is selected on first visit, and the language control updates navigation, sections, accessibility labels, and CV links in both directions;
- desktop and narrow mobile layouts, keyboard navigation, the menu button, and reduced-motion behavior work;
- section links reach their headings and there are no missing assets or browser console errors;
- each CV action opens or downloads the PDF for the selected language, and the public PDFs contain no address, phone, date of birth, identity number, or embedded email link;
- optional contact links remain absent until intentionally configured.

Check the deployment’s domain and HTTPS in Vercel. Confirm the production deployment points to the intended commit before announcing the live URL.

## Troubleshooting

- **Build fails:** Read the first actionable Vercel build error, reproduce it locally with the same Node major version, fix the source, then rerun lint, tests, build, and preview.
- **Blank page or missing files:** Check Vercel’s project root, build command, and `dist` output setting. Inspect path casing and ensure all required assets are copied by `scripts/build.mjs`.
- **CV or stylesheet returns 404:** Check the relative URL in `index.html`, the file under `public/`, and the matching `dist/` output. Redeploy only after preview confirms the corrected URL.
- **GitHub cannot be imported or updated:** Confirm the Vercel Git integration has access to the correct account, organization, repository, and branch; use the Vercel import/build logs to locate the failed step.
- **A production deployment is broken:** Identify the last known-good deployment in Vercel and restore it using the project’s rollback workflow, then fix and verify the source before another release.
- **Sensitive information is found:** Stop the release. Remove it from the public source and generated output, regenerate and inspect the affected files, then rerun the preflight checks.

Do not push commits, change GitHub settings, or create a production deployment unless the user has asked for that action in the current task.
