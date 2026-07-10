import type { CollectionConfig } from "payload";
import { isAdmin } from "../lib/access.ts";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "role", "createdAt"],
  },
  auth: true,
  access: {
    admin: ({ req }) => isAdmin({ req } as Parameters<typeof isAdmin>[0]) as boolean,
    create: ({ req }) => {
      if (!req.user) {
        return true;
      }

      return Boolean((req.user as { role?: string }).role === "admin");
    },
    delete: isAdmin,
    read: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "admin",
      options: [
        { label: "Administrator", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        create: ({ req }) => Boolean((req.user as { role?: string } | null | undefined)?.role === "admin"),
        update: ({ req }) => Boolean((req.user as { role?: string } | null | undefined)?.role === "admin"),
      },
    },
  ],
};


