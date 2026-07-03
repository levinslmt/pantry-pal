<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:auth-rules -->
# Authentication

- Auth.js (NextAuth v4) with Prisma adapter (`@auth/prisma-adapter`)
- Providers: Google OAuth + Credentials (email/password)
- Session strategy: JWT (required for Credentials provider)
- Auth config: `lib/auth.ts`
- Auth API route: `app/api/auth/[...nextauth]/route.ts`
- Server actions for signup/signin: `lib/actions/auth.ts`
- Auth pages: `/auth/login`, `/auth/register`
- Route protection: `app/proxy.ts` (Next.js 16 middleware replacement)
- The main page `/` and `/api/recipes/*` are protected — redirects to `/auth/login` if unauthenticated
- `/auth/*` and `/api/auth/*` are public

## Environment variables needed
```
AUTH_SECRET=<generated>
AUTH_GOOGLE_ID=<Google OAuth client ID>
AUTH_GOOGLE_SECRET=<Google OAuth client secret>
DATABASE_URL=<Neon Postgres connection string>
```

## Commands
- `npx prisma db push` — sync schema to database
- `npx prisma migrate dev` — create a migration
- `npx prisma studio` — open Prisma Studio
<!-- END:auth-rules -->
