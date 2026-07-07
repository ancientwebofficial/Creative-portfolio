import { randomUUID } from "crypto";
import { SUPABASE_MEDIA_BUCKET } from "@/lib/supabase/config";
import type { CmsClient } from "./repositories";
import { allowedUploadTypes, maxUploadBytes } from "./schemas";
import {
  createMediaRecord,
  deleteMediaRecord,
  throwSupabaseMutationError,
} from "./repositories";
import type { CmsUser } from "@/lib/auth/guards";

export class UploadValidationError extends Error {
  status = 422;

  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();

  if (fromName && ["png", "jpg", "jpeg", "webp"].includes(fromName)) {
    return fromName;
  }

  switch (file.type) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

async function getImageDimensions(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (
    buffer.length >= 24 &&
    buffer.toString("ascii", 1, 4) === "PNG"
  ) {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;

    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }

      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      const isStartOfFrame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        ![0xc4, 0xc8, 0xcc].includes(marker);

      if (isStartOfFrame) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5),
        };
      }

      offset += 2 + length;
    }
  }

  if (
    buffer.length >= 30 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buffer.toString("ascii", 12, 16);

    if (chunk === "VP8X") {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }

    if (chunk === "VP8L") {
      const bits = buffer.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    if (chunk === "VP8 " && buffer.length >= 30) {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }
  }

  return { width: null, height: null };
}

export function validateUpload(file: File) {
  if (!allowedUploadTypes.includes(file.type as (typeof allowedUploadTypes)[number])) {
    throw new UploadValidationError("Only PNG, JPG, and WEBP files are supported.");
  }

  if (file.size > maxUploadBytes) {
    throw new UploadValidationError("Images must be 10 MB or smaller.");
  }
}

export async function uploadImage(
  supabase: CmsClient,
  file: File,
  profile: CmsUser,
  options: { altText?: string | null; folder?: string; replaceMediaId?: string | null } = {}
) {
  validateUpload(file);

  const folder = options.folder || "portfolio";
  const dimensions = await getImageDimensions(file);
  const extension = extensionFor(file);
  const storagePath = `${folder}/${new Date().getFullYear()}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throwSupabaseMutationError(uploadError, {
      table: "storage.objects",
      operation: "insert",
    });
  }

  const { data } = supabase.storage
    .from(SUPABASE_MEDIA_BUCKET)
    .getPublicUrl(storagePath);

  const media = await createMediaRecord(supabase, {
    file_name: file.name,
    file_url: data.publicUrl,
    file_type: file.type,
    alt_text: options.altText || null,
    uploaded_by: profile.id,
    storage_path: storagePath,
    file_size: file.size,
    width: dimensions.width,
    height: dimensions.height,
    metadata: {
      bucket: SUPABASE_MEDIA_BUCKET,
      delivery: "public",
      future_video_ready: true,
      width: dimensions.width,
      height: dimensions.height,
      aspect_ratio:
        dimensions.width && dimensions.height
          ? dimensions.width / dimensions.height
          : null,
    },
  });

  if (options.replaceMediaId) {
    await deleteMediaRecord(supabase, options.replaceMediaId);
  }

  return media;
}
