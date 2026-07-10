"use client";

import type { FAQItem } from "@/data/faqItems";
import Link from "next/link";
import { useState } from "react";

interface FAQProps {
  items?: FAQItem[];
  content?: {
    enabled?: boolean | null;
    eyebrow?: string | null;
    heading?: string | null;
    description?: string | null;
    ctaKicker?: string | null;
    cta?: { label?: string | null; href?: string | null; newTab?: boolean | null } | null;
  } | null;
}

export default function FAQ({ items = [], content }: FAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (content?.enabled === false) {
    return null;
  }

  return (
    <section className="section-shell bg-[#0c1118]">
      <div className="section-grid" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="section-kicker mb-5">{content?.eyebrow || "FAQ"}</span>
          <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl">
            {content?.heading || "Frequently Asked Questions"}
          </h2>
          <p className="section-copy mt-5 text-lg">
            {content?.description || "Everything you need to know about working on projects together."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((column) => (
            <div key={column} className="space-y-4">
              {items
                .slice(column * Math.ceil(items.length / 2), (column + 1) * Math.ceil(items.length / 2))
                .map((item) => (
                  <div
                    key={item.id}
                    className="faq-card surface-panel rounded-[1.5rem] border border-white/10 p-6"
                  >
                    <button
                      onClick={() => setOpenId(openId === item.id ? null : item.id)}
                      className="flex w-full items-start justify-between gap-4 text-left"
                    >
                      <h3 className="flex-1 text-lg font-semibold text-white sm:text-xl">
                        {item.question}
                      </h3>
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#b794f6] transition-transform duration-300 ${
                          openId === item.id ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>

                    <div
                      className={`faq-answer-grid ${
                        openId === item.id ? "faq-answer-open" : ""
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-5 border-t border-white/10 pt-5">
                          <p className="leading-7 text-[#9aa7b9]">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="mt-12 surface-panel-strong rounded-[2rem] p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.22em] text-[#9aa7b9]">{content?.ctaKicker || "Still have questions?"}</p>
          <Link
            href={content?.cta?.href || "/contact"}
            target={content?.cta?.newTab ? "_blank" : undefined}
            rel={content?.cta?.newTab ? "noopener noreferrer" : undefined}
            className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-[#b794f6] hover:text-[#9d6eff]"
          >
            {content?.cta?.label || "Reach out on the contact page"}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
