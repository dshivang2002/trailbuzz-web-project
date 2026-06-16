# Running this project locally in VS Code

This is a **TanStack Start** (React 19 + Vite) app. You can run it on your own
machine with Node.js and your own Supabase project.

## 1. Prerequisites

- [Node.js](https://nodejs.org/) 20+ (includes `npm`)
- [VS Code](https://code.visualstudio.com/)
- Optional: [Bun](https://bun.sh/) (the repo ships a `bun.lock`, but `npm` works too)

## 2. Get the code

```bash
git clone <your-repo-url>
cd <project-folder>
code .            # open in VS Code
```

## 3. Install dependencies

```bash
npm install
# or, if you use bun:
# bun install
```

## 4. Create your environment file

Copy the example file and keep your values:

```bash
cp .env.example .env
```

`.env` already contains your Supabase project values. Make sure these are set:

| Variable | Used by | Notes |
| --- | --- | --- |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | server | server-side reads |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | **keep secret**, never commit |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | public, safe to expose |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET` | admin login | set your own |
| `LOVABLE_API_KEY` | AI features | leave blank if unused |

> `.env` is git-ignored on most setups — never commit your service-role key.

## 5. Run the dev server

```bash
npm run dev
```

Open the URL it prints (usually <http://localhost:3000> or <http://localhost:5173>).

## 6. Build for production (optional)

```bash
npm run build
npm run preview
```

## Recommended VS Code extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense

## Database & migrations

SQL migrations live in `supabase/migrations/`. Apply them to your own Supabase
project using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref ofvflckcuzafsejugbgs
supabase db push
```
