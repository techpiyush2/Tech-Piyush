# Piyush Shah — portfolio-2025 setup

Your personal copy is wired into David Heckhoff's 3D portfolio template. **Only content was changed** — the 3D room, shaders, and scroll experience are unchanged.

## Run locally

```bash
cd portfolio-2025-main
npm install
npm run dev
```

Open **http://localhost:4000**

## Your data lives in

| File                                          | What                                         |
| --------------------------------------------- | -------------------------------------------- |
| `src/content/profile.ts`                      | Name, email                                  |
| `src/content/social.ts`                       | Social links                                 |
| `src/content/resume.ts`                       | Services, experience, skill bars, tech stack |
| `src/i18n/messages/namespaces/common/en.json` | UI copy (EN)                                 |
| `src/i18n/messages/namespaces/common/de.json` | UI copy (DE)                                 |
| `src/content/projects/en/*.ts`                | Project case studies                         |
| `src/content/projects/previews/en.ts`         | Project grid thumbnails                      |
| `public/works/*.svg`                          | Project preview images                       |

## Page sections (scroll order)

1. **Hero + 3D About** — hologram UI in the WebGL room
2. **Projects** — your 6 works
3. **Experience** — education + work timelines + stats
4. **Skills** — progress bars, about copy, tech stack (dark cyan theme)
5. **Contact** — 3D contact scene + email + social

## 3D assets required

This repo does **not** include GLB models/textures (they are large). Download them from the [original portfolio repository](https://github.com/davidhckh/portfolio-2025) and place them under:

- `src/assets/models/` — `avatar.glb`, `lab.glb`, `room.glb`, `contact.glb`
- `src/assets/textures/` — textures referenced in `src/sources.ts`
- `src/assets/images/projects/` — optional case-study screenshots
- `sounds/` — audio files (see `sounds/README.md`)

Without these files, `npm run dev` will fail on missing imports.

## Attribution

Per the template license, footer credit to [David Heckhoff](https://david-hckh.com/) is kept for the 3D experience concept.
