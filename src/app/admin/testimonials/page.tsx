import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { getCmsAdminContext } from "@/lib/cms/admin";
import { listTestimonials } from "@/lib/cms/repositories";

export default async function AdminTestimonialsPage() {
  const { supabase } = await getCmsAdminContext();
  const testimonials = await listTestimonials(supabase, {
    includeUnapproved: true,
  });

  return <TestimonialsManager initialTestimonials={testimonials} />;
}
