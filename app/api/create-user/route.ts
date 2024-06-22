import { CREATE_USER_ERRORS } from "@/constants/error-mapping";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { first_name, email, password } = body;

  if (!first_name || !email || !password) {
    return NextResponse.json(
      { error: CREATE_USER_ERRORS.MISSING_FIELDS },
      { status: 400 }
    );
  }

  try {
    const existingUserResult = await sql`
      SELECT * FROM Users WHERE email = ${email}
    `;

    if (existingUserResult.rows.length > 0) {
      return NextResponse.json(
        { error: CREATE_USER_ERRORS.USER_EXISTS },
        { status: 409 }
      );
    }

    await sql`
      INSERT INTO Users (first_name, email, password)
      VALUES (${first_name}, ${email}, ${password})
    `;

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: CREATE_USER_ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
