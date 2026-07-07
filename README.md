# Creative Portfolio

<p align="center">
  <h3 align="center">The Open-Source Portfolio Platform for Creative Professionals</h3>

  <p align="center">
    Build beautiful portfolios, manage content through a powerful CMS, and showcase your creative work without touching code.
  </p>
</p>

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

<p align="center">
  <a href="https://creativestudiodemo.vercel.app/"><strong>🌐 Live Demo</strong></a>
  ·
  <a href="https://github.com/ancientwebofficial/Creative-portfolio"><strong>⭐ Star on GitHub</strong></a>
  ·
  <a href="#installation"><strong>🚀 Installation</strong></a>
</p>

---

## 📸 Preview

<p align="center>
 img src="screenshots\hero_section.png" width="48%">
 </p>


<p align="center>
 img src="screenshots\featuredwork.png" width="48%">
 </p>

 <p align="center>
  <img src="screenshots\ownersection.png" width="48%">
 </p>


<p align="center">
   <img src="screenshots\portfolio.png" width="48%">
  <img src="screenshots\contact.png" width="48%">
  <img src="screenshots\admin_pannel.png" width="48%">
</p>

---

# ✨ What is Creative portfolio?

**Creative portfolio** is an open-source portfolio platform built for designers, thumbnail artists, creative studios, freelancers, and digital creators.

Instead of managing content through code, Creative portfolio provides a modern CMS where you can customize every part of your portfolio—from your homepage and projects to testimonials, pricing, FAQs, services, and owner profile.

Whether you're a Minecraft thumbnail designer, logo artist, video editor, or creative agency, Cosmicflare gives you everything you need to present your work professionally.

---

# 🚀 Features

## 🎨 Beautiful Portfolio

* Dynamic portfolio showcase
* Featured projects
* Categories
* Large image previews
* Smooth animations
* Responsive layout
* Hover interactions
* Carousel support

---

## 👤 Owner Profile

Manage your entire profile through the CMS.

Includes:

* Name
* Profile Picture
* Bio
* Location
* Email
* Website
* Business Contact
* Instagram
* X (Twitter)
* Discord
* Behance
* Fiverr
* GitHub
* Modrinth
* YouTube

No code required.

---

## 🛠 Services

Create unlimited services including:

* Thumbnails
* Logos
* Texture Packs
* Banners
* Branding
* Custom Artwork

Each service supports:

* Title
* Description
* Icon
* Order Link

---

## 💰 Pricing

Create multiple pricing plans with:

* Plan name
* Currency
* Price
* Feature list
* CTA button
* Popular badge
* Display ordering

---

## ⭐ Testimonials

Dynamic testimonial management.

Supports:

* Client name
* Review
* Rating
* Position
* Avatar

---

## 👥 Trusted Clients

Showcase your clients with:

* Logo
* Name
* Platform
* Subscriber count
* Channel links

---

## ❓ FAQ

Unlimited FAQ entries with an animated accordion interface.

---

## 📞 Contact Section

Professional contact card including:

* Email
* Website
* Discord
* Instagram
* X
* Behance
* GitHub
* Fiverr
* Modrinth

---

# ⚙ Powerful CMS

Everything is manageable from the admin dashboard.

### Dashboard

* Content overview
* Quick management

### Portfolio Manager

* Upload projects
* Categories
* Featured projects
* Tags
* Ordering
* Visibility

### Media Library

* Upload images
* Preview assets
* Reuse uploaded files

### Owner Settings

Manage:

* Profile
* Bio
* Social links
* Contact information

### Pricing Manager

Create and edit pricing plans.

### Testimonials Manager

Full CRUD support.

### FAQ Manager

Manage frequently asked questions.

### Services Manager

Manage offered services.

### Site Settings

Configure:

* Branding
* Logo
* SEO defaults
* Footer
* Site title

---

# 🔐 Authentication & Security

* Secure admin authentication
* Protected CMS
* Environment variables
* Input validation
* URL validation
* Row Level Security (RLS)
* Type-safe backend

---

# 🚀 Performance

Built using modern web technologies.

* Next.js 16
* React 19
* TypeScript
* Server Components
* Lazy Loading
* Optimized Images
* Responsive Assets

---

# 🔍 SEO Ready

Includes:

* Dynamic Metadata
* Open Graph
* Twitter Cards
* Sitemap
* Robots.txt
* Semantic HTML

---

# 🛠 Tech Stack

| Technology       | Usage          |
| ---------------- | -------------- |
| Next.js 16       | Framework      |
| React 19         | Frontend       |
| TypeScript       | Language       |
| Tailwind CSS v4  | Styling        |
| Supabase         | Database       |
| PostgreSQL       | Data Storage   |
| Supabase Auth    | Authentication |
| Supabase Storage | Media Storage  |
| Zod              | Validation     |
| Vercel           | Deployment     |

---

# 📦 Installation

## Clone the repository

```bash
git clone https://github.com/ancientwebofficial/Creative-portfolio.git

cd <Creative-portfolio>
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SUPABASE_MEDIA_BUCKET=portfolio-media
```

## Configure Supabase

* Create a Supabase project.
* Run the SQL migrations inside `supabase/migrations`.
* Create the `portfolio-media` storage bucket.
* Configure the bucket permissions according to the migration policies.

## Start the development server

```bash
npm run dev
```

Open:

http://localhost:3000

---

# 📂 Project Structure

```text
src/
├── app/
├── components/
├── lib/
├── hooks/
├── types/

supabase/
└── migrations/

public/

assets/
└── screenshots/
```

---

# 🗺 Roadmap

## ✅ Current

* Portfolio CMS
* Dynamic Homepage
* Pricing
* Testimonials
* FAQ
* Media Library
* Responsive UI
* Authentication

## 🚧 Planned

* Discord Bot Integration
* Real-time Order Notifications
* Client Portal
* File Delivery
* Messaging
* Payment Gateway
* Invoice Generation
* Analytics Dashboard
* AI Design Recommendations
* Booking System
* Email Notifications
* Push Notifications

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve Cosmicflare:

1. Fork the repository.
2. Create a new branch.
3. Commit your changes.
4. Open a Pull Request.

Feature requests and bug reports are always appreciated.

---

# 📜 License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

---

<p align="center">

Made with ❤️ using Next.js, TypeScript and Supabase.

If you find Creative Portfolio useful, consider giving the project a ⭐ on GitHub.

</p>
