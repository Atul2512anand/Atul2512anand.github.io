# Atul Anand — Portfolio

A React + Vite portfolio that keeps itself in sync with a resume. Replace one PDF and GitHub Actions parses it, updates the site data, rebuilds and deploys — no component edits required.

**Live content is generated from [`public/resume.pdf`](public/resume.pdf).** The current data was built from `resumeatulfinal (1).pdf`.

```text
public/resume.pdf
        │
        ▼
scripts/sync_content.py ──► data/profile.json ──► React components
        ▲                         │
        │                         ▼
data/overrides.json       GitHub Actions build + deploy
data/linkedin-export.zip  (optional, private)
        │
        ▼
data/linkedin.json        (normalized, committed)
```

## Quick start

```bash
npm install

# Python is only needed for the resume parser
python -m pip install -r requirements.txt

npm run sync     # regenerate data/profile.json from public/resume.pdf
npm run dev      # http://localhost:3000
```

Build the production site:

```bash
npm run sync
npm run build
```

## Updating the portfolio (the easy way)

1. Replace `public/resume.pdf` with the new version of your resume.
   - On GitHub: **Add file → Upload files**, drop the new PDF, commit.
   - Locally: overwrite the file and run `npm run sync`.
2. That is it. The `Sync content and deploy` GitHub Action runs automatically on `main`, parses the PDF, commits the regenerated `data/profile.json`, builds the site and deploys it.

The commit from the action is marked `[skip ci]`, so it does not retrigger itself.

### What is automatic

These are regenerated from the resume every time:

- name, email, phone and LinkedIn URL from the header
- education, GPA/percentage, experience, project list, skills, certifications,
  coursework, achievements and hero statistics
- the downloadable resume itself (`/resume.pdf`)
- technologies shown in the moving “Tools & Technologies” strip

### What is preserved

Edit [`data/overrides.json`](data/overrides.json) for things a resume does not contain:

- tagline, short summary, location, profile photo
- GitHub / LinkedIn / X / Instagram links
- “Focus areas” chips
- project URLs keyed by project title
- certification issuer hints

The sync script never overwrites this file.

## LinkedIn: what is actually possible

There is **no official public LinkedIn API that lets a website read your full profile** (experience, education, skills, certifications). LinkedIn’s OpenID Connect “Sign In with LinkedIn” only exposes basic identity data such as name, email and photo. Automated scraping of the profile page is against LinkedIn’s User Agreement, is aggressively blocked, and breaks whenever LinkedIn changes its markup — so it is not a reliable foundation for a portfolio.

The supported, zero-cost route is LinkedIn’s **official data export**, which this repo already understands:

1. Open LinkedIn → **Settings & Privacy → Data privacy → Get a copy of your data**.
2. Choose the categories **Positions, Education, Skills, Certifications, Projects, Profile**.
3. Request the archive and download the ZIP.
4. Save it as `data/linkedin-export.zip` (or unzip it into `data/linkedin-export/`).
5. Run:

   ```bash
   npm run sync
   ```

6. Commit the regenerated profile **and** the normalized LinkedIn snapshot:

   ```bash
   git add data/profile.json data/linkedin.json
   git commit -m "sync LinkedIn updates"
   git push
   ```

What the merge does:

- adds LinkedIn positions, education, skills, certifications and projects that
  are not already on the resume
- matches existing entries by company/title and fills in missing dates or text
- keeps the resume authoritative for the wording and dates of roles that exist
  in both places
- tags LinkedIn-only entries with a small “LinkedIn” badge

`data/linkedin.json` is a small, normalized snapshot containing only the
professional fields used by the site (headline, summary, location, website,
positions, education, skills, certifications, projects). It is what the GitHub
Action reads on a resume-only sync, so LinkedIn additions survive later resume
updates. Re-run `npm run sync` with a fresh export to update or remove entries;
the snapshot is rewritten automatically.

The raw export is private. `data/linkedin-export.zip` and
`data/linkedin-export/` are in `.gitignore` and are never published. Do not
commit the raw export to a public repository — only commit the normalized
`data/linkedin.json` snapshot. Review that file before committing; it is safe
to publish because it contains only the professional fields listed above.

