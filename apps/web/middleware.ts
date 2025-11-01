import { auth } from "./lib/auth";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/scheduled"];

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  if (protectedRoutes.includes(pathname) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
