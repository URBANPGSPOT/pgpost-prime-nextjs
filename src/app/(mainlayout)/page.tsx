import { getPageBySlug } from "@/lib/api";
import parse from "html-react-parser";
import fs from "fs";
import path from "path";

export default async function HomePage() {
  let content = "";

  // 1. Fetch live WordPress content first
  try {
    const page = await getPageBySlug("home");
    content = page?.content || "";
  } catch (e) {
    console.error("Error fetching homepage from WordPress:", e);
  }

  // 2. Fallback to local template only if WordPress content is not found
  if (!content) {
    try {
      const templatePath = path.join(process.cwd(), "src/templates/homepage.html");
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

    // 2. Hide "Can't Visit in Person?" section (Dubey Task 7)
    content = content.replace(/<section\b[^>]*>(?:(?!<\/section>)[\s\S])*?Visit in Person[\s\S]*?<\/section>/gi, "");

    // 3. Add (Boys) and (Girls) labels to Mansi and Thaltej (Dubey Task 6)
    content = content.replace(/PGSPOT Mansi(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Mansi (Boys)");
    content = content.replace(/Mansi Residency(?!\s*\((?:Boys|Girls)\))/g, "Mansi Residency (Boys)");
    content = content.replace(/PGSPOT Thaltej(?!\s*\((?:Boys|Girls)\))/g, "PGSPOT Thaltej (Girls)");
    content = content.replace(/Thaltej Smart Living(?!\s*\((?:Boys|Girls)\))/g, "Thaltej Smart Living (Girls)");

    // 4. Update Mansi (Boys) ₹11,000 & Thaltej (Girls) ₹9,000 with (Starting From) (Dubey Task 5)
    content = content.replace(
      /(?:₹|&#8377;|INR\s*)12,500(?:\s*<span[^>]*>\/(?:mo|month)<\/span>)?/g,
      '₹11,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );
    content = content.replace(
      /(?:₹|&#8377;|INR\s*)14,000(?:\s*<span[^>]*>\/(?:mo|month)<\/span>)?/g,
      '₹9,000<span class="text-xs font-semibold text-muted-foreground">/mo</span><span class="text-[11px] font-bold text-amber-600 block tracking-tight -mt-0.5">(Starting From)</span>'
    );

    // 5. Ensure Property Links point to canonical Next.js property routes
    content = content.replace(/href=["']\/mansi\/?["']/g, 'href="/properties/mansi-residency/"');
    content = content.replace(/href=["']\/thaltej\/?["']/g, 'href="/properties/thaltej-smart-living/"');

    // 6. Update Instagram handle and URLs (Dubey Task 8)
    content = content.replace(/@pgspot(?:\.in)?/g, "@pg.spot");
    content = content.replace(/href=["']https?:\/\/(?:www\.)?instagram\.com\/?["']/g, 'href="https://www.instagram.com/pg.spot"');
    content = content.replace(/https?:\/\/maps\.google\.com\/\?q=PGSPOT\+Ahmedabad/g, "https://g.page/r/CZznPYYSYB9oEBM/review");

    // 7. Remove aspect-[4/3] lg:aspect-[4/5] object-cover from banner images
    content = content.replace(/aspect-\[4\/3\]\s*lg:aspect-\[4\/5\]\s*object-cover/g, "h-auto rounded-3xl");
    content = content.replace(/aspect-\[4\/3\]\s*lg:aspect-\[4\/5\]/g, "h-auto");

    // 7. Replace broken/empty WordPress FAQ section with complete, interactive FAQ accordion (Dubey Task 1)
    try {
      const templatePath = path.join(process.cwd(), "src/templates/homepage.html");
      if (fs.existsSync(templatePath)) {
        const tpl = fs.readFileSync(templatePath, "utf-8");
        const faqIdx = tpl.indexOf("Common Questions");
        if (faqIdx !== -1) {
          const faqStart = tpl.lastIndexOf("<section", faqIdx);
          const faqEnd = tpl.indexOf("</section>", faqIdx) + 10;
          const fullFaqHtml = tpl.substring(faqStart, faqEnd);
          content = content.replace(
            /<section\b[^>]*>(?:(?!<\/section>)[\s\S])*?Common Questions[\s\S]*?<\/section>/gi,
            fullFaqHtml
          );
        }

        // 8. Replace old dummy WordPress reviews section with official Google Verified Reviews (GMB) section (Dubey Task 3)
        const revStart = tpl.indexOf("<!-- Google Reviews Section -->");
        const revEnd = tpl.indexOf("<!-- Instagram Feed Section -->");
        if (revStart !== -1 && revEnd !== -1) {
          const revHtml = tpl.substring(revStart, revEnd);
          if (content.includes("Loved by 500+ Residents")) {
            content = content.replace(
              /<section\b[^>]*>(?:(?!<\/section>)[\s\S])*?Loved by 500\+ Residents[\s\S]*?<\/section>/gi,
              revHtml
            );
          } else if (content.includes("Follow Our Community")) {
            const instaSectionStart = content.lastIndexOf("<section", content.indexOf("Follow Our Community"));
            content = content.substring(0, instaSectionStart) + revHtml + content.substring(instaSectionStart);
          } else if (content.includes("Common Questions")) {
            const faqSectionStart = content.lastIndexOf("<section", content.indexOf("Common Questions"));
            content = content.substring(0, faqSectionStart) + revHtml + content.substring(faqSectionStart);
          }
        }

        // 9. Replace old Instagram section with complete 6-card @pg.spot Instagram Feed (Dubey Task 8)
        const instaStart = tpl.indexOf("<!-- Instagram Feed Section -->");
        const instaEnd = tpl.indexOf("<!-- FAQ Section");
        if (instaStart !== -1 && instaEnd !== -1) {
          const instaHtml = tpl.substring(instaStart, instaEnd);
          if (content.includes("Follow Our Community") || content.includes("@pg.spot")) {
            content = content.replace(
              /<section\b[^>]*>(?:(?!<\/section>)[\s\S])*?(?:Follow Our Community|@pg\.spot)[\s\S]*?<\/section>/gi,
              instaHtml
            );
          } else if (content.includes("Common Questions")) {
            const faqSectionStart = content.lastIndexOf("<section", content.indexOf("Common Questions"));
            content = content.substring(0, faqSectionStart) + instaHtml + content.substring(faqSectionStart);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 font-heading">
          Welcome to <span className="gradient-text">PGSPOT Headless CMS</span>
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your headless Next.js frontend is connected to WordPress, but we couldn't find a page with the slug{" "}
          <code className="px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 font-mono text-sm">home</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {parse(content)}
    </div>
  );
}
