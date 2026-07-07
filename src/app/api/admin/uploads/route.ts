import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonCreated, jsonError } from "@/lib/cms/api";
import { uploadImage } from "@/lib/cms/uploads";

export async function POST(request: Request) {
  try {
    const { supabase, profile } = await getCmsAdminContext();
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((value): value is File => value instanceof File);
    const singleFile = formData.get("file");

    if (singleFile instanceof File) {
      files.push(singleFile);
    }

    if (files.length === 0) {
      return jsonError("Attach at least one file using the file or files field.", 400);
    }

    const altText = formData.get("alt_text");
    const folder = formData.get("folder");
    const replaceMediaId = formData.get("replace_media_id");

    if (replaceMediaId && files.length > 1) {
      return jsonError("Only one file can be used when replacing media.", 400);
    }

    const uploads = await Promise.all(
      files.map((file) =>
        uploadImage(supabase, file, profile, {
          altText: typeof altText === "string" ? altText : null,
          folder: typeof folder === "string" && folder ? folder : undefined,
          replaceMediaId:
            typeof replaceMediaId === "string" && replaceMediaId
              ? replaceMediaId
              : null,
        })
      )
    );

    return jsonCreated({
      items: uploads,
      count: uploads.length,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
