"use client";

import Image from "next/image";
import { PortfolioItem } from "@/data/portfolioItems";

interface PortfolioItemCardProps {
  item: PortfolioItem;
  onPreview?: (item: PortfolioItem) => void;
}

export default function PortfolioItemCard({
  item,
  onPreview,
}: PortfolioItemCardProps) {
  const hasThumbnailDimensions =
    typeof item.thumbnail_width === "number" &&
    item.thumbnail_width > 0 &&
    typeof item.thumbnail_height === "number" &&
    item.thumbnail_height > 0;

  return (
    <div
      onClick={() => onPreview?.(item)}
      className="surface-panel group cursor-pointer overflow-hidden rounded-[1.4rem] border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#8b5cf6]/35 hover:shadow-[0_24px_70px_-44px_rgba(139,92,246,0.28)]"
    >
      <div
        className="relative w-full overflow-hidden bg-[#0b1016]"
        style={{ aspectRatio: "16 / 10" }}
        data-testid={`card-preview-${item.id}`}
        data-aspect-ratio={hasThumbnailDimensions ? "16/10" : "16/10"}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
          data-testid={`card-image-${item.id}`}
          data-image-url={item.image}
        />
        {item.featured && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#b794f6] px-3 py-1 text-xs font-semibold text-white shadow-[0_12px_28px_-18px_rgba(139,92,246,0.8)]">
            Featured
          </div>
        )}
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/24 pointer-events-none">
          <button className="pointer-events-auto rounded-full bg-white/92 px-5 py-2 text-sm font-semibold text-[#071015] opacity-0 shadow-[0_16px_34px_-20px_rgba(0,0,0,0.6)] transition-all duration-300 group-hover:opacity-100">
            View
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="mb-1.5 text-[1.03rem] font-semibold text-white transition-colors group-hover:text-[#d7cdf5]">
          {item.title}
        </h3>
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[#9aa7b9]">
          {item.category.replace("-", " ")}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] text-[#cfc9e8] transition-colors hover:border-[#8b5cf6]/35 hover:bg-[#8b5cf6]/10 hover:text-white"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.7rem] text-[#9aa7b9]">
              +{item.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
