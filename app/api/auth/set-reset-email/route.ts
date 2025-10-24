import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, error: "Email required" },
        { status: 400 }
      );
    }

    // Create a response and attach the cookie
    const response = NextResponse.json({ ok: true });

    response.cookies.set("signup_email", email, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 10 * 60, // 10 minutes
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
