# Cosmicflare

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-powered-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-typed-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Open Source](https://img.shields.io/badge/Open%20Source-by%20me-111827?style=for-the-badge)](https://github.com/)

Creative studio is my personal portfolio and CMS-driven website built with Next.js, TypeScript, and Supabase. I built this codebase myself and am sharing it as an open-source project for anyone who wants to explore the architecture, reuse ideas, or adapt the CMS patterns for their own work.

The site is designed to present creative work with a strong visual identity while keeping the content manageable through a custom admin panel. It includes a public-facing portfolio, homepage sections, testimonials, service/plans data, media handling, and admin tools for managing site content.

## Features

- Public portfolio site with a custom homepage, featured work, categories, testimonials, FAQ, and contact pages
- Admin dashboard for managing portfolio items, homepage content, services, testimonials, media, and site settings
- Supabase-backed data layer for auth, storage, and content management
- Responsive UI built with the Next.js App Router and modern React patterns
- SEO-aware metadata and configurable branding/content

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Supabase
- Tailwind CSS v4
- Zod

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- A Supabase project

### Install dependencies

```bash
npm install
```

### Environment variables

Create a `.env.local` file with the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET=portfolio-media
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for the app to connect to Supabase. `SUPABASE_SERVICE_ROLE_KEY` is needed for server-side admin features. The media bucket defaults to `portfolio-media` if you do not set `NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET`.

### Run the app

```bash
npm run dev
```

Then open the local development server shown in the terminal.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - start the production server
- `npm run lint` - run ESLint

## Project Structure

- `src/app` - app routes, layouts, and API routes
- `src/components` - shared UI and admin components
- `src/lib` - CMS, Supabase, auth, and data helpers
- `supabase/migrations` - database schema and policy migrations

## Notes

- The app is set up around Supabase migrations and admin policies, so make sure your database matches the schema in `supabase/migrations` before using the CMS.
- Site branding is driven by CMS settings, which lets the public-facing title and owner details stay flexible.

## License

Creative studio is licensed under the MIT License. See [LICENSE](LICENSE) for the full text.

I wrote this code myself and I’m sharing it openly so people can study, fork, and build on it.
