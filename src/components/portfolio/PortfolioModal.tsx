"use client";

import { PortfolioItem } from "@/data/portfolioItems";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
  content?: {
    modalEyebrow?: string | null;
    categoryLabel?: string | null;
    dateLabel?: string | null;
    descriptionLabel?: string | null;
    tagsLabel?: string | null;
    modalCta?: { label?: string | null; href?: string | null; newTab?: boolean | null } | null;
  } | null;
}

export default function PortfolioModal({ item, onClose, content }: PortfolioModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="surface-panel-strong max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem]"
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#0f141b]/95 p-6 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#9aa7b9]">{content?.modalEyebrow || "Portfolio item"}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{item.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-[#cfc9e8] hover:border-[#8b5cf6]/35 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Image */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-[1.5rem] bg-[#0b1016]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#9aa7b9] mb-2">{content?.categoryLabel || "Category"}</p>
              <p className="capitalize text-white">
                {item.category.replace("-", " ")}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#9aa7b9] mb-2">{content?.dateLabel || "Date"}</p>
              <p className="text-white">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#9aa7b9] mb-2">{content?.descriptionLabel || "Description"}</p>
            <p className="leading-8 text-[#edf3fb]">{item.description}</p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[#9aa7b9] mb-3">{content?.tagsLabel || "Tags"}</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#cfc9e8] transition-colors hover:border-[#8b5cf6]/35 hover:bg-[#8b5cf6]/10 hover:text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action */}
          <Link
            href={content?.modalCta?.href || "/contact"}
            target={content?.modalCta?.newTab ? "_blank" : undefined}
            rel={content?.modalCta?.newTab ? "noopener noreferrer" : undefined}
            className="glass-button block w-full py-3 text-center"
          >
            {content?.modalCta?.label || "Order This Design"}
          </Link>
        </div>
      </div>
    </div>
  );
}
