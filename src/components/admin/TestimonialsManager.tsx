"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TestimonialDto } from "@/lib/cms/mappers";

interface TestimonialsManagerProps {
  initialTestimonials: TestimonialDto[];
}

interface TestimonialDraft {
  id?: string;
  client_name: string;
  client_role: string;
  quote: string;
  rating: number;
  approved: boolean;
  featured: boolean;
  display_order: number;
}

const emptyDraft: TestimonialDraft = {
  client_name: "",
  client_role: "",
  quote: "",
  rating: 5,
  approved: false,
  featured: false,
  display_order: 0,
};

function testimonialToDraft(testimonial: TestimonialDto): TestimonialDraft {
  return {
    id: testimonial.id,
    client_name: testimonial.client_name,
    client_role: testimonial.client_role || "",
    quote: testimonial.quote,
    rating: testimonial.rating,
    approved: testimonial.approved,
    featured: testimonial.featured,
    display_order: testimonial.display_order,
  };
}

function draftToPayload(draft: TestimonialDraft) {
  return {
    client_name: draft.client_name,
    client_role: draft.client_role || null,
    quote: draft.quote,
    rating: Number(draft.rating) || 5,
    approved: draft.approved,
    featured: draft.featured,
    display_order: Number(draft.display_order) || 0,
  };
}

export default function TestimonialsManager({
  initialTestimonials,
}: TestimonialsManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialTestimonials);
  const [draft, setDraft] = useState<TestimonialDraft | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const saveDraft = async () => {
    if (!draft?.client_name.trim() || !draft.quote.trim()) {
      setError("Client name and quote are required.");
      return;
    }

    setStatus("saving");
    setError("");
    const response = await fetch(
      draft.id ? `/api/admin/testimonials/${draft.id}` : "/api/admin/testimonials",
      {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToPayload(draft)),
      }
    );
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("");
      setError(result?.error?.message || "Testimonial could not be saved.");
      return;
    }

    const saved = result.data as TestimonialDto;
    setItems((current) =>
      draft.id
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [...current, saved].sort((a, b) => a.display_order - b.display_order)
    );
    setDraft(null);
    setStatus("");
    router.refresh();
  };

  const deleteTestimonial = async (id: string) => {
    const response = await fetch(`/api/admin/testimonials/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Testimonial could not be deleted.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    router.refresh();
  };

  const toggleField = async (
    testimonial: TestimonialDto,
    field: "approved" | "featured"
  ) => {
    const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !testimonial[field] }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error?.message || "Testimonial could not be updated.");
      return;
    }

    const saved = result.data as TestimonialDto;
    setItems((current) =>
      current.map((item) => (item.id === saved.id ? saved : item))
    );
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#E8E8E8]">Testimonials</h1>
        <button
          type="button"
          onClick={() => setDraft({ ...emptyDraft, display_order: items.length + 1 })}
          className="px-4 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] text-[#E8E8E8] font-semibold rounded transition-colors"
        >
          + Add Testimonial
        </button>
      </div>

      {error && <p className="mb-6 text-red-400 text-sm font-semibold">{error}</p>}

      {draft && (
        <div className="bg-[#1B1E22] border border-[#252A31] rounded p-6 mb-8">
          <h2 className="text-xl font-bold text-[#E8E8E8] mb-6">
            {draft.id ? "Edit Testimonial" : "Create Testimonial"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={draft.client_name}
              onChange={(event) =>
                setDraft({ ...draft, client_name: event.target.value })
              }
              placeholder="Client name"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.client_role}
              onChange={(event) =>
                setDraft({ ...draft, client_role: event.target.value })
              }
              placeholder="Client role"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <textarea
              value={draft.quote}
              onChange={(event) => setDraft({ ...draft, quote: event.target.value })}
              placeholder="Quote"
              className="md:col-span-2 px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none min-h-24"
            />
            <input
              type="number"
              min={1}
              max={5}
              value={draft.rating}
              onChange={(event) =>
                setDraft({ ...draft, rating: Number(event.target.value) })
              }
              placeholder="Rating"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              type="number"
              value={draft.display_order}
              onChange={(event) =>
                setDraft({ ...draft, display_order: Number(event.target.value) })
              }
              placeholder="Display order"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <label className="flex items-center gap-3 text-[#E8E8E8]">
              <input
                type="checkbox"
                checked={draft.approved}
                onChange={(event) =>
                  setDraft({ ...draft, approved: event.target.checked })
                }
                className="w-5 h-5 accent-[#6E56CF]"
              />
              Approved
            </label>
            <label className="flex items-center gap-3 text-[#E8E8E8]">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(event) =>
                  setDraft({ ...draft, featured: event.target.checked })
                }
                className="w-5 h-5 accent-[#6E56CF]"
              />
              Featured
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={status === "saving"}
              className="px-5 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] disabled:opacity-60 text-[#E8E8E8] font-semibold rounded transition-colors"
            >
              {status === "saving" ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              className="px-5 py-2 bg-[#252A31] hover:bg-[#2F3440] text-[#E8E8E8] font-semibold rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#1B1E22] border border-[#252A31] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252A31]">
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Client
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Approved
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Featured
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((testimonial) => (
                <tr
                  key={testimonial.id}
                  className="border-b border-[#252A31] hover:bg-[#252A31]"
                >
                  <td className="px-6 py-4">
                    <p className="text-[#E8E8E8]">{testimonial.client_name}</p>
                    <p className="text-[#9CA3AF] text-sm">{testimonial.client_role}</p>
                  </td>
                  <td className="px-6 py-4 text-[#9CA3AF] text-sm">
                    {testimonial.rating}/5
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={testimonial.approved}
                      onChange={() => toggleField(testimonial, "approved")}
                      className="w-5 h-5 accent-[#6E56CF]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={testimonial.featured}
                      onChange={() => toggleField(testimonial, "featured")}
                      className="w-5 h-5 accent-[#6E56CF]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setDraft(testimonialToDraft(testimonial))}
                      className="text-[#6E56CF] hover:text-[#7C66DB] font-semibold text-sm transition-colors mr-4"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="text-[#9CA3AF] hover:text-red-400 font-semibold text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
