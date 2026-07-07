import { testimonials as staticTestimonials } from "@/data/testimonials";
import type { Testimonial } from "@/data/testimonials";
import type { TestimonialDto } from "@/lib/cms/mappers";

interface TestimonialsProps {
  testimonials?: (Testimonial | TestimonialDto)[];
}

export default function Testimonials({
  testimonials = staticTestimonials,
}: TestimonialsProps) {
  const accentColors = [
    "from-white/8 to-transparent",
    "from-[#8b5cf6]/10 via-transparent to-transparent",
    "from-transparent to-[#b794f6]/10",
    "from-[#8b5cf6]/6 to-transparent",
    "from-white/5 via-transparent to-[#8b5cf6]/8",
  ];

  return (
    <section className="section-shell bg-[#0f141b]">
      <div className="section-grid" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl">
          <span className="section-kicker mb-5">Testimonials</span>
          <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl">
            Client Stories
          </h2>
          <p className="section-copy mt-5 text-lg">
            What creators and studios say about working with me.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.id}
              className={`testimonial-card surface-panel relative flex h-full flex-col overflow-hidden rounded-[1.85rem] bg-gradient-to-br p-8 sm:p-10 ${accentColors[idx % accentColors.length]} ${
                idx === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-6 flex gap-1.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-[#b794f6] text-xl">
                      ★
                    </span>
                  ))}
                </div>

                <blockquote className="mb-8 flex-1">
                  <p className="text-lg leading-8 text-white sm:text-xl">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </blockquote>

                <div className="border-t border-white/10 pt-6">
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="mt-1 text-sm text-[#9aa7b9]">{testimonial.role}</p>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#8b5cf6] via-[#b794f6] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">
          <div className="testimonial-card surface-panel rounded-[1.5rem] p-6">
            <p className="text-4xl font-semibold text-white">98%</p>
            <p className="mt-2 text-sm text-[#9aa7b9]">Satisfaction rate</p>
          </div>
          <div className="testimonial-card surface-panel rounded-[1.5rem] p-6">
            <p className="text-4xl font-semibold text-white">50+</p>
            <p className="mt-2 text-sm text-[#9aa7b9]">Testimonials</p>
          </div>
          <div className="testimonial-card surface-panel rounded-[1.5rem] p-6">
            <p className="text-4xl font-semibold text-white">200+</p>
            <p className="mt-2 text-sm text-[#9aa7b9]">Happy creators</p>
          </div>
        </div>
      </div>
    </section>
  );
}
