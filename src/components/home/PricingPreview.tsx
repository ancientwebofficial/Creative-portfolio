import type { Plan } from "@/data/plans";
import type { ServiceDto, SiteSettingsDto } from "@/lib/cms/mappers";
import Link from "next/link";

type PricingPlan = Plan | ServiceDto;

interface PricingPreviewProps {
  plans?: PricingPlan[];
  settings?: SiteSettingsDto | null;
  content?: {
    enabled?: boolean | null;
    eyebrow?: string | null;
    heading?: string | null;
    description?: string | null;
    highlightBadge?: string | null;
    priceSuffix?: string | null;
    moreFeaturesLabel?: string | null;
    planCtaLabel?: string | null;
    customPackageHeading?: string | null;
    customPackageFallbackKicker?: string | null;
    customPackageOwnerKickerTemplate?: string | null;
    customPackageDescription?: string | null;
    customPackageCta?: { label?: string | null; href?: string | null; newTab?: boolean | null } | null;
  } | null;
}

export default function PricingPreview({
  plans = [],
  settings,
  content,
}: PricingPreviewProps) {
  if (content?.enabled === false) {
    return null;
  }

  const planColors = [
    "from-white/8 to-transparent",
    "from-[#8b5cf6]/10 via-[#8b5cf6]/5 to-transparent",
    "from-transparent via-white/5 to-[#b794f6]/10",
  ];

  return (
    <section id="pricing" className="section-shell bg-[#0c1118]">
      <div className="section-grid" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="section-kicker mb-5">{content?.eyebrow || "Pricing"}</span>
          <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl">
            {content?.heading || "Simple, Transparent Pricing"}
          </h2>
          <p className="section-copy mt-5 text-lg">
            {content?.description || "Flexible rates for custom Minecraft creative work. Each project tailored to your needs."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={plan.id}
              className={`pricing-card surface-panel relative overflow-hidden rounded-[1.85rem] bg-gradient-to-br p-8 sm:p-10 ${planColors[idx % planColors.length]} ${
                plan.highlighted ? "ring-1 ring-[#b794f6]/45" : ""
              }`}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-8">
                  {plan.highlighted && (
                    <div className="mb-4 inline-flex rounded-full border border-[#8b5cf6]/25 bg-[#8b5cf6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#b794f6]">
                      {content?.highlightBadge || "Most Popular"}
                    </div>
                  )}
                  <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#9aa7b9]">{plan.description}</p>
                </div>

                <div className="mb-8 border-b border-white/10 pb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-semibold text-white">${plan.price}</span>
                    <span className="pb-1 text-sm text-[#9aa7b9]">{content?.priceSuffix || "/ project"}</span>
                  </div>
                </div>

                <ul className="mb-8 flex-1 space-y-4">
                  {plan.features.slice(0, 4).map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-3 text-sm text-[#c5d0df]">
                      <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#8b5cf6]/12 text-xs font-bold text-[#b794f6]">
                        ✓
                      </span>
                      <span className="leading-7">{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="flex items-start gap-3 text-sm text-[#9aa7b9]">
                      <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-white/8 text-xs font-bold text-white">
                        +
                      </span>
                      <span>{plan.features.length - 4} {content?.moreFeaturesLabel || "more features"}</span>
                    </li>
                  )}
                </ul>

                <a
                  href={plan.orderUrl || "/contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`micro-button inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-[#8b5cf6] to-[#b794f6] text-white"
                      : "border border-white/10 bg-white/5 text-white hover:border-[#8b5cf6]/35 hover:bg-white/10"
                  }`}
                >
                  {content?.planCtaLabel || "Get started"}
                  <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">{content?.customPackageHeading || "Need a custom package?"}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#9aa7b9]">
              {settings?.owner_name
                ? (content?.customPackageOwnerKickerTemplate || "Work directly with {ownerName}").replace("{ownerName}", settings.owner_name)
                : content?.customPackageFallbackKicker || "Direct owner contact"}
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[#9aa7b9]">
              {content?.customPackageDescription || "Bulk rates and specialized projects available. Let's discuss your needs."}
            </p>
          </div>
          <Link
            href={content?.customPackageCta?.href || "/contact"}
            target={content?.customPackageCta?.newTab ? "_blank" : undefined}
            rel={content?.customPackageCta?.newTab ? "noopener noreferrer" : undefined}
            className="glass-button"
          >
            {content?.customPackageCta?.label || "Contact"}
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
