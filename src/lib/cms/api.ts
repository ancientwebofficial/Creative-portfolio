import { ZodError } from "zod";
import { AuthRequiredError, ForbiddenError } from "@/lib/auth/guards";
import { UploadValidationError } from "./uploads";

type ErrorRecord = Record<string, unknown>;

export function jsonOk<T>(data: T, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", headers.get("Cache-Control") || "no-store");

  return Response.json({ data }, { ...init, headers });
}

export function jsonCreated<T>(data: T) {
  return jsonOk(data, { status: 201 });
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return Response.json(
    {
      error: {
        message,
        details,
      },
    },
    { status }
  );
}

function isRecord(error: unknown): error is ErrorRecord {
  return typeof error === "object" && error !== null;
}

function serializeError(error: unknown) {
  if (!isRecord(error)) {
    return {
      message: String(error),
      raw: error,
    };
  }

  return {
    name: typeof error.name === "string" ? error.name : undefined,
    code: typeof error.code === "string" ? error.code : undefined,
    message:
      typeof error.message === "string" ? error.message : "Unknown server error.",
    details: error.details,
    hint: error.hint,
    status: error.status,
    table: error.table,
    operation: error.operation,
    raw: error,
  };
}

function logRouteError(error: unknown) {
  const serialized = serializeError(error);

  console.error("CMS_ROUTE_ERROR", {
    code: serialized.code,
    message: serialized.message,
    details: serialized.details,
    hint: serialized.hint,
    status: serialized.status,
    table: serialized.table,
    operation: serialized.operation,
    raw: serialized.raw,
  });

  return serialized;
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function handleRouteError(error: unknown) {
  const serialized = logRouteError(error);

  if (error instanceof AuthRequiredError) {
    return jsonError(error.message, error.status, serialized);
  }

  if (error instanceof ForbiddenError) {
    return jsonError(error.message, error.status, serialized);
  }

  if (error instanceof ZodError) {
    return jsonError("Invalid request payload.", 422, error.flatten());
  }

  if (error instanceof UploadValidationError) {
    return jsonError(error.message, error.status, serialized);
  }

  return jsonError(serialized.message, Number(serialized.status) || 500, serialized);
}

export function publicCache(seconds = 60) {
  return {
    headers: {
      "Cache-Control": `public, s-maxage=${seconds}, stale-while-revalidate=${seconds * 5}`,
    },
  };
}
