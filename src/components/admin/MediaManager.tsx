"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaDto } from "@/lib/cms/mappers";

interface MediaManagerProps {
  initialMedia: MediaDto[];
}

function formatSize(size: number | null) {
  if (!size) return "-";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

async function uploadMedia(files: FileList, replaceMediaId?: string) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("files", file));
  formData.append("folder", "media-library");

  if (replaceMediaId) {
    formData.append("replace_media_id", replaceMediaId);
  }

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Upload failed.");
  }

  return result.data.items as MediaDto[];
}

export default function MediaManager({ initialMedia }: MediaManagerProps) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState(initialMedia);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    try {
      setStatus("uploading");
      setError("");
      const uploaded = await uploadMedia(files);
      setUploadedFiles((current) => [...uploaded, ...current]);
      setStatus("");
      router.refresh();
    } catch (uploadError) {
      setStatus("");
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    }
  };

  const handleReplace = async (id: string, files: FileList | null) => {
    if (!files?.length) return;

    try {
      setStatus("uploading");
      setError("");
      const [replacement] = await uploadMedia(files, id);
      setUploadedFiles((current) =>
        current.map((file) => (file.id === id ? replacement : file))
      );
      setStatus("");
      router.refresh();
    } catch (uploadError) {
      setStatus("");
      setError(uploadError instanceof Error ? uploadError.message : "Replace failed.");
    }
  };

  const deleteFile = async (id: string) => {
    const response = await fetch(`/api/admin/media/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setError(result?.error?.message || "File could not be deleted.");
      return;
    }

    setUploadedFiles((current) => current.filter((file) => file.id !== id));
    router.refresh();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#E8E8E8]">Media Manager</h1>
        <label className="px-4 py-2 bg-[#6E56CF] hover:bg-[#7C66DB] text-[#E8E8E8] font-semibold rounded transition-colors cursor-pointer">
          {status === "uploading" ? "Uploading..." : "+ Upload Files"}
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => handleUpload(event.target.files)}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="mb-6 text-red-400 text-sm font-semibold">{error}</p>}

      <label className="block mb-12 p-8 border-2 border-dashed border-[#252A31] hover:border-[#6E56CF] rounded bg-[#1B1E22] transition-colors cursor-pointer">
        <div className="text-center">
          <p className="text-[#E8E8E8] font-semibold mb-2">
            Drag and drop files here
          </p>
          <p className="text-[#9CA3AF] text-sm">
            or click to browse your computer
          </p>
        </div>
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => handleUpload(event.target.files)}
          className="hidden"
        />
      </label>

      <div className="bg-[#1B1E22] border border-[#252A31] rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#252A31]">
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  File Name
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Size
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Upload Date
                </th>
                <th className="px-6 py-4 text-left text-[#9CA3AF] font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-[#252A31] hover:bg-[#252A31]"
                >
                  <td className="px-6 py-4 text-[#E8E8E8]">{file.file_name}</td>
                  <td className="px-6 py-4 text-[#9CA3AF] text-sm">
                    {formatSize(file.file_size)}
                  </td>
                  <td className="px-6 py-4 text-[#9CA3AF] text-sm">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6E56CF] hover:text-[#7C66DB] font-semibold text-sm transition-colors mr-4"
                    >
                      View
                    </a>
                    <label className="text-[#6E56CF] hover:text-[#7C66DB] font-semibold text-sm transition-colors mr-4 cursor-pointer">
                      Replace
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) => handleReplace(file.id, event.target.files)}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteFile(file.id)}
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
