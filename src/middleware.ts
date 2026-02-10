import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Sync connectedProjectPath from header to cookie for API routes
  const projectPath = request.headers.get('x-project-path');
  if (projectPath) {
    response.cookies.set('connectedProjectPath', projectPath, {
      httpOnly: false,
      sameSite: 'strict',
    });
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
