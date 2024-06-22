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
