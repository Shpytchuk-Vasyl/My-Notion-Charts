import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { locale } = request.nextUrl;

  const pathnameIsMissingLocale = !routing.locales.includes(locale as any);
  if (pathnameIsMissingLocale) {
    return intlMiddleware(request);
  }

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|icon.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
  ],
};
