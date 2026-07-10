"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PortfolioItem } from "@/data/portfolioItems";

interface FeaturedWorksProps {
  portfolioItems?: PortfolioItem[];
  content?: {
    eyebrow?: string | null;
    heading?: string | null;
    description?: string | null;
    cta?: { label?: string | null; href?: string | null } | null;
    autoplayDelayMs?: number | null;
  } | null;
}

function formatCategory(category: string) {
  return category.replace(/-/g, " ");
}

export default function FeaturedWorks({
  portfolioItems = [],
  content,
}: FeaturedWorksProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLElement | null>>([]);
  const activeIndexRef = useRef(0);
  const autoplayTimerRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplayResetKey, setAutoplayResetKey] = useState(0);
  const [hasAutoplayFocus, setHasAutoplayFocus] = useState(false);
  const [isAutoplayHovered, setIsAutoplayHovered] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  const visibleFeatured = useMemo(() => {
    return portfolioItems.slice(0, 8);
  }, [portfolioItems]);

  const isAutoplayPaused =
    hasAutoplayFocus || isAutoplayHovered || !isTabVisible || prefersReducedMotion;

  const clearAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      window.clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const scroller = scrollerRef.current;
    const length = visibleFeatured.length;

    if (!scroller || length === 0) {
      return;
    }

    const nextIndex = (index + length) % length;
    const slide = slideRefs.current[nextIndex];

    if (!slide) {
      return;
    }

    activeIndexRef.current = nextIndex;
    scroller.scrollTo({
      left: slide.offsetLeft - (scroller.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
    setActiveIndex(nextIndex);
  }, [visibleFeatured.length]);

  const handleManualScrollToIndex = useCallback((index: number) => {
    clearAutoplayTimer();
    scrollToIndex(index);
    setAutoplayResetKey((key) => key + 1);
  }, [clearAutoplayTimer, scrollToIndex]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updateReducedMotion();
    mediaQuery.addEventListener("change", updateReducedMotion);

    return () => {
      mediaQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setIsTabVisible(!document.hidden);
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

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

      activeIndexRef.current = nearestIndex;
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

  useEffect(() => {
    clearAutoplayTimer();

    if (isAutoplayPaused || visibleFeatured.length <= 1) {
      return;
    }

    autoplayTimerRef.current = window.setTimeout(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, content?.autoplayDelayMs || 5000);

    return clearAutoplayTimer;
  }, [
    activeIndex,
    autoplayResetKey,
    clearAutoplayTimer,
    isAutoplayPaused,
    scrollToIndex,
    visibleFeatured.length,
    content?.autoplayDelayMs,
  ]);

  if (visibleFeatured.length === 0) {
    return null;
  }

  return (
    <section
      className="section-shell featured-showcase bg-[#0c1118] py-20 sm:py-24 lg:py-28"
      onPointerEnter={() => setIsAutoplayHovered(true)}
      onPointerLeave={() => setIsAutoplayHovered(false)}
      onFocus={() => setHasAutoplayFocus(true)}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;

        if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
          setHasAutoplayFocus(false);
        }
      }}
    >
      <div className="section-grid" />
      <div className="relative z-10 mx-auto mb-10 flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          <span className="section-kicker mb-5">{content?.eyebrow || "Selected work"}</span>
          <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl">
            {content?.heading || "Featured Work"}
          </h2>
          <p className="section-copy mt-5 max-w-2xl text-lg">
            {content?.description || "A cinematic look at recent creative projects, built to feel closer to an agency showcase than a static portfolio grid."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleManualScrollToIndex(activeIndex - 1)}
            className="carousel-arrow nav-pill icon-lift flex h-12 w-12 items-center justify-center text-xl text-white"
            aria-label="Previous featured work"
          >
            <span aria-hidden="true">&larr;</span>
          </button>
          <button
            type="button"
            onClick={() => handleManualScrollToIndex(activeIndex + 1)}
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
              onClick={() => handleManualScrollToIndex(index)}
              className={`micro-button h-2.5 rounded-full ${index === activeIndex ? "w-10 bg-[#d7cdf5] shadow-[0_0_18px_rgba(183,148,246,0.5)]" : "w-2.5 bg-white/25 hover:bg-white/45"}`}
              aria-label={`Go to featured work ${index + 1}`}
            />
          ))}
        </div>

        <Link href={content?.cta?.href || "/portfolio"} className="glass-button">
          {content?.cta?.label || "View all work"}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
