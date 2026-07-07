import { categories as staticCategories } from "@/data/portfolioItems";
import type { CategoryDto } from "@/lib/cms/mappers";
import Link from "next/link";

interface CategoryShowcaseProps {
  categories?: (typeof staticCategories[number] | CategoryDto)[];
}

export default function CategoryShowcase({
  categories = staticCategories,
}: CategoryShowcaseProps) {
  const categoryColors = [
    "from-white/8 to-transparent",
    "from-[#8b5cf6]/10 via-transparent to-transparent",
    "from-transparent to-[#b794f6]/10",
    "from-white/5 via-transparent to-[#8b5cf6]/8",
  ];

  return (
    <section className="section-shell bg-[#0f141b]">
      <div className="section-grid" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="section-kicker mb-5">Services</span>
          <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl">
            Specialized Creative Services
          </h2>
          <p className="section-copy mt-5 text-lg">
            Tailored design solutions for Minecraft creators, streamers, and content studios.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, idx) => (
            <Link key={category.id} href={`/portfolio?category=${category.id}`} className="group">
              <div
                className={`service-card surface-panel relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-8 ${categoryColors[idx % categoryColors.length]}`}
              >
                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="mb-8">
                    <p className="text-5xl font-semibold text-white transition-colors group-hover:text-[#b794f6]">
                      {category.count ?? 0}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#9aa7b9]">
                      Projects
                    </p>
                  </div>

                  <h3 className="text-2xl font-semibold text-white transition-colors group-hover:text-[#b794f6]">
                    {category.label}
                  </h3>

                  <p className="mt-4 flex-1 text-sm leading-7 text-[#9aa7b9]">
                    {category.id === "thumbnails"
                      ? "Eye-catching thumbnails designed to maximize click-through rates and engagement."
                      : category.id === "logos"
                      ? "Custom logo designs that represent your brand identity in Minecraft."
                      : category.id === "texture-packs"
                      ? "Complete texture pack designs for immersive gameplay experiences."
                      : "Banner artwork for YouTube, Twitch, and other platforms."}
                  </p>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#b794f6]">
                    Explore
                    <span className="h-px w-5 bg-current transition-all duration-300 group-hover:w-8" />
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#8b5cf6] via-[#b794f6] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
