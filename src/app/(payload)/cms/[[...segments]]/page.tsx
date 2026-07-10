import configPromise from "@payload-config";
import { generatePageMetadata, RootPage } from "@payloadcms/next/views";
import { importMap } from "../importMap";

type PageProps = {
  params: Promise<{
    segments: string[];
  }>;
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
};

export default function PayloadAdminPage({ params, searchParams }: PageProps) {
  return RootPage({
    config: configPromise,
    importMap,
    params,
    searchParams,
  });
}

export const generateMetadata = ({ params, searchParams }: PageProps) =>
  generatePageMetadata({ config: configPromise, params, searchParams });
