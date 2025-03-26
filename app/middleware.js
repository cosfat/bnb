import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Giriş yapmamış kullanıcılar sadece /login sayfasına erişebilir
    if (!req.nextauth.token && req.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Giriş yapmış kullanıcılar /login sayfasına erişemez
    if (req.nextauth.token && req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Middleware'in çalışacağı path'ler
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}; 