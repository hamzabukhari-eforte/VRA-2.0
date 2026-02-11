# VRA Admin Panel

Admin panel for managing dynamic content and viewing form submissions. Uses **Supabase** (Postgres + Storage) with **Prisma**.

## Setup

1. **Supabase project**
   - Create a project at [supabase.com](https://supabase.com).
   - In **Settings → Database**, copy the connection string (URI). Use it as `DATABASE_URL` (replace `[YOUR-PASSWORD]` with your DB password).
   - In **Settings → API**: copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`, and `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`. For uploads from the server (e.g. admin image upload), use `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`.

2. **Storage bucket**
   - In Supabase **Storage**, create a bucket named **`cms`** (private is fine). Admin uploads go here; presigned URLs are used on the frontend.

3. **Environment**
   - Copy `.env.example` to `.env` and set:
     - `DATABASE_URL` (Postgres connection string)
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (for server-side uploads)
   - Optional: `ADMIN_PASSWORD` to protect `/admin` later.

4. **Database**
   - Run:
     - `npm install`
     - `npx prisma db push`
   - This creates/updates tables in your Supabase Postgres.

5. **Run**
   - `npm run dev` and open **/admin**.

## What’s implemented

- **Section images** (`/admin/sections`): One image per shared section key (e.g. `overseas_cricket_talent`, `sports_clinics`, `mission`, `ground_1`). Same key used on multiple pages reuses one image. Frontend falls back to existing `imageSrc` when no admin image is set.
- **ImageTextSection**: Optional `sectionKey` prop. When set, the component fetches the image from the CMS and uses it if present; otherwise uses `imageSrc`.
- **Submissions** (`/admin/submissions`): Read-only tables for Contact, Membership, Membership termination, Donation, Indoor net booking. Filters (date range), pagination, and CSV export.
- **Form submission APIs**: `POST /api/submissions/contact`, `/membership`, `/termination`, `/donation`, `/net-booking` accept JSON and store in the database. Wire your forms to these endpoints to start collecting data.

## Extending

- **Homepage**: Gallery, Crowd section, Teams, Sponsors – add Prisma models and admin UI following the same pattern (Storage path in DB, presigned URL for display).
- **About**: Board members – same pattern; optional `order` for sorting.
- **VRA Cricket**: Team counts (single row: men, women, youth, zalmisXi), Facility carousel (ordered list of images).
- **Auth**: Add middleware or layout check for `ADMIN_PASSWORD` (or Supabase Auth) and protect `/admin` and `/api/admin/*`.

## Data rules

- **No duplicate images**: One stored file per section key; all usages reference the same path.
- **Fallback**: If no admin image exists, the existing frontend image (or content) is used.
- **Updates**: Changing an image in the admin updates it everywhere that section is used.
