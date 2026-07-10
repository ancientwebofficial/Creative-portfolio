import type { Access } from "payload";

type UserWithRole = {
  role?: string | null;
};

export const isAdmin: Access = ({ req }) => {
  return Boolean((req.user as UserWithRole | null | undefined)?.role === "admin");
};

export const anyone: Access = () => true;

export const adminsOnly = {
  create: isAdmin,
  delete: isAdmin,
  read: isAdmin,
  update: isAdmin,
};


