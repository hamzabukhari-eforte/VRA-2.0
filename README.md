# VRA 2.0 (pnpm monorepo)

Next.js frontend + NestJS API + Prisma, against a dedicated local Supabase stack.

## Structure

```text
apps/web     Next.js (public site + /admin) — port 7000
apps/api     NestJS (all /api/* routes) — port 7001
libs/db      Prisma schema / client (@vra/db)
```

Sibling Supabase project: `../vra-supabase` (does not share Yuasa or eforte ports).

## Ports

| Service | Port |
|---|---|
| Web | 7000 |
| API | 7001 |
| Supabase API | 54341 |
| Supabase DB | 54342 |
| Supabase Studio | 54343 |
| Mailpit | 54344 |

> Note: 54331–54337 were already used by another local Supabase (`eforte`), so VRA uses **54341+**. Yuasa remains on **54321+**.

Browser calls stay same-origin (`http://localhost:7000/api/...`); Next rewrites them to Nest on 7001.

## Prerequisites

- Node 20+
- pnpm
- Docker
- Supabase CLI (`npm i -g supabase`)

## Setup

```bash
# 1) Start local Supabase (from sibling folder)
cd ../vra-supabase && supabase start
# copy ANON_KEY + SERVICE_ROLE_KEY from the output into VRA-2.0/.env

# 2) App env
cd ../VRA-2.0
cp .env.example .env   # then fill keys / admin password / SMTP as needed

# 3) Install + DB
pnpm install
pnpm db:push
pnpm db:seed

# 4) Create storage bucket "vra" in Studio (http://127.0.0.1:54343) if missing
#    (setup script also creates it via Storage API when keys are set)

# 5) Dev
pnpm dev
```

- Site: http://localhost:7000  
- Admin: http://localhost:7000/admin  
- API: http://localhost:7001/api  

Useful scripts: `pnpm dev:web`, `pnpm dev:api`, `pnpm db:studio`, `pnpm supabase:status`.

## Production

Use a separate cloud/self-hosted Supabase project (not this local stack). Point `DATABASE_URL`, Supabase URL/keys, and `NEXT_PUBLIC_APP_URL` / API URLs accordingly.
