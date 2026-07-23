import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_name, post_type, post_status } = body;

    if (!post_name) {
      return NextResponse.json({ message: "Missing post_name parameter" }, { status: 400 });
    }

    // Always revalidate sitemaps
    revalidatePath("/sitemap*");

    const slug = post_name === "home" ? "" : post_name;

    // Always purge the GraphQL fetch cache tag when content updates
    revalidateTag("wpchange");

    if (post_type === "page" && post_status === "publish") {
      revalidatePath(`/${slug}/`);
      revalidatePath("/");
    } else if (post_type === "post" && post_status === "publish") {
      revalidatePath(`/blog/${slug}/`);
      revalidatePath("/blog/");
      revalidatePath("/category/*");
      revalidatePath("/author/*");
    }

    return NextResponse.json({ revalidated: true, now: Date.now(), body });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
