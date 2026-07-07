"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioItems as staticPortfolioItems } from "@/data/portfolioItems";
import type { PortfolioItem } from "@/data/portfolioItems";

interface FeaturedWorksProps {
  portfolioItems?: PortfolioItem[];
}

function formatCategory(category: string) {
  return category.replace(/-/g, " ");
}

export default function FeaturedWorks({
  portfolioItems = staticPortfolioItems,
}: FeaturedWorksProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const visibleFeatured = useMemo(() => {
    return (portfolioItems.length > 0 ? portfolioItems : staticPortfolioItems).slice(0, 8);
  }, [portfolioItems]);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller || visibleFeatured.length === 0) {
      return;
    }

    const updateActiveIndex = () => {
      const containerCenter = scroller.scrollLeft + scroller.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) {
          return;
        }

        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const distance = Math.abs(containerCenter - slideCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActiveIndex(nearestIndex);
    };

    updateActiveIndex();
    scroller.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      scroller.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [visibleFeatured.length]);

  const scrollToIndex = (index: number) => {
    const length = visibleFeatured.length;

    if (length === 0) {
      return;
    }

    const nextIndex = (index + length) % length;
    const slide = slideRefs.current[nextIndex];

    if (!slide) {
      return;
    }

    slide.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(nextIndex);
  };

  if (visibleFeatured.length === 0) {
    return null;
  }

  return (
    <section className="section-shell featured-showcase bg-[#0c1118] py-20 sm:py-24 lg:py-28">
      <div className="section-grid" />
      <div className="relative z-10 mx-auto mb-10 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <span className="section-kicker mb-5">Selected work</span>
          <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl">
            Featured Work
          </h2>
          <p className="section-copy mt-5 max-w-2xl text-lg">
            A cinematic look at recent creative projects, built to feel closer to an agency showcase than a static portfolio grid.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="carousel-arrow nav-pill icon-lift flex h-12 w-12 items-center justify-center text-xl text-white"
            aria-label="Previous featured work"
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="carousel-arrow nav-pill icon-lift flex h-12 w-12 items-center justify-center text-xl text-white"
            aria-label="Next featured work"
          >
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="featured-carousel relative z-10 flex snap-x snap-mandatory gap-5 overflow-x-auto py-8 [scrollbar-width:none] sm:gap-7 lg:gap-8 [&::-webkit-scrollbar]:hidden"
      >
        {visibleFeatured.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <article
              key={item.id}
              ref={(node) => {
                slideRefs.current[index] = node;
              }}
              className={`featured-slide group relative snap-center ${isActive ? "featured-slide-active" : "featured-slide-side"}`}
              onPointerMove={(event) => {
                const bounds = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty(
                  "--card-glow-x",
                  `${event.clientX - bounds.left}px`
                );
                event.currentTarget.style.setProperty(
                  "--card-glow-y",
                  `${event.clientY - bounds.top}px`
                );
              }}
            >
              <div className="featured-card relative overflow-hidden rounded-[1.5rem] border border-[rgba(157,110,255,0.26)] bg-[#0b1016] p-2 shadow-[0_34px_110px_-62px_rgba(139,92,246,0.5)] sm:p-2.5 lg:p-3">
                <div className="featured-card-frame relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-[1.25rem]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="featured-card-image object-cover"
                    sizes="(max-width: 768px) 82vw, (max-width: 1280px) 64vw, 48vw"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,11,16,0.02)_0%,rgba(8,11,16,0.18)_44%,rgba(8,11,16,0.92)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 lg:p-8">
                    <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#d7cdf5] shadow-[0_14px_32px_-22px_rgba(139,92,246,0.58)] backdrop-blur-md">
                      {formatCategory(item.category)}
                    </div>
                    <h3 className="max-w-2xl text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-[#f0ecff] sm:text-3xl lg:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d2d8e5] sm:text-base">
                      {item.description}
                    </p>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-[1.5rem] ring-1 ring-inset ring-white/10" />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="relative z-10 mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {visibleFeatured.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToIndex(index)}
              className={`micro-button h-2.5 rounded-full ${index === activeIndex ? "w-10 bg-[#d7cdf5] shadow-[0_0_18px_rgba(183,148,246,0.5)]" : "w-2.5 bg-white/25 hover:bg-white/45"}`}
              aria-label={`Go to featured work ${index + 1}`}
            />
          ))}
        </div>

        <Link href="/portfolio" className="glass-button">
          View all work
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
