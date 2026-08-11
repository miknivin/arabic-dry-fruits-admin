import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function handleLogout() {
  const response = NextResponse.json(
    { message: "Logged Out" },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );

  const isProd = process.env.NODE_ENV === "production";

  // Delete cookie matching exact path, secure, and sameSite attributes used when set
  response.cookies.set("adminToken", "", {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
  });

  try {
    response.cookies.delete("adminToken");
  } catch (e) {
    // Ignore error fallback
  }

  return response;
}

export async function GET(req) {
  return handleLogout();
}

export async function POST(req) {
  return handleLogout();
}
