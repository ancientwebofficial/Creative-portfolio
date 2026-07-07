"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomepageBlockDto } from "@/lib/cms/mappers";

interface HomeArrangementProps {
  initialBlocks: HomepageBlockDto[];
}

interface BlockDraft {
  id?: string;
  block_type: string;
  title: string;
  subtitle: string;
  content: string;
  image_url: string;
  linked_portfolio_ids: string;
  alignment: string;
  style_variant: string;
  visibility: "public" | "private" | "draft";
  display_order: number;
}

const emptyDraft: BlockDraft = {
  block_type: "editorial",
  title: "",
  subtitle: "",
  content: "",
  image_url: "",
  linked_portfolio_ids: "",
  alignment: "left",
  style_variant: "default",
  visibility: "draft",
  display_order: 0,
};

function blockToDraft(block: HomepageBlockDto): BlockDraft {
  return {
    id: block.id,
    block_type: block.block_type,
    title: block.title || "",
    subtitle: block.subtitle || "",
    content: block.content || "",
    image_url: block.image_url || "",
    linked_portfolio_ids: block.linked_portfolio_ids.join(", "),
    alignment: block.alignment,
    style_variant: block.style_variant,
    visibility: block.visibility as BlockDraft["visibility"],
    display_order: block.display_order,
  };
}

function draftToPayload(draft: BlockDraft) {
  return {
    block_type: draft.block_type,
    title: draft.title || null,
    subtitle: draft.subtitle || null,
    content: draft.content || null,
    image_url: draft.image_url || null,
    linked_portfolio_ids: draft.linked_portfolio_ids
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
    alignment: draft.alignment,
    style_variant: draft.style_variant,
    visibility: draft.visibility,
    display_order: Number(draft.display_order) || 0,
  };
}

export default function HomeArrangement({ initialBlocks }: HomeArrangementProps) {
  const router = useRouter();
  const [blocks, setBlocks] = useState(initialBlocks);
  const [draft, setDraft] = useState<BlockDraft | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const saveDraft = async () => {
    if (!draft?.block_type.trim()) {
      setError("Block type is required.");
      return;
    }

    setStatus("saving");
    setError("");
    const response = await fetch(
      draft.id
        ? `/api/admin/homepage-blocks/${draft.id}`
        : "/api/admin/homepage-blocks",
      {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftToPayload(draft)),
      }
    );
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("");
      setError(result?.error?.message || "Homepage block could not be saved.");
      return;
    }

    const saved = result.data as HomepageBlockDto;
    setBlocks((current) =>
      draft.id
        ? current.map((block) => (block.id === saved.id ? saved : block))
        : [...current, saved].sort((a, b) => a.display_order - b.display_order)
    );
    setDraft(null);
    setStatus("");
    router.refresh();
  };

  const deleteBlock = async (id: string) => {
    const response = await fetch(`/api/admin/homepage-blocks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Homepage block could not be deleted.");
      return;
    }

    setBlocks((current) => current.filter((block) => block.id !== id));
    router.refresh();
  };

  const updateBlock = async (id: string, payload: Partial<HomepageBlockDto>) => {
    const response = await fetch(`/api/admin/homepage-blocks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setError(result?.error?.message || "Homepage block could not be updated.");
      return null;
    }

    return result.data as HomepageBlockDto;
  };

  const toggleVisibility = async (block: HomepageBlockDto) => {
    const saved = await updateBlock(block.id, {
      visibility: block.visibility === "public" ? "draft" : "public",
    });

    if (!saved) return;

    setBlocks((current) =>
      current.map((item) => (item.id === saved.id ? saved : item))
    );
    router.refresh();
  };

  const moveBlock = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const current = blocks[index];
    const target = blocks[targetIndex];
    const [savedCurrent, savedTarget] = await Promise.all([
      updateBlock(current.id, { display_order: target.display_order }),
      updateBlock(target.id, { display_order: current.display_order }),
    ]);

    if (!savedCurrent || !savedTarget) return;

    const reordered = [...blocks];
    reordered[index] = savedTarget;
    reordered[targetIndex] = savedCurrent;
    setBlocks(reordered);
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#E8E8E8]">
          Homepage Arrangement
        </h1>
        <button
          type="button"
          onClick={() => setDraft({ ...emptyDraft, display_order: blocks.length + 1 })}
          className="px-4 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] text-[#E8E8E8] font-semibold rounded transition-colors"
        >
          + Add Block
        </button>
      </div>

      {error && <p className="mb-6 text-red-400 text-sm font-semibold">{error}</p>}

      {draft && (
        <div className="bg-[#1B1E22] border border-[#252A31] rounded p-6 mb-8">
          <h2 className="text-xl font-bold text-[#E8E8E8] mb-6">
            {draft.id ? "Edit Homepage Block" : "Create Homepage Block"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={draft.block_type}
              onChange={(event) =>
                setDraft({ ...draft, block_type: event.target.value })
              }
              placeholder="Block type"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              placeholder="Title"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.subtitle}
              onChange={(event) =>
                setDraft({ ...draft, subtitle: event.target.value })
              }
              placeholder="Subtitle"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.image_url}
              onChange={(event) =>
                setDraft({ ...draft, image_url: event.target.value })
              }
              placeholder="Image URL"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <textarea
              value={draft.content}
              onChange={(event) =>
                setDraft({ ...draft, content: event.target.value })
              }
              placeholder="Content"
              className="md:col-span-2 px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none min-h-24"
            />
            <input
              value={draft.linked_portfolio_ids}
              onChange={(event) =>
                setDraft({ ...draft, linked_portfolio_ids: event.target.value })
              }
              placeholder="Linked portfolio UUIDs, comma separated"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <input
              value={draft.style_variant}
              onChange={(event) =>
                setDraft({ ...draft, style_variant: event.target.value })
              }
              placeholder="Style variant"
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            />
            <select
              value={draft.alignment}
              onChange={(event) =>
                setDraft({ ...draft, alignment: event.target.value })
              }
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
              <option value="split-left">Split left</option>
              <option value="split-right">Split right</option>
            </select>
            <select
              value={draft.visibility}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  visibility: event.target.value as BlockDraft["visibility"],
                })
              }
              className="px-4 py-2 bg-[#252A31] text-[#E8E8E8] border border-[#2F3440] rounded focus:border-[#6E56CF] focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
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
        <div className="space-y-1">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="flex items-center justify-between p-4 border-b border-[#252A31] hover:bg-[#252A31] transition-colors last:border-b-0"
            >
              <div className="flex items-center gap-4 flex-1">
                <input
                  type="checkbox"
                  checked={block.visibility === "public"}
                  onChange={() => toggleVisibility(block)}
                  className="w-5 h-5 accent-[#6E56CF]"
                />
                <div>
                  <span className="text-[#E8E8E8] font-medium">
                    {block.title || block.block_type}
                  </span>
                  <p className="text-[#9CA3AF] text-sm">{block.block_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDraft(blockToDraft(block))}
                  className="p-2 text-[#6E56CF] hover:text-[#7C66DB] transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteBlock(block.id)}
                  className="p-2 text-[#9CA3AF] hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                  className="p-2 text-[#9CA3AF] hover:text-[#E8E8E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === blocks.length - 1}
                  className="p-2 text-[#9CA3AF] hover:text-[#E8E8E8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Down
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
