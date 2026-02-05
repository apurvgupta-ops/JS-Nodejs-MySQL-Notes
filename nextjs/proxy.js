import { NextResponse } from "next/server";

export const proxy = (request) => {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("authToken")?.value;
  const authjsToken = request.cookies.get("authjs.session-token")?.value;
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (!token && !authjsToken && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if ((token || authjsToken) && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

// export const config = {
//   matcher: ["/", "/login", "/about", "/todos"],
// };
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
