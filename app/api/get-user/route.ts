import { GET_USER_ERRORS } from "@/constants/error-mapping";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  if (!userId && !email) {
    return NextResponse.json(
      { error: GET_USER_ERRORS.MISSING_PARAMS },
      { status: 400 }
    );
  }

  try {
    if (userId) {
      const result = await sql`SELECT * FROM Users WHERE id = ${userId}`;

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: GET_USER_ERRORS.USER_NOT_FOUND },
          { status: 404 }
        );
      }

      const user = result.rows[0];
      return NextResponse.json({ user }, { status: 200 });
    } else if (email) {
      const result = await sql`SELECT * FROM Users WHERE email = ${email}`;

      if (result.rows.length === 0) {
        return NextResponse.json(
          { error: GET_USER_ERRORS.USER_NOT_FOUND },
          { status: 404 }
        );
      }

      const user = result.rows[0];
      return NextResponse.json({ user }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: GET_USER_ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
