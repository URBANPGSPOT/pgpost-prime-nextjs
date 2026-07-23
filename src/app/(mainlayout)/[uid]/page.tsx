import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getPageBySlug, getPAGESEO, getAllPages } from "@/lib/api";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ uid: string }> | { uid: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { uid } = await params;
  const seo = await getPAGESEO(uid);
  if (!seo) {
    return {
      title: `${uid.charAt(0).toUpperCase() + uid.slice(1)} - PGSPOT`,
    };
  }
  return {
    title: seo.title,
    description: seo.metaDesc,
    alternates: {
      canonical: seo.canonical,
    },
    openGraph: {
      title: seo.opengraphTitle || seo.title,
      description: seo.opengraphDescription || seo.metaDesc,
      images: seo.opengraphImage?.sourceUrl ? [{ url: seo.opengraphImage.sourceUrl }] : [],
    },
  };
}

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages
    .filter((page: any) => page.slug && page.slug !== "home")
    .map((page: any) => ({
      uid: page.slug,
    }));
}

export default async function DynamicPage({ params }: PageProps) {
  const { uid } = await params;
  const page = await getPageBySlug(uid);

  if (!page) {
    notFound();
  }

  return (
    <div className="w-full">
      {page.content ? (
        parse(page.content)
      ) : (
        <p className="text-slate-500 italic text-center py-20">No content published yet.</p>
      )}
    </div>
  );

}
