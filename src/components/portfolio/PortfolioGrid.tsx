import { PortfolioItem } from "@/data/portfolioItems";
import PortfolioItemCard from "./PortfolioItemCard";

interface PortfolioGridProps {
  items: PortfolioItem[];
  onItemClick?: (item: PortfolioItem) => void;
  emptyState?: string | null;
  featuredBadge?: string | null;
  cardCtaLabel?: string | null;
}

export default function PortfolioGrid({
  items,
  onItemClick,
  emptyState,
  featuredBadge,
  cardCtaLabel,
}: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="surface-panel rounded-[2rem] py-20 text-center">
        <p className="text-lg text-[#9aa7b9]">{emptyState || "No portfolio items found"}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
      {items.map((item) => (
        <PortfolioItemCard
          key={item.id}
          item={item}
          onPreview={onItemClick}
          featuredBadge={featuredBadge}
          cardCtaLabel={cardCtaLabel}
        />
      ))}
    </div>
  );
}
