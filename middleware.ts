import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export function middleware(request: NextRequest) {
  if (request.cookies.get("id")) {
    return NextResponse.next();
  }
  const response = NextResponse.next();
  response.cookies.set("id", uuidv4());
  return response;
}

export const config = {
    matcher: '/',
}