**Why the LinkedIn step is not fully hands-off:** LinkedIn does not provide a
profile API or a webhook, and the export must be requested manually. If you want
zero-touch LinkedIn updates, the only legitimate options are an authorized
LinkedIn data partner/paid enrichment service (subject to LinkedIn’s terms), or
adding those details to the resume — which the site already syncs automatically.
The resume path is fully automatic; the LinkedIn export path is one download +
one command whenever you want a refresh.

## Deploying

### GitHub Pages (included)

1. Push this repository to GitHub.
2. Go to **Settings → Pages → Build and deployment**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow manually). The site is published at
   `https://<username>.github.io/<repository>/`.

The Vite config automatically applies the repository sub-path when running in
GitHub Actions. If you use a custom domain, create a repository variable named
`VITE_BASE_PATH` with the value `/` and the workflow will build for the domain
root.

### Vercel / Netlify

- Build command: `npm run build`
- Output directory: `dist`
- Make sure `data/profile.json` is committed (run `npm run sync` before pushing),
  or add `python scripts/sync_content.py && npm run build` as the build command
  and install `requirements.txt` in the build image.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run sync` | Parse `public/resume.pdf` (+ optional LinkedIn export/snapshot) into `data/profile.json` and `data/linkedin.json` |
| `npm run sync:check` | Validate the parser output without writing files |
| `python scripts/sync_content.py --dump-sections` | Show exactly what the parser found in the PDF |
| `npm run dev` | Start Vite locally |
| `npm run dev:fresh` | Sync, then start Vite |
| `npm run build` | Production build into `dist/` |

## Project structure

```text
public/
  resume.pdf                ← canonical resume (also the download button)
  profile image.png         ← original portrait; fallback for the About section
  atul-cutout.png           ← transparent portrait used on the About band
  og.jpg                    ← 1200×630 social preview card
data/
  profile.json              ← generated; do not edit by hand
  linkedin.json             ← normalized public LinkedIn snapshot (optional)
  overrides.json            ← your stable manual details
scripts/
  sync_content.py           ← PDF + LinkedIn → profile.json
.github/workflows/
  sync-and-deploy.yml       ← sync, commit, build, deploy to Pages
components/                 ← React UI
index.css                   ← custom design system (no Tailwind)
constants.ts                ← loads profile.json and maps tool icons
types.ts                    ← profile schema
```

## Design notes

The site is a bold editorial layout built on a warm paper background, oversized
DM Sans type, DM Mono labels, sharp colour bands and a cutout portrait. There is
no Tailwind build step or CDN: everything lives in `index.css`.

- Fonts are self-hosted through `@fontsource/dm-sans` and `@fontsource/dm-mono`
  so there is no external Google Fonts request.
- `public/atul-cutout.png` is the transparent portrait on the yellow About band.
  If it ever fails to load, the component falls back to `profile image.png`.
  Rebuild it from the original portrait with
  `python scripts/make_cutout.py` (requires Pillow).
- Social sharing uses `public/og.jpg`, a 1200×630 crop of the hero. Regenerate it
  if the hero copy or portrait changes.
- Motion is limited to IntersectionObserver reveals and one CSS marquee, and is
  disabled when the visitor prefers reduced motion.

## If the parser misses something

The parser is tuned for a standard single/two-column resume with the usual
sections (`Education`, `Work Experience`, `Technical Skills`, `Projects`,
`Certifications`, `Relevant Courses`). If you redesign the resume heavily:

1. Run `python scripts/sync_content.py --dump-sections` and check the section
   names/bullets.
2. Adjust `SECTION_ALIASES` or the relevant `parse_*` function in
   `scripts/sync_content.py`.
3. Add anything that is not on the resume to `data/overrides.json` instead of
   editing `data/profile.json`.

`npm run sync:check` fails loudly if it cannot find education, experience or
projects, so a broken parse will not silently wipe the site.

## Tech stack

React 19, Vite 6, TypeScript, custom CSS, self-hosted DM Sans/DM Mono
(`@fontsource`), lucide-react, PyMuPDF.
