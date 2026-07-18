# Portfolio Frontend

React + Vite frontend for your portfolio. Dark, terminal-inspired design with a
custom animated cursor, a typed boot-sequence hero, and a full admin dashboard
that talks to `portfolio-backend`.

## Design

- **Theme:** dev-console aesthetic — blue-black surface, dual accent (cyan +
  amber), green reserved for status indicators only.
- **Type:** JetBrains Mono for display/data, Inter for body copy.
- **Nav:** filepath-style section links (`~/about`, `~/skills`, `~/work`, `~/contact`).
- **Signature element:** the custom cursor — a terminal block-cursor with a
  fading signal trail that morphs into a dashed bracket over links/buttons and
  a blinking I-beam over text. Automatically disabled on touch devices and for
  users with reduced-motion preferences.
- **Hero:** a real typed terminal sequence (`whoami`, `cat mission.txt`,
  `status --check`) built from your live profile data.

## 1. Setup

You need `portfolio-backend` running first (see its own README).

```bash
cd portfolio-frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend isn't running on the default `http://localhost:5000`.

## 2. Run

```bash
npm run dev
```

Open `http://localhost:5173`. The public site pulls live data from your
backend's `/api/profile`, `/api/skills`, and `/api/projects` endpoints.

## 3. Use the admin dashboard

Go to `http://localhost:5173/admin/login` (also linked from the site footer)
and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in the backend's
`.env`. From there you can:

- **Skills** — drag the percentage slider (saves on release), add new skills,
  delete old ones.
- **Projects** — add/edit/delete, set featured status, manage tech stack tags.
- **Profile** — edit your summary, contact links, education, soft skills,
  achievements, and languages. This is what feeds the hero terminal and about
  section.

Changes appear on the public site immediately (just refresh).

## 4. Build for production

```bash
npm run build
```

Outputs static files to `dist/`. Deploy `dist/` to Vercel, Netlify, or any
static host — same as your backend resume already lists (Vercel/Render).
Remember to set `VITE_API_URL` to your deployed backend's URL as an
environment variable at build time.

## Notes

- The custom cursor hides the native cursor only on devices with a fine
  pointer (desktop mice/trackpads) — it never interferes with touchscreens.
- All write actions (add/edit/delete) require the admin session cookie set by
  the backend; the public pages never require login.
- If you see "Couldn't reach the backend API" on load, confirm the backend is
  running and `VITE_API_URL` in `.env` points to it, and that the backend's
  `CLIENT_URL` matches this app's origin (for CORS).
