import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("session")?.value;
    if (currentUser) {
        // do nothing
        return;
    } 
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set("redirect", request.url);
    return NextResponse.redirect(redirectUrl);
}

export const config = {
    matcher: ['/((?!auth|api|_next/static|_next/image|.*\\.png$).*)']
}