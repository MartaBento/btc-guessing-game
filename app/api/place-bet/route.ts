import { PLACE_BET_ERRORS } from "@/constants/error-mapping";
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, betType } = body;

  if (!userId || !betType) {
    return NextResponse.json(
      { error: PLACE_BET_ERRORS.MISSING_PARAMS },
      { status: 400 }
    );
  }

  try {
    const userQuery = await sql`SELECT id FROM Users WHERE id = ${userId};`;

    if (userQuery.rows.length === 0) {
      return NextResponse.json(
        { error: PLACE_BET_ERRORS.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    const insertResult = await sql`
      INSERT INTO Bets (user_id, bet_type, created_at, resolved)
      VALUES (${userId}, ${betType}, NOW(), FALSE)
      RETURNING id, user_id, bet_type, created_at, resolved, result;
    `;

    const newBet = insertResult.rows[0];

    return NextResponse.json(
      { message: "Bet placed successfully.", bet: newBet },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: PLACE_BET_ERRORS.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
