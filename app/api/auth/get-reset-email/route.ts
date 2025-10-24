import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get("signup_email")?.value;

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "No email found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, email });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
