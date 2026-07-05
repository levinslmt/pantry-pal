# PantryPal

<div align="center">

**Turn ingredients into recipes with AI**

[![Next.js][next-badge]][next-url]
[![TypeScript][ts-badge]][ts-url]
[![Prisma][prisma-badge]][prisma-url]
[![NextAuth][nextauth-badge]][nextauth-url]
[![Tailwind CSS][tailwind-badge]][tailwind-url]
[![Gemini][gemini-badge]][gemini-url]

</div>

PantryPal is an AI-powered recipe generator built with **Next.js 16**, **React 19**, **Prisma 7**, and **NextAuth v4**. Enter ingredients you already have, generate custom recipes with Google Gemini 2.5 Flash, save favorites, and revisit them from a personalized dashboard.

---

## Features

- **AI Recipe Generation** — Enter a list of ingredients and receive a fully structured recipe (title, servings, prep/cook time, difficulty, ingredients, instructions, tips) streamed in real time via the Vercel AI SDK.
- **Smart Rate Limiting** — API generation is rate-limited to 20 requests per hour per user via Upstash Redis; auth endpoints are limited to 5 requests per 15 minutes.
- **Authentication** — Google OAuth and email/password login via NextAuth v4 with JWT session strategy. Routes are protected by a `proxy.ts` middleware.
- **Personal Dashboard** — View, search, and manage saved recipes. The latest generated recipe is persisted and re-displayed on return.
- **Recipe Details Modal** — Full recipe view with difficulty badges, ingredient lists, step-by-step instructions, and pro tips.
- **PDF Export** — Download any recipe as a formatted PDF client-side with jsPDF.
- **Responsive UI** — Built with Base UI, custom shadcn-style primitives, and Tailwind CSS v4. Loading skeletons and error boundaries handle every state.
- **Validation** — Zod schemas enforce data integrity on both client forms and server actions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4, `tw-animate-css` |
| **UI Components** | Base UI, shadcn-style primitives, Lucide icons |
| **Authentication** | NextAuth v4 — Google OAuth + Credentials (JWT strategy) |
| **Database** | PostgreSQL via Neon serverless, Prisma 7 ORM |
| **AI** | Google Gemini 2.5 Flash via `@ai-sdk/google` + Vercel AI SDK `streamObject` |
| **Rate Limiting** | Upstash Redis (`@upstash/ratelimit`) |
| **Validation** | Zod |
| **PDF Export** | jsPDF (client-side) |
| **Notifications** | Sonner toast notifications |

---

## Project Structure

```
pantry-pal/
├── app/
│   ├── (auth)/                 # Auth route group (login, register)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth API handler
│   │   └── generate/route.ts   # AI streaming endpoint
│   ├── dashboard/              # Protected dashboard (page, loading, error)
│   ├── layout.tsx              # Root layout (AuthProvider, Toaster)
│   ├── page.tsx                # Public landing page
│   ├── not-found.tsx           # Custom 404
│   └── globals.css             # Tailwind v4 entry
├── components/
│   ├── auth/                   # AuthProvider, LoginForm
│   ├── dashboard/              # DashboardClient
│   ├── recipes/                # RecipeCard, RecipeForm, RecipeModal, SavedRecipes
│   └── ui/                     # button, card, dialog, input, badge, etc.
├── lib/
│   ├── actions/                # Server actions (auth, recipes)
│   ├── generated/prisma/       # Auto-generated Prisma client
│   ├── ai.ts                   # Gemini model initialization
│   ├── auth.ts                 # NextAuth config (authOptions)
│   ├── db.ts                   # Prisma client singleton
│   ├── rate-limit.ts           # Upstash rate limiters
│   ├── recipe-pdf.ts           # Client-side PDF generator
│   ├── schemas.ts              # Zod validation schemas
│   └── utils.ts                # cn() helper
├── prisma/
│   └── schema.prisma           # Database schema (User, Recipe, LatestRecipe, etc.)
├── types/
│   └── next-auth.d.ts          # Session type augmentation
├── proxy.ts                    # Route protection middleware
└── next.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or a [Neon](https://neon.tech) serverless account)
- Google AI API key ([get one here](https://aistudio.google.com/apikey))
- Google OAuth credentials ([set up here](https://console.cloud.google.com/apis/credentials))
- Upstash Redis instance ([upstash.com](https://upstash.com)) for rate limiting

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/pantry-pal.git
cd pantry-pal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Authentication
AUTH_SECRET=<generate with: npx auth secret>
AUTH_GOOGLE_ID=<Google OAuth client ID>
AUTH_GOOGLE_SECRET=<Google OAuth client secret>

# Database
DATABASE_URL=<PostgreSQL connection string (Neon recommended)>

# AI
GOOGLE_GENERATIVE_AI_API_KEY=<Google AI Studio API key>

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL=<Upstash REST URL>
UPSTASH_REDIS_REST_TOKEN=<Upstash REST token>
```

### 4. Set up the database

```bash
npx prisma generate    # Generate Prisma client
npx prisma db push     # Sync schema to database
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Available Scripts

| Script | Command |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Database scripts

```bash
npx prisma db push       # Push schema without migration
npx prisma migrate dev   # Create and apply a migration
npx prisma studio        # Open Prisma Studio (GUI database browser)
```

---

## Architecture

### Authentication Flow

- **Strategy:** JWT (required by the Credentials provider)
- **Providers:** Google OAuth (social) + Email/Password (credentials with bcryptjs hashing)
- **Configuration:** `lib/auth.ts` exports `authOptions` consumed by both the API route and `getServerSession`
- **Route Protection:** `proxy.ts` at the project root acts as Next.js middleware, checking for a valid JWT on every non-public request and redirecting to `/login` with a `callbackUrl` if unauthenticated

### AI Integration

- Model: **Google Gemini 2.5 Flash** via `@ai-sdk/google`
- Endpoint: `POST /api/generate` — accepts validated ingredients, streams structured recipe JSON back using `streamObject`
- Rate-limited to **20 requests per hour** per user via Upstash

### Data Models

- **User** — Standard auth fields + `password` (for credentials), related to Recipes and LatestRecipe
- **Recipe** — Title, description, servings, prep/cook time, difficulty, ingredients array, instructions array, tips array, owned by a User
- **LatestRecipe** — Stores the most recently generated recipe as JSON per user (one-to-one)

---

## Why This Project Matters

PantryPal demonstrates practical full-stack skills:

- Building a modern web application with Next.js 16 App Router
- Handling authentication with multiple providers and protected routes
- Connecting frontend and backend through API routes and server actions
- Working with a relational database, schema design, and ORM migrations
- Integrating third-party AI services into a user-facing experience
- Implementing rate limiting, input validation, and error handling in production

---

## License

[MIT](LICENSE)

<!-- Badge URLs -->
[next-badge]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[next-url]: https://nextjs.org/
[ts-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[ts-url]: https://www.typescriptlang.org/
[prisma-badge]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[nextauth-badge]: https://img.shields.io/badge/NextAuth-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[nextauth-url]: https://next-auth.js.org/
[tailwind-badge]: https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[tailwind-url]: https://tailwindcss.com/
[gemini-badge]: https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white
[gemini-url]: https://ai.google.dev/
