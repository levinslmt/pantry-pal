import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = new URL(request.url);

  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/api/auth",
    "/_next",
    "/favicon.ico",
  ];

  const isPublic = publicPaths.some((p) => {
    if (p === "/") return pathname === "/";
    return pathname.startsWith(p);
  });
  if (isPublic) return;

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
