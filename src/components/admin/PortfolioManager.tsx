"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoryDto, PortfolioItemDto } from "@/lib/cms/mappers";

interface PortfolioManagerProps {
  initialItems: PortfolioItemDto[];
  categories: CategoryDto[];
}

interface PortfolioDraft {
  id?: string;
  title: string;
  slug?: string;
  short_description: string;
  full_description: string;
  category_id: string;
  thumbnail_url: string;
  gallery_images: string[];
  tags: string;
  featured: boolean;
  popularity_score: number;
  visibility: "public" | "private" | "draft";
  client_name: string;
  client_permission: boolean;
  external_link: string;
  discord_order_link: string;
}

const emptyDraft: PortfolioDraft = {
  title: "",
  short_description: "",
  full_description: "",
  category_id: "",
  thumbnail_url: "",
  gallery_images: [],
  tags: "",
  featured: false,
  popularity_score: 0,
  visibility: "draft",
  client_name: "",
  client_permission: false,
  external_link: "",
  discord_order_link: "",
};

function itemToDraft(item: PortfolioItemDto): PortfolioDraft {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    short_description: item.short_description || "",
    full_description: item.full_description || "",
    category_id: item.category_id || "",
    thumbnail_url: item.thumbnail_url || "",
    gallery_images: item.gallery_images || [],
    tags: item.tags.join(", "),
    featured: item.featured,
    popularity_score: item.popularity_score,
    visibility: item.visibility as PortfolioDraft["visibility"],
    client_name: item.client_name || "",
    client_permission: item.client_permission,
    external_link: item.external_link || "",
    discord_order_link: item.discord_order_link || "",
  };
}

function draftToPayload(draft: PortfolioDraft) {
  return {
    title: draft.title,
    slug: draft.slug || undefined,
    short_description: draft.short_description || null,
    full_description: draft.full_description || null,
    category_id: draft.category_id || null,
    thumbnail_url: draft.thumbnail_url || null,
    gallery_images: draft.gallery_images,
    tags: draft.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    featured: draft.featured,
    popularity_score: Number(draft.popularity_score) || 0,
    visibility: draft.visibility,
    client_name: draft.client_name || null,
    client_permission: draft.client_permission,
    external_link: draft.external_link || null,
    discord_order_link: draft.discord_order_link || null,
  };
}

async function uploadFiles(files: FileList, folder: string) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("files", file));
  formData.append("folder", folder);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Upload failed.");
  }

  return result.data.items as { file_url: string }[];
}

