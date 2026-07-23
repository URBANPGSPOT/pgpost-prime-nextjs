import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SKIP_PATHS = ["/api", "/_next/static", "/_next/image", "/favicon.ico"];
const STATIC_FILE_REGEX = /\.(png|jpg|jpeg|gif|svg|ico|webp|css|js|woff|woff2|ttf|json|txt|xml)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware logic for API routes, Next.js assets, and static files
  if (
    SKIP_PATHS.some((path) => pathname.startsWith(path)) ||
    STATIC_FILE_REGEX.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Pass through (to be expanded with WP-fetched redirections in the future)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
