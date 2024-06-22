import { fetchCoinMarketCap, fetchUserScore } from "@/actions/server-actions";
import GuessingGame from "@/components/pages/guessing-game";
import { cookies } from "next/headers";

export default async function Home() {
  const currentData = await fetchCoinMarketCap();

  const userId = cookies().get("userId")!.value;
  const userScore = await fetchUserScore(userId);
  const currentUserScore =
    userScore.score === "-1" ? 0 : Number(userScore.score);

  return (
    <GuessingGame currentData={currentData} userScore={currentUserScore} />
  );
}
