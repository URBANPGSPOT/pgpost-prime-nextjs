import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_name, post_type, post_status } = body;

    // Always purge the GraphQL fetch cache tag when content updates
    revalidateTag("wpchange", "max");
    revalidatePath("/sitemap*");

    const slug = post_name === "home" ? "" : post_name;

    if (post_type === "page" && post_status === "publish") {
      if (slug) {
        revalidatePath(`/${slug}`);
        revalidatePath(`/${slug}/`);
      }
      revalidatePath("/");
    } else if (post_type === "post" && post_status === "publish") {
      if (slug) {
        revalidatePath(`/blog/${slug}`);
        revalidatePath(`/blog/${slug}/`);
      }
      revalidatePath("/blogs");
      revalidatePath("/blogs/");
      revalidatePath("/blog");
      revalidatePath("/blog/");
      revalidatePath("/category/*");
      revalidatePath("/author/*");
    } else if (post_type === "property" && post_status === "publish") {
      if (slug) {
        revalidatePath(`/properties/${slug}`);
        revalidatePath(`/properties/${slug}/`);
      }
      revalidatePath("/properties");
      revalidatePath("/properties/");
      revalidatePath("/");
    } else if (post_type === "attachment") {
      // Revalidate all main static pages when media/image is updated
      revalidatePath("/");
      revalidatePath("/blogs");
      revalidatePath("/blogs/");
      revalidatePath("/about-us/");
      revalidatePath("/contact-us/");
      revalidatePath("/properties/[slug]", "page");
      revalidatePath("/[uid]", "page");
    } else {
      // Catch-all revalidation
      revalidatePath("/");
    }

    return NextResponse.json({ revalidated: true, now: Date.now(), body });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
