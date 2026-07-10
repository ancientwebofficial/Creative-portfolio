import type { Field } from "payload";

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

export const validateHexColor = (value: unknown) => {
  if (typeof value !== "string" || HEX_COLOR_PATTERN.test(value)) {
    return true;
  }

  return "Use a safe hex color such as #8b5cf6.";
};

export const linkFields: Field[] = [
  {
    name: "label",
    type: "text",
    required: true,
    maxLength: 80,
  },
  {
    name: "href",
    type: "text",
    required: true,
    maxLength: 500,
  },
  {
    name: "newTab",
    type: "checkbox",
    defaultValue: false,
  },
];

export const seoFields: Field[] = [
  {
    name: "title",
    type: "text",
    maxLength: 240,
  },
  {
    name: "description",
    type: "textarea",
    maxLength: 500,
  },
  {
    name: "openGraphTitle",
    type: "text",
    maxLength: 240,
  },
  {
    name: "openGraphDescription",
    type: "textarea",
    maxLength: 500,
  },
  {
    name: "openGraphImage",
    type: "upload",
    relationTo: "media",
  },
];

export const publishedStatusField: Field = {
  name: "status",
  type: "select",
  required: true,
  defaultValue: "published",
  options: [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Private", value: "private" },
  ],
};

export const displayOrderField: Field = {
  name: "displayOrder",
  type: "number",
  required: true,
  defaultValue: 0,
  min: 0,
};

export const ctaGroup = (name = "cta", label = "CTA"): Field => ({
  name,
  label,
  type: "group",
  fields: linkFields,
});

export const colorField = (name: string, label: string, defaultValue: string): Field => ({
  name,
  label,
  type: "text",
  required: true,
  defaultValue,
  validate: validateHexColor,
  admin: {
    description: "Safe hex colors only. Arbitrary CSS is not accepted.",
  },
});


