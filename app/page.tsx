import { fetchCoinMarketCap } from "@/actions/server-actions";
import GuessingGame from "@/components/pages/guessing-game";
import { GET_USER_SCORE } from "@/constants/error-mapping";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";

// this cannot use a route handler - next.js in server side doesn't handle route handlers like "api/user-score". The recommendation is to query directly the db.
async function retrieveUserScore(userId: string) {
  const result = await sql`
      SELECT score
      FROM Users
      WHERE Users.id = ${userId}
    `;

  if (result.rows.length === 0) {
    throw new Error(GET_USER_SCORE.USER_NOT_FOUND);
  }

  const user = result.rows[0];
  const { score } = user;
  return score;
}

export default async function Home() {
  const currentData = await fetchCoinMarketCap();
  const userId = cookies().get("userId")?.value;
  let userScore;

  if (userId) {
    userScore = await retrieveUserScore(userId);
  }

  // for the sake of simplicity, I'll assume that the user score can be negative also.
  const currentUserScore =
    userScore && typeof userScore === "number" ? userScore : 0;

  // for the sake of simplicity, I'm also keeping the price as is (with multiple decimals).
  const currentUSDPrice = currentData.data.BTC.quote.USD.price;
  const lastUpdated = currentData.data.BTC.quote.USD.last_updated;

  return (
    <GuessingGame
      initialUSDPrice={currentUSDPrice}
      lastUpdated={lastUpdated}
      userScore={currentUserScore}
    />
  );
}
