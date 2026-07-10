import Hero from "@/components/home/Hero";
import FeaturedWorks from "@/components/home/FeaturedWorks";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import AboutOwner from "@/components/home/AboutOwner";
import PricingPreview from "@/components/home/PricingPreview";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import ViewportReveal from "@/components/shared/ViewportReveal";
import { getHomepageData } from "@/lib/cms/public-data";

export default async function Home() {
  const homepage = await getHomepageData();

  return (
    <>
      <ViewportReveal />
      <Hero
        portfolioItems={homepage.featuredProjects}
        settings={homepage.settings}
        content={homepage.payload?.homepage.hero}
      />
      <FeaturedWorks
        portfolioItems={homepage.featuredProjects}
        content={homepage.payload?.homepage.featuredWork}
      />
      <AboutOwner
        settings={homepage.settings}
        content={homepage.payload?.homepage.ownerProfilePresentation}
      />
      <CategoryShowcase
        categories={homepage.categories}
        content={homepage.payload?.homepage.servicesPresentation}
      />
      <Testimonials
        testimonials={homepage.testimonials}
        content={homepage.payload?.homepage.testimonialsPresentation}
      />
      <PricingPreview
        plans={homepage.services}
        settings={homepage.settings}
        content={homepage.payload?.homepage.pricingPresentation}
      />
      <FAQ
        items={homepage.faqs}
        content={homepage.payload?.homepage.faqPresentation}
      />
    </>
  );
}
