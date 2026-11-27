# BIU Master Brain

Single-page site for the MasterClass "Identidad primero, herramientas después: el Master Brain profesional para usar la IA con criterio", presented at Aula Virtual SUJIS, Broward International University, on Wednesday, December 2, 2026.

Visitors read what a Master Brain is, answer a short questionnaire, copy one prompt that loads their Master Brain into Claude, ChatGPT or Gemini, use ready-made prompts, learn who Andres is and can book a 30-minute call.

Everything runs in the browser. There is no database, no accounts and no server-side storage of answers.

## Run it locally

You need Node 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3011. Change the port with `PORT=4000 npm run dev`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3011 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build on port 3011 |
| `npm run lint` | ESLint (Next.js core web vitals and TypeScript rules) |
| `npm run typecheck` | TypeScript check |
| `npm run check:i18n` | Fails if any key is missing in `content/es.json` or `content/en.json` |
| `npm run check:dashes` | Fails if an em dash appears anywhere in the project |

## Edit the copy

Every visible string lives in two files with the same keys:

- `content/es.json` for Spanish (the default language)
- `content/en.json` for English

Components never hard-code text. Change a string in the JSON file, save, and the page updates.

A few notes:

- Text inside `{curly}` braces is filled in by the page, for example `{done} of {total} required answers`. Keep the braces and the word inside them.
- The `prompt` block is the template for the copy-paste prompt. Each language has its own version, and the page uses the one for the language the visitor picked.
- Links, the Calendly URL and the email address live in `config/site.ts`.

## Add the Spanish strings

`content/es.json` currently holds the English copy so the site runs, except for the pieces that were already written in Spanish: the page title, the BIU credit line and the full prompt template.

To add the approved Spanish copy:

1. Open `content/es.json`.
2. Replace each English value with its Spanish version. Do not rename or delete keys.
3. Run `npm run check:i18n`. It fails if a key is missing in either file and tells you how many Spanish strings still match the English ones.
4. Run `npm run check:dashes` to make sure no em dash slipped in.

TypeScript also checks `es.json` against `en.json`, so `npm run build` fails if the two files drift apart.

## Language switch

- Spanish is the default.
- The ES | EN toggle in the header switches every string, including the generated prompt.
- The choice is remembered in `localStorage`.
- `?lang=en` and `?lang=es` in the URL override the saved choice.

## Answers and privacy

- All answers are saved in `localStorage` under the single key `biu_masterbrain_v1`.
- If the browser blocks storage, answers stay in memory for the visit and the page shows a short notice.
- "Clear all answers" asks for confirmation in a dialog on the page, then wipes the key.
- The PDF is generated in the browser with jsPDF and contains only the answers, not the prompt.
- Vercel Web Analytics records page views only. The URL is reduced to origin and path before it is sent, and no answers, prompts or field text are ever sent anywhere.

## BIU logo

The BIU logo is off by default. BIU is credited in text only.

When Andres has written permission from Broward International University:

1. Add the logo file as `public/brand/biu-logo.png`.
2. Set `SHOW_BIU_LOGO = true` in `config/site.ts`.

## Brand assets

- `public/brand/` holds The Creative Strategist logos: navy banner, black text, gradient and white text, plus trimmed web versions and the PDF cover band.
- `public/andres.jpg` is the headshot used in the deck.
- `public/fonts/` holds Quicksand and DM Sans TTF files used to embed the brand fonts in the PDF.
- `assets/` holds the fonts used to draw the Open Graph image.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_NOINDEX` | `true` | Keeps the page out of search engines. Set it to `false` after the event to allow indexing, then redeploy. |
| `NEXT_PUBLIC_SITE_URL` | `https://biu-masterbrain.vercel.app` | Public URL used for Open Graph links. |

Copy `.env.example` to `.env.local` to set them locally.

## Deploy

The project deploys on Vercel, team `the-creative-strategist`, project `biu-masterbrain`.

- Pushing to `main` on GitHub deploys to production at https://biu-masterbrain.vercel.app.
- Every pull request gets its own preview URL.
- To deploy from your machine instead: `vercel --prod` (after `vercel link`).

Set the environment variables in the Vercel project settings. Web Analytics must be turned on in the project's Analytics tab for page views to show up.

## Security headers

`next.config.ts` sends `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY` and a `Permissions-Policy`. The CSP allows the Calendly inline widget and Vercel Web Analytics. If you add another third-party script, add its host to the CSP first.

## Calendly

The "Book a 30-minute call" buttons open https://calendly.com/andres-hdw/30min in a new tab. The inline calendar below the button only loads when that section is close to the screen. If the Calendly script is blocked or never draws, the calendar hides itself and the button stays as the way to book.

The Creative Strategist. Built with Excellence.
