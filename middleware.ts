import { NextRequest, NextResponse } from "next/server";
import { PAGES } from "./constants/pages-apis-mapping";

// The middleware will only run in these routes.
export const config = {
  matcher: ["/", "/login", "/create-user"],
};

export default function middleware(request: NextRequest) {
  const { cookies } = request;
  const pathname = request.nextUrl.pathname;

  const userEmailCookie = cookies.get("userEmail");
  const isUserLoggedIn = !!userEmailCookie;

  // Redirect to login page if not logged in.
  if (!isUserLoggedIn && pathname === PAGES.HOME) {
    const redirectionUrl = new URL(PAGES.LOGIN, request.nextUrl.origin);

    return NextResponse.redirect(redirectionUrl);
  }

  return NextResponse.next();
}
