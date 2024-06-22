"use client";

import { format, parseISO } from "date-fns";
import Button from "@/components/common/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { PAGES } from "@/constants/pages-apis-mapping";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { checkBetResolution, placeBet } from "@/actions/server-actions";

type GuessingGameProps = {
  initialUSDPrice: number;
  lastUpdated: string;
  userScore: number;
};

function Header({
  userScore,
  initialUSDPrice,
  lastUpdated,
}: GuessingGameProps) {
  const formattedLastUpdated = format(
    parseISO(lastUpdated),
    "MMMM dd, yyyy HH:mm"
  );
  return (
    <div className="flex flex-col text-center text-white border-dashed border-gray-400 border p-12 rounded-lg">
      <p className="text-base">
        Your current score is: <strong>{userScore}</strong>
      </p>
      <p>Current BTC price (USD): ${initialUSDPrice}</p>
      <p>Last updated: {formattedLastUpdated}</p>
    </div>
  );
}

function GuessingGame({
  initialUSDPrice,
  lastUpdated,
  userScore,
}: GuessingGameProps) {
  const [isPlacingBet, startPlacingBet] = useTransition();
  const [hasCurrentBet, setHasCurrentBet] = useState(false);
  const [initialCurrencyRatio, setInitialCurrencyRatio] =
    useState(initialUSDPrice);
  const router = useRouter();

  useEffect(() => {
    const betType = localStorage.getItem("betType");
    setHasCurrentBet(betType !== null);

    localStorage.setItem("initialUSDPrice", initialUSDPrice.toString());
    setInitialCurrencyRatio(initialUSDPrice);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    Cookies.remove("userEmail");
    Cookies.remove("userId");
    router.push(PAGES.LOGIN);
  };

  const startPolling = (userId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await checkBetResolution(userId);

        if (response.resolved) {
          clearInterval(interval);
          localStorage.removeItem("betType");
          setHasCurrentBet(false);
          toast.success(response.message);
        } else {
          toast(response.message);
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast.error(errorMessage);
      }
    }, 10000);
  };

  const handleNewBet = async (betType: "up" | "down") => {
    localStorage.setItem("betType", betType);
    setHasCurrentBet(true);

    startPlacingBet(async () => {
      try {
        const userId = Cookies.get("userId");

        if (!userId) {
          toast.error("Please login to place a bet");
          return;
        }

        await placeBet(userId, betType, initialUSDPrice);
        toast.success(
          "Your bet has been placed! The market will update soon. Your bet will be resolved when the price is updated. Please wait in this page."
        );
        startPolling(userId);
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast.error(errorMessage);
      }
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen font-mono">
      <Header
        userScore={userScore}
        initialUSDPrice={initialCurrencyRatio}
        lastUpdated={lastUpdated}
      />
      <div className="flex flex-col bg-white shadow-2xl rounded-lg m-8 p-12 text-center">
        <div className="mt-4 space-y-4">
          <h1 className="font-inter text-3xl tracking-tighter font-black">
            BTC guessing game
          </h1>
          <h2 className="text-gl">
            The goal of this game is to guess whether the market price of
            Bitcoin (BTC/USD) will be higher or lower after one minute. The
            rules are simple: In order to play, you have to guess. Press either
            “up” (☝🏻) or “down“ (👇🏻) to make your guess.
          </h2>
          <h4 className="text-base">
            After that, the market price of BTC/USD will be updated in real
            time.
          </h4>
        </div>
        <span className="text-xl font-bold mt-8">
          Ready to play? Choose one option:
        </span>
        <span className="text-xs font-light">
          (If the buttons are disabled, it may be because you have already
          placed a bet.)
        </span>
        <div className="flex justify-between space-x-4 mt-8">
          <Button
            icon="☝🏻"
            label={isPlacingBet ? "Placing bet..." : "Higher"}
            iconPosition="right"
            onClick={() => handleNewBet("up")}
            isDisabled={hasCurrentBet}
          />
          <Button
            icon="👇🏻"
            label={isPlacingBet ? "Placing bet..." : "Lower"}
            iconPosition="right"
            onClick={() => handleNewBet("down")}
            isDisabled={hasCurrentBet}
          />
        </div>
      </div>
      <div>
        <Button label="Logout" onClick={handleLogout} />
      </div>
    </main>
  );
}

export default GuessingGame;
