"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

export default function HeroArtwork() {
  const [isHovered, setIsHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const transformStyle = useMemo(() => {
    const tiltX = pointer.y * -3.5;
    const tiltY = pointer.x * 4.5;

    return {
      ["--hero-tilt-x" as string]: `${tiltX}deg`,
      ["--hero-tilt-y" as string]: `${tiltY}deg`,
      ["--hero-pan-x" as string]: `${pointer.x * 10}px`,
      ["--hero-pan-y" as string]: `${pointer.y * 8}px`,
    } as CSSProperties;
  }, [pointer.x, pointer.y]);

  return (
    <div className="hero-artwork-stage relative w-full max-w-[42rem] lg:ml-auto lg:mr-0">
      <div className="hero-artwork-ambient absolute -inset-x-10 -top-8 h-[92%] rounded-full bg-[radial-gradient(circle,rgba(183,148,246,0.2),transparent_70%)] blur-3xl" />
      <div className="hero-artwork-ambient hero-artwork-ambient-low absolute inset-x-8 -bottom-8 h-32 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.2),transparent_72%)] blur-2xl" />

      <div
        className={`hero-artwork-shell relative overflow-hidden rounded-[2rem] border border-[rgba(157,110,255,0.3)] bg-[#0b1016] shadow-[0_42px_120px_-62px_rgba(139,92,246,0.34)] ${isHovered ? "hero-artwork-shell-hover" : ""}`}
        style={transformStyle}
        aria-label="Cosmic Flare promotional artwork"
      >
        <div className="hero-artwork-image-motion relative aspect-[16/10] min-h-[24rem] w-full overflow-hidden rounded-[1.8rem] sm:min-h-[28rem] lg:min-h-[36rem]">
          <div className="hero-artwork-image-plane absolute -inset-4">
            <Image
              src="/assets/cosmic-flare-hero.png"
              alt="Cosmic Flare promotional artwork"
              fill
              priority
              className={`hero-artwork-image object-cover ${isHovered ? "hero-artwork-image-hover" : ""}`}
              sizes="(max-width: 1024px) 100vw, 42rem"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(183,148,246,0.12),transparent_42%),linear-gradient(180deg,rgba(8,11,16,0.02),rgba(8,11,16,0.18))]" />
          <div className="pointer-events-none absolute inset-0 rounded-[1.8rem] ring-1 ring-inset ring-white/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(circle_at_bottom,rgba(139,92,246,0.24),transparent_70%)] opacity-80 transition-opacity duration-500" />
        </div>
      </div>

      <div
        className="absolute inset-0 z-10 rounded-[2rem]"
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => {
          setIsHovered(false);
          setPointer({ x: 0, y: 0 });
        }}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

          setPointer({ x, y });
        }}
      />
    </div>
  );
}
