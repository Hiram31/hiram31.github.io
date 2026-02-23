# Personal Website (React + TypeScript + Vite)

This repository contains a personal academic/professional website built with React, TypeScript, and Vite.

## Stack

- React 18
- TypeScript 5
- Vite 5
- GitHub Actions (GitHub Pages deploy)

## Project Structure

```text
.
├── .github/workflows/deploy.yml
├── public/
│   ├── CV_latest.pdf
│   └── media/
│       ├── headshots/
│       ├── icons/
│       └── notion/
├── src/
│   ├── data/
│   │   └── profile.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Local Development

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Content Updates

Most website content is managed in:

- `src/data/profile.ts`

This includes:

- hero text and contact info
- research, education, appointments
- publications and talks
- service, funding, awards, media coverage
- social/profile links

Static files are stored in:

- `public/media/...` (images/icons)
- `public/CV_latest.pdf` (CV file served at `/CV_latest.pdf`)

To update the CV, replace `public/CV_latest.pdf` with the new version while keeping the same filename.

## Deployment (GitHub Pages)

This project includes:

- `.github/workflows/deploy.yml`

Deployment flow:

1. Push to `main`.
2. GitHub Actions builds the site.
3. Workflow deploys `dist/` to GitHub Pages.

Repository settings required:

1. Open `Settings -> Pages`.
2. Set Source to `GitHub Actions`.

## Notes

- `vite.config.ts` uses `base: "./"` for project-page compatibility.
- Build artifacts (`dist/`, `*.tsbuildinfo`) are ignored via `.gitignore`.
- Brand logos and trademarks used in links remain property of their respective owners.
