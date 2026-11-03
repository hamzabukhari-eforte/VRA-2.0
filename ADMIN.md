# VRA Admin Panel

Admin UI lives in `apps/web` at `/admin`. APIs live in `apps/api` under `/api/admin/*` (proxied from the web app).

## Local setup

1. Start VRA Supabase: `cd ../vra-supabase && supabase start` (API `54341`, DB `54342`, Studio `54343`).
2. In root `.env` set:
   - `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54341`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` from `supabase status`
   - `DATABASE_URL` / `DIRECT_URL` → `postgresql://postgres:postgres@127.0.0.1:54342/postgres`
   - `BUCKET_NAME=vra`
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`
   - `WEB_PORT=7000`, `API_PORT=7001`, `API_PROXY_URL=http://localhost:7001`
3. `pnpm install && pnpm db:push && pnpm db:seed`
4. Ensure storage bucket `vra` exists (Studio → Storage).
5. `pnpm dev` → open http://localhost:7000/admin

## What’s implemented

- Section images, homepage gallery/crowd/teams/sponsors, about board, VRA cricket carousel/counts
- Submissions tables (contact, membership, termination, donation, net booking) with filters/export
- Form POST endpoints under `/api/submissions/*`
- Admin auth via `admin_session` cookie (HMAC of `ADMIN_EMAIL:ADMIN_PASSWORD`)

## Data rules

- One stored file per section key; frontend falls back to static assets when CMS image is missing
- Updating an admin image updates every page that uses that section key
