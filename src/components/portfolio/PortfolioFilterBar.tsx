"use client";

import { categories as staticCategories, sortOptions } from "@/data/portfolioItems";
import type { CategoryDto } from "@/lib/cms/mappers";

interface PortfolioFilterBarProps {
  categories?: (typeof staticCategories[number] | CategoryDto)[];
  selectedCategory: string | null;
  selectedSort: string;
  onCategoryChange: (category: string | null) => void;
  onSortChange: (sort: string) => void;
}

export default function PortfolioFilterBar({
  categories = staticCategories,
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
}: PortfolioFilterBarProps) {
  return (
    <div className="sticky top-20 z-40 border-y border-white/10 bg-[#090d12]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9aa7b9]">Categories</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange(null)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategory === null
                    ? "bg-gradient-to-r from-[#8b5cf6] to-[#b794f6] text-white"
                    : "border border-white/10 bg-white/5 text-[#cfc9e8] hover:border-[#8b5cf6]/35 hover:bg-white/10 hover:text-white"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-r from-[#8b5cf6] to-[#b794f6] text-white"
                      : "border border-white/10 bg-white/5 text-[#cfc9e8] hover:border-[#8b5cf6]/35 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full lg:max-w-xs">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9aa7b9]">Sort by</p>
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="mt-3 w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white outline-none transition-all focus:border-[#8b5cf6]/45 focus:ring-4 focus:ring-[#8b5cf6]/10"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
