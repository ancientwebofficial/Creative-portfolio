"use client";

import { useMemo, useState } from "react";
import PortfolioFilterBar from "@/components/portfolio/PortfolioFilterBar";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import PortfolioModal from "@/components/portfolio/PortfolioModal";
import type { PortfolioItem } from "@/data/portfolioItems";
import type { CategoryDto } from "@/lib/cms/mappers";
import type { PayloadGlobals } from "@/lib/payload/public-data";

interface PortfolioPageClientProps {
  items: PortfolioItem[];
  categories: CategoryDto[];
  initialCategory?: string | null;
  initialSort?: string;
  content?: PayloadGlobals["portfolioPage"] | null;
}

export default function PortfolioPageClient({
  items,
  categories,
  initialCategory = null,
  initialSort = "recent",
  content,
}: PortfolioPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = useMemo(() => {
    let visibleItems = items;

    if (selectedCategory) {
      visibleItems = visibleItems.filter((item) => item.category === selectedCategory);
    }

    switch (selectedSort) {
      case "popular":
        return [...visibleItems].sort(
          (a, b) => (b.popularity_score || 0) - (a.popularity_score || 0)
        );
      case "oldest":
        return [...visibleItems].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      case "featured":
        return [...visibleItems].sort((a, b) => Number(b.featured) - Number(a.featured));
      case "recent":
      default:
        return [...visibleItems].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  }, [items, selectedCategory, selectedSort]);

  return (
    <>
      <PortfolioFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        selectedSort={selectedSort}
        onCategoryChange={setSelectedCategory}
        onSortChange={setSelectedSort}
        filterHeading={content?.filterHeading}
        allCategoriesLabel={content?.allCategoriesLabel}
        sortHeading={content?.sortHeading}
        sortOptions={content?.sortOptions}
      />

      <section className="section-shell min-h-screen py-12">
        <div className="section-grid" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 surface-panel rounded-[2rem] p-8 sm:p-10">
            <span className="section-kicker mb-4">{content?.eyebrow || "Portfolio"}</span>
            <h1 className="section-title text-4xl sm:text-5xl">{content?.heading || "Portfolio"}</h1>
            <p className="mt-4 text-lg text-[#9aa7b9]">
              {filteredItems.length} {filteredItems.length === 1 ? content?.workSingular || "work" : content?.workPlural || "works"}
              {selectedCategory && ` ${content?.categorySuffix || "in this category"}`}
            </p>
          </div>

          <PortfolioGrid
            items={filteredItems}
            onItemClick={setSelectedItem}
            emptyState={content?.emptyState}
            featuredBadge={content?.featuredBadge}
            cardCtaLabel={content?.cardCtaLabel}
          />
        </div>
      </section>

      <PortfolioModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        content={content}
      />
    </>
  );
}
