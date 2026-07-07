import type { PortfolioItem } from "@/data/portfolioItems";
import type { SiteSettingsDto } from "@/lib/cms/mappers";

interface HeroProps {
  portfolioItems?: PortfolioItem[];
  settings?: SiteSettingsDto | null;
}

export default function Hero({
  settings,
}: HeroProps) {
  const heroTitle = settings?.hero_title || "Minecraft Creative Design";
  const heroSubtitle =
    settings?.hero_subtitle ||
    "Artwork crafted for creators. Thumbnails, logos, texture packs, and digital assets that bring your Minecraft vision to life.";

  return (
    <section className="section-shell hero-text-shell pt-20 pb-24 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32">
      <div className="section-grid" />
      <div className="hero-ambient-grid" />
      <div className="hero-particle-field" />
      <div className="hero-gradient-wash" />
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="fade-in-up float-badge inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7cdf5] shadow-[0_16px_40px_-24px_rgba(139,92,246,0.55)] backdrop-blur-md">
            Premium creative agency design
          </div>

          <p className="fade-in-up mt-8 text-sm font-semibold uppercase tracking-[0.28em] text-[#9aa7b9] [animation-delay:120ms]">
            Cosmic Flare studio
          </p>

          <h1 className="fade-in-up section-title mt-4 text-5xl leading-[0.9] sm:text-6xl lg:text-[5.5rem] [animation-delay:180ms]">
            {heroTitle}
          </h1>

          <p className="fade-in-up section-copy mx-auto mt-6 max-w-3xl text-lg leading-8 sm:text-xl [animation-delay:240ms]">
            {heroSubtitle}
          </p>

          <div className="fade-in-up mt-10 flex flex-wrap justify-center gap-4 [animation-delay:300ms]">
            <a href="/portfolio" className="glass-button">
              Explore work
            </a>
            <a href="#pricing" className="ghost-button nav-pill">
              View pricing
            </a>
          </div>

          <div className="fade-in-up mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 [animation-delay:360ms]">
            {[
              ["70+", "Projects delivered"],
              ["200+", "Creators served"],
              ["4+", "Years of work"],
            ].map(([value, label], index) => (
              <div
                key={label}
                className="premium-card lift-hover rounded-[1.5rem] p-5"
                style={{ animationDelay: `${420 + index * 80}ms` }}
              >
                <p className="text-3xl font-semibold text-white">{value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#9aa7b9]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
