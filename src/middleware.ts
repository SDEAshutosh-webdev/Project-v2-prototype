import { NextResponse, type NextRequest } from 'next/server';

const MODULE_ROUTE_MAP: Record<string, string> = {
  '/property-tax': 'PTIS',
  '/water-bill': 'WTIS',
  '/assets': 'ASSETS',
  '/grievance': 'GRIEVANCE',
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const matchedRoute = Object.keys(MODULE_ROUTE_MAP).find((prefix) => pathname.startsWith(prefix));

  if (matchedRoute) {
    const requiredModule = MODULE_ROUTE_MAP[matchedRoute];
    const enabledModules = request.cookies.get('enabled_modules')?.value?.split(',') || [
      'PTIS',
      'WTIS',
      'ASSETS',
      'GRIEVANCE',
    ];

    if (!enabledModules.includes(requiredModule)) {
      return new NextResponse('Module Disabled for this Tenant License', { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
