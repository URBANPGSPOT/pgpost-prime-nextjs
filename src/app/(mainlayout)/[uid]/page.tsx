import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getPageBySlug, getPropertyBySlug, getPAGESEO, getAllPages } from "@/lib/api";
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
  let content = "";

  // 1. Fetch live WordPress page first
  try {
    const page = await getPageBySlug(uid);
    if (page?.content) {
      content = page.content;
    }
  } catch (e) {
    console.error(`Error fetching page ${uid} from WordPress:`, e);
  }

  // 2. If not found as a page, check if it's a property (e.g. mansi -> mansi-residency, thaltej -> thaltej-smart-living)
  if (!content) {
    try {
      const propertySlug = uid === "mansi" ? "mansi-residency" : (uid === "thaltej" ? "thaltej-smart-living" : uid);
      const property = await getPropertyBySlug(propertySlug);
      if (property?.content) {
        content = property.content;
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Fallback to local template only if WordPress has no content
  if (!content) {
    try {
      const fs = require("fs");
      const path = require("path");
      const templatePath = path.join(process.cwd(), `src/templates/${uid}.html`);
      if (fs.existsSync(templatePath)) {
        content = fs.readFileSync(templatePath, "utf-8");
      }
    } catch (e) {
      // ignore
    }
  }

  if (content) {
    // 1. Strip Gutenberg block comments
    content = content.replace(/<!--\s*\/?wp:[^>]*-->/g, "").trim();

    // 2. Hide "Can't Visit in Person?" section
    content = content.replace(/<section\b[^>]*>(?:(?!<\/section>)[\s\S])*?Visit in Person[\s\S]*?<\/section>/gi, "");

    // 3. Add (Boys) and (Girls) suffix
    content = content.replace(/PGSPOT Mansi(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Mansi (Boys)");
    content = content.replace(/Mansi Residency(?!\s*\((?:Boys|Girls)\))/g, "Mansi Residency (Boys)");
    content = content.replace(/PGSPOT Thaltej(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Thaltej (Girls)");
    content = content.replace(/Thaltej Smart Living(?!\s*\((?:Boys|Girls)\))/g, "Thaltej Smart Living (Girls)");

    // 4. Update pricing with (Starting From)
    content = content.replace(
      /₹12,500(?:\s*<span[^>]*>\/mo<\/span>)?/g,
      '₹11,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );
    content = content.replace(
      /₹14,000(?:\s*<span[^>]*>\/mo<\/span>)?/g,
      '₹9,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );
  } else {
    notFound();
  }

  return (
    <div className="w-full">
      {content ? (
        parse(content)
      ) : (
        <p className="text-slate-500 italic text-center py-20">No content published yet.</p>
      )}
    </div>
  );
}
