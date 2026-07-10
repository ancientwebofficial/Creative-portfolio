import "@payloadcms/next/css";
import configPromise from "@payload-config";
import {
  handleServerFunctions,
  RootLayout,
} from "@payloadcms/next/layouts";
import type { ServerFunctionClientArgs } from "payload";
import React from "react";
import { importMap } from "./cms/importMap";

export const metadata = {
  title: "Cosmic Flare CMS",
};

export default function PayloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function serverFunction(args: ServerFunctionClientArgs) {
    "use server";

    return handleServerFunctions({
      ...args,
      config: configPromise,
      importMap,
    });
  }

  return (
    <RootLayout
      config={configPromise}
      importMap={importMap}
      serverFunction={serverFunction}
    >
      {children}
    </RootLayout>
  );
}
