import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!token;
  const isLoginPage = pathname.startsWith("/login");

  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    let callbackUrl = pathname;
    if (req.nextUrl.search) callbackUrl += req.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
