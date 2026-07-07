"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ServiceDto } from "@/lib/cms/mappers";

interface PlansManagerProps {
  initialServices: ServiceDto[];
}

interface ServiceDraft {
  database_id?: string;
  title: string;
  slug?: string;
  short_description: string;
  full_description: string;
  starting_price: number;
  delivery_time: string;
  revisions: string;
  feature_list: string;
  featured: boolean;
  discord_order_link: string;
  active: boolean;
  display_order: number;
}

const emptyDraft: ServiceDraft = {
  title: "",
  short_description: "",
  full_description: "",
  starting_price: 0,
  delivery_time: "",
  revisions: "",
  feature_list: "",
  featured: false,
  discord_order_link: "",
  active: true,
  display_order: 0,
};

function serviceToDraft(service: ServiceDto): ServiceDraft {
  return {
    database_id: service.database_id,
    title: service.title,
    slug: service.slug,
    short_description: service.short_description || "",
    full_description: service.full_description || "",
    starting_price: service.starting_price,
    delivery_time: service.delivery_time || "",
    revisions: service.revisions || "",
    feature_list: service.feature_list.join("\n"),
    featured: service.featured,
    discord_order_link: service.discord_order_link || "",
    active: service.active,
    display_order: service.display_order,
  };
}

function draftToPayload(draft: ServiceDraft) {
  return {
    title: draft.title,
    slug: draft.slug || undefined,
    short_description: draft.short_description || null,
    full_description: draft.full_description || null,
    starting_price: Number(draft.starting_price) || 0,
    delivery_time: draft.delivery_time || null,
    revisions: draft.revisions || null,
    feature_list: draft.feature_list
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean),
    featured: draft.featured,
    discord_order_link: draft.discord_order_link || null,
    active: draft.active,
    display_order: Number(draft.display_order) || 0,
  };
}

export default function PlansManager({ initialServices }: PlansManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialServices);
  const [draft, setDraft] = useState<ServiceDraft | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const saveDraft = async () => {
    if (!draft?.title.trim()) {
      setError("Service title is required.");
      return;
    }

    setStatus("saving");
    setError("");
    const response = await fetch(
      draft.database_id
        ? `/api/admin/services/${draft.database_id}`
        : "/api/admin/services",
      {
        method: draft.database_id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToPayload(draft)),
      }
    );
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("");
      setError(result?.error?.message || "Service could not be saved.");
      return;
    }

    const saved = result.data as ServiceDto;
    setItems((current) =>
      draft.database_id
        ? current.map((item) =>
            item.database_id === saved.database_id ? saved : item
          )
        : [...current, saved].sort((a, b) => a.display_order - b.display_order)
    );
    setDraft(null);
    setStatus("");
    router.refresh();
  };

  const deleteService = async (service: ServiceDto) => {
    const response = await fetch(`/api/admin/services/${service.database_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Service could not be deleted.");
      return;
    }

    setItems((current) =>
      current.filter((item) => item.database_id !== service.database_id)
    );
    router.refresh();
  };

  const moveService = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const current = items[index];
    const target = items[targetIndex];
    const response = await Promise.all([
      fetch(`/api/admin/services/${current.database_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: target.display_order }),
      }),
      fetch(`/api/admin/services/${target.database_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_order: current.display_order }),
      }),
    ]);

    if (response.some((result) => !result.ok)) {
      setError("Service order could not be saved.");
      return;
    }

    const reordered = [...items];
    reordered[index] = { ...target, display_order: current.display_order };
    reordered[targetIndex] = { ...current, display_order: target.display_order };
    setItems(reordered);
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#E8E8E8]">Plans Manager</h1>
        <button
          type="button"
          onClick={() => setDraft({ ...emptyDraft, display_order: items.length + 1 })}
          className="px-4 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] text-[#E8E8E8] font-semibold rounded transition-colors"
        >
          + Create Plan
        </button>
      </div>

      {error && <p className="mb-6 text-red-400 text-sm font-semibold">{error}</p>}

      {draft && (
        <div className="bg-[#1B1E22] border border-[#252A31] rounded p-6 mb-8">
          <h2 className="text-xl font-bold text-[#E8E8E8] mb-6">
            {draft.database_id ? "Edit Service" : "Create Service"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Title"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              type="number"
              value={draft.starting_price}
              onChange={(event) =>
                setDraft({ ...draft, starting_price: Number(event.target.value) })
              }
              placeholder="Starting price"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.short_description}
              onChange={(event) =>
                setDraft({ ...draft, short_description: event.target.value })
              }
              placeholder="Short description"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.delivery_time}
              onChange={(event) =>
                setDraft({ ...draft, delivery_time: event.target.value })
              }
              placeholder="Delivery time"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.revisions}
              onChange={(event) =>
                setDraft({ ...draft, revisions: event.target.value })
              }
              placeholder="Revisions"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.discord_order_link}
              onChange={(event) =>
                setDraft({ ...draft, discord_order_link: event.target.value })
              }
              placeholder="Discord order link"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <textarea
              value={draft.full_description}
              onChange={(event) =>
                setDraft({ ...draft, full_description: event.target.value })
              }
              placeholder="Full description"
              className="md:col-span-2 px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none min-h-20"
            />
            <textarea
              value={draft.feature_list}
              onChange={(event) =>
                setDraft({ ...draft, feature_list: event.target.value })
              }
              placeholder="Features, one per line"
              className="md:col-span-2 px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none min-h-28"
            />
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
            <label className="flex items-center gap-3 text-[#E8E8E8]">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) =>
                  setDraft({ ...draft, active: event.target.checked })
                }
                className="w-5 h-5 accent-[#6E56CF]"
              />
              Active
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((plan, index) => (
          <div
            key={plan.database_id}
            className={`p-6 rounded border transition-all ${
              draft?.database_id === plan.database_id
                ? "border-[#6E56CF] bg-[#252A31]"
                : "border-[#252A31] bg-[#1B1E22] hover:border-[#6E56CF]"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#E8E8E8]">{plan.name}</h3>
                <p className="text-[#9CA3AF] text-sm">{plan.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft(serviceToDraft(plan))}
                className="text-[#6E56CF] hover:text-[#7C66DB] transition-colors"
              >
                âœŽ
              </button>
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold text-[#E8E8E8]">${plan.price}</p>
              <p className="text-[#9CA3AF] text-sm">{plan.currency} / project</p>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.slice(0, 3).map((feature) => (
                <li key={feature} className="text-[#9CA3AF] text-sm flex gap-2">
                  <span>âœ“</span>
                  <span>{feature}</span>
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-[#6E56CF] text-sm">
                  +{plan.features.length - 3} more features
                </li>
              )}
            </ul>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDraft(serviceToDraft(plan))}
                className="flex-1 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] text-[#E8E8E8] font-semibold rounded text-sm transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteService(plan)}
                className="flex-1 py-2 bg-[#252A31] hover:bg-[#2F3440] text-[#E8E8E8] font-semibold rounded text-sm transition-colors"
              >
                Delete
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => moveService(index, -1)}
                disabled={index === 0}
                className="flex-1 py-2 bg-[#252A31] hover:bg-[#2F3440] disabled:opacity-50 text-[#E8E8E8] font-semibold rounded text-sm transition-colors"
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => moveService(index, 1)}
                disabled={index === items.length - 1}
                className="flex-1 py-2 bg-[#252A31] hover:bg-[#2F3440] disabled:opacity-50 text-[#E8E8E8] font-semibold rounded text-sm transition-colors"
              >
                Down
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
