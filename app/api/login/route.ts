import { LOGIN_ERRORS } from "@/constants/error-mapping";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: LOGIN_ERRORS.MISSING_EMAIL_PWD },
      { status: 400 }
    );
  }

  try {
    const result = await sql`
      SELECT * FROM Users WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: LOGIN_ERRORS.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return NextResponse.json(
        { error: LOGIN_ERRORS.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Login successful", userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: LOGIN_ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