export default function PortfolioManager({
  initialItems,
  categories,
}: PortfolioManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [draft, setDraft] = useState<PortfolioDraft | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const saveDraft = async () => {
    if (!draft?.title.trim()) {
      setError("Title is required.");
      return;
    }

    setStatus("saving");
    setError("");

    console.log("[PORTFOLIO_MANAGER] saveDraft - Sending payload:", draftToPayload(draft));

    const response = await fetch(
      draft.id ? `/api/admin/portfolio/${draft.id}` : "/api/admin/portfolio",
      {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToPayload(draft)),
      }
    );

    console.log("[PORTFOLIO_MANAGER] Response status:", response.status, response.ok);

    const result = await response.json().catch(() => null);

    console.log("[PORTFOLIO_MANAGER] Response body:", result);

    if (!response.ok) {
      setStatus("");
      const errorMsg = result?.error?.message || "Portfolio item could not be saved.";
      console.error("[PORTFOLIO_MANAGER] Error:", errorMsg);
      setError(errorMsg);
      return;
    }

    console.log("[PORTFOLIO_MANAGER] Success, saved item:", result.data?.id);
    const saved = result.data as PortfolioItemDto;
    setItems((current) =>
      draft.id
        ? current.map((item) => (item.id === saved.id ? saved : item))
        : [saved, ...current]
    );
    setDraft(null);
    setStatus("");
    router.refresh();
  };

  const deleteItem = async (id: string) => {
    const response = await fetch(`/api/admin/portfolio/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Portfolio item could not be deleted.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    router.refresh();
  };

  const toggleFeatured = async (item: PortfolioItemDto) => {
    const response = await fetch(`/api/admin/portfolio/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !item.featured }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error?.message || "Featured status could not be saved.");
      return;
    }

    const saved = result.data as PortfolioItemDto;
    setItems((current) =>
      current.map((currentItem) => (currentItem.id === saved.id ? saved : currentItem))
    );
    router.refresh();
  };

  const uploadThumbnail = async (files: FileList | null) => {
    if (!files?.length || !draft) return;

    try {
      setStatus("uploading");
      const [uploaded] = await uploadFiles(files, "portfolio/thumbnails");
      setDraft({ ...draft, thumbnail_url: uploaded.file_url });
      setStatus("");
    } catch (uploadError) {
      setStatus("");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  };

  const uploadGallery = async (files: FileList | null) => {
    if (!files?.length || !draft) return;

    try {
      setStatus("uploading");
      const uploaded = await uploadFiles(files, "portfolio/gallery");
      setDraft({
        ...draft,
        gallery_images: [
          ...draft.gallery_images,
          ...uploaded.map((file) => file.file_url),
        ],
      });
      setStatus("");
    } catch (uploadError) {
      setStatus("");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#E8E8E8]">Portfolio Manager</h1>
        <button
          type="button"
          onClick={() => setDraft({ ...emptyDraft })}
          className="px-4 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] text-[#E8E8E8] font-semibold rounded transition-colors"
        >
          + Add New Item
        </button>
      </div>

      {error && <p className="mb-6 text-red-400 text-sm font-semibold">{error}</p>}

      {draft && (
        <div className="bg-[#1B1E22] border border-[#252A31] rounded p-6 mb-8">
          <h2 className="text-xl font-bold text-[#E8E8E8] mb-6">
            {draft.id ? "Edit Portfolio Item" : "Create Portfolio Item"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Title"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <select
              value={draft.category_id}
              onChange={(event) =>
                setDraft({ ...draft, category_id: event.target.value })
              }
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.database_id} value={category.database_id}>
                  {category.label}
                </option>
              ))}
            </select>
            <input
              value={draft.short_description}
              onChange={(event) =>
                setDraft({ ...draft, short_description: event.target.value })
              }
              placeholder="Short description"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.tags}
              onChange={(event) => setDraft({ ...draft, tags: event.target.value })}
              placeholder="Tags, comma separated"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <textarea
              value={draft.full_description}
              onChange={(event) =>
                setDraft({ ...draft, full_description: event.target.value })
              }
              placeholder="Full description"
              className="md:col-span-2 px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none min-h-24"
            />
            <input
              value={draft.thumbnail_url}
              onChange={(event) =>
                setDraft({ ...draft, thumbnail_url: event.target.value })
              }
              placeholder="Thumbnail URL"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => uploadThumbnail(event.target.files)}
              className="text-[#9CA3AF] text-sm"
            />
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => uploadGallery(event.target.files)}
              className="text-[#9CA3AF] text-sm"
            />
            <input
              value={draft.gallery_images.join(", ")}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  gallery_images: event.target.value
                    .split(",")
                    .map((url) => url.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Gallery URLs, comma separated"
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
            <input
              value={draft.external_link}
              onChange={(event) =>
                setDraft({ ...draft, external_link: event.target.value })
              }
              placeholder="External link"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.client_name}
              onChange={(event) =>
                setDraft({ ...draft, client_name: event.target.value })
              }
              placeholder="Client name"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              type="number"
              value={draft.popularity_score}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  popularity_score: Number(event.target.value),
                })
              }
              placeholder="Popularity score"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <select
              value={draft.visibility}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  visibility: event.target.value as PortfolioDraft["visibility"],
                })
              }
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
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
                checked={draft.client_permission}
                onChange={(event) =>
                  setDraft({ ...draft, client_permission: event.target.checked })
                }
                className="w-5 h-5 accent-[#6E56CF]"
              />
              Client permission
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={saveDraft}
              disabled={status === "saving" || status === "uploading"}
              className="px-5 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] disabled:opacity-60 text-[#E8E8E8] font-semibold rounded transition-colors"
            >
              {status === "saving"
                ? "Saving..."
                : status === "uploading"
                ? "Uploading..."
                : "Save"}
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
                  Title
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Featured
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-[#252A31] hover:bg-[#252A31]"
                >
                  <td className="px-6 py-4 text-[#E8E8E8]">{item.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#252A31] text-[#9CA3AF] text-xs rounded capitalize">
                      {item.category.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={item.featured}
                      onChange={() => toggleFeatured(item)}
                      className="w-5 h-5 accent-[#6E56CF]"
                    />
                  </td>
                  <td className="px-6 py-4 text-[#9CA3AF] text-sm">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setDraft(itemToDraft(item))}
                      className="text-[#6E56CF] hover:text-[#7C66DB] font-semibold text-sm transition-colors mr-4"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
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
