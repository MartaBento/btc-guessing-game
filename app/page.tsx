import { fetchCoinMarketCap, fetchUserScore } from "@/actions/server-actions";
import GuessingGame from "@/components/pages/guessing-game";
import { cookies } from "next/headers";

export default async function Home() {
  const currentData = await fetchCoinMarketCap();
  const userId = cookies().get("userId")?.value;
  let userScore;

  if (userId) {
    userScore = await fetchUserScore(userId);
  }

  const currentUserScore =
    userScore && userScore.score !== "-1" ? Number(userScore.score) : 0;

  const currentUSDPrice = currentData.data.BTC.quote.USD.price;
  const lastUpdated = currentData.data.BTC.quote.USD.last_updated;

  return (
    <GuessingGame
      currentUSDPrice={currentUSDPrice}
      lastUpdated={lastUpdated}
      userScore={currentUserScore}
    />
  );
}
