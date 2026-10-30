import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/data/projects";

const slugs = new Set(projects.map((p) => p.slug));

/**
 * Project pages are partially prerendered, so a notFound() thrown while
 * rendering can only stream the 404 UI with a 200 status. Rejecting unknown
 * slugs here, before rendering starts, returns a real 404 status code.
 */
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/")[2];
  if (slug && !slugs.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/__not-found", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/projects/:slug",
};
