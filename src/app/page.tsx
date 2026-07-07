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
      />
      <AboutOwner settings={homepage.settings} />
      <FeaturedWorks portfolioItems={homepage.featuredProjects} />
      <CategoryShowcase categories={homepage.categories} />
      <PricingPreview plans={homepage.services} settings={homepage.settings} />
      <Testimonials testimonials={homepage.testimonials} />
      <FAQ />
    </>
  );
}
