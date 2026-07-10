import type { PortfolioItem } from "@/data/portfolioItems";
import type { SiteSettingsDto } from "@/lib/cms/mappers";

interface HeroProps {
  portfolioItems?: PortfolioItem[];
  settings?: SiteSettingsDto | null;
  content?: {
    badge?: string | null;
    heading?: string | null;
    description?: string | null;
    primaryCta?: { label?: string | null; href?: string | null } | null;
    secondaryCta?: { label?: string | null; href?: string | null } | null;
    statistics?: { value?: string | null; label?: string | null }[] | null;
  } | null;
}

export default function Hero({
  settings,
  content,
}: HeroProps) {
  const heroTitle = content?.heading || settings?.hero_title || "Minecraft Creative Design";
  const heroSubtitle =
    content?.description ||
    settings?.hero_subtitle ||
    "Artwork crafted for creators. Thumbnails, logos, texture packs, and digital assets that bring your Minecraft vision to life.";
  const primaryCta = content?.primaryCta || { label: "Explore work", href: "/portfolio" };
  const secondaryCta = content?.secondaryCta || { label: "View pricing", href: "#pricing" };
  const statistics = content?.statistics?.filter((stat) => stat.value && stat.label) || [
    { value: "70+", label: "Projects delivered" },
    { value: "200+", label: "Creators served" },
    { value: "4+", label: "Years of work" },
  ];

  return (
    <section className="section-shell hero-text-shell pt-20 pb-24 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32">
      <div className="section-grid" />
      <div className="hero-ambient-grid" />
      <div className="hero-particle-field" />
      <div className="hero-gradient-wash" />
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="fade-in-up float-badge inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#d7cdf5] shadow-[0_16px_40px_-24px_rgba(139,92,246,0.55)] backdrop-blur-md">
            {content?.badge || "Premium creative agency design"}
          </div>

          <h1 className="fade-in-up section-title mt-4 text-5xl leading-[0.9] sm:text-6xl lg:text-[5.5rem] [animation-delay:180ms]">
            {heroTitle}
          </h1>

          <p className="fade-in-up section-copy mx-auto mt-6 max-w-3xl text-lg leading-8 sm:text-xl [animation-delay:240ms]">
            {heroSubtitle}
          </p>

          <div className="fade-in-up mt-10 flex flex-wrap justify-center gap-4 [animation-delay:300ms]">
            <a href={primaryCta.href || "/portfolio"} className="glass-button">
              {primaryCta.label || "Explore work"}
            </a>
            <a href={secondaryCta.href || "#pricing"} className="ghost-button nav-pill">
              {secondaryCta.label || "View pricing"}
            </a>
          </div>

          <div className="fade-in-up mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 [animation-delay:360ms]">
            {statistics.map(({ value, label }, index) => (
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
