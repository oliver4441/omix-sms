import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/login", "/register"]);
const PUBLIC_PREFIXES = ["/api/auth", "/_next", "/favicon", "/manifest", "/icon", "/apple-touch", "/service-worker", "/sw"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") || "";

  // Allow static assets
  if (PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) return;
  if (pathname.match(/\.(png|jpe?g|gif|svg|webp|ico|json|webmanifest|css|js)$/)) return;

  // Allow public pages
  if (PUBLIC_PATHS.has(pathname)) return;

  // Check session cookie (lightweight - no DB call)
  const sessionToken = req.cookies.get("authjs.session-token")?.value;
  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Extract subdomain for multi-tenancy
  const parts = host.split(".");
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const isVercel = host.includes(".vercel.app");

  let subdomain: string | null = null;
  if (!isLocalhost && !isVercel && parts.length >= 3) {
    const reserved = ["www", "admin", "api", "staging", "dev", "test"];
    if (!reserved.includes(parts[0])) subdomain = parts[0];
  }

  const response = NextResponse.next();
  if (subdomain) {
    response.cookies.set("x-school-slug", subdomain, { path: "/", maxAge: 86400, sameSite: "lax" });
  }

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest|icon|apple-touch-icon|favicon|service-worker|sw|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|json|webmanifest)).*)"],
};
