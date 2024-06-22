import { CoinMarketCapResponse } from "@/types/global-types";

type GuessingGameProps = {
  currentData: CoinMarketCapResponse;
  userScore: number;
};

function GuessingGame({ currentData, userScore }: GuessingGameProps) {
  return <main>Guessing Game</main>;
}

export default GuessingGame;
