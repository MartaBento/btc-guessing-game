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

type LoadingOverlayProps = {
  timerSeconds: number;
  initialUSDPrice: number;
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
    <div className="flex flex-col text-center text-white border-dashed border-gray-400 border p-4 xl:p-12 m-4 xl:m-0 rounded-lg">
      <p className="text-base">Your current score is: {userScore}</p>
      <p>Current BTC price (USD): ${initialUSDPrice}</p>
      <p>Last updated: {formattedLastUpdated}</p>
    </div>
  );
}

function LoadingOverlay({
  timerSeconds,
  initialUSDPrice,
}: LoadingOverlayProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-90 z-50">
      <div className="bg-white rounded-lg shadow-lg text-center p-8">
        <p className="text-lg font-semibold">
          We are evaluating your bet - please wait. The current value is $
          {initialUSDPrice}.
        </p>
        <span className="text-sm">
          Remaining time for the next update: {timerSeconds} seconds
        </span>
      </div>
    </div>
  );
}

function GuessingGame({
  initialUSDPrice,
  lastUpdated,
  userScore,
}: GuessingGameProps) {
  const [isLoading, setLoading] = useState(false);
  const [isPlacingBet, startPlacingBet] = useTransition();
  const [hasCurrentBet, setHasCurrentBet] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const router = useRouter();

  useEffect(() => {
    const betType = localStorage.getItem("betType");
    setHasCurrentBet(betType !== null);

    if (betType) {
      startPolling(Cookies.get("userId") || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let timer = null;

    if (isLoading) {
      timer = setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else {
      setTimerSeconds(60);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

  const handleLogout = () => {
    Cookies.remove("userEmail");
    Cookies.remove("userId");
    router.push(PAGES.LOGIN);
  };

  const startPolling = (userId: string) => {
    let interval: number | null = null;
    setLoading(true);

    const pollBetResolution = async () => {
      try {
        const response = await checkBetResolution(userId);

        if (response.resolved) {
          if (interval !== null) {
            clearInterval(interval);
          }
          localStorage.removeItem("betType");
          setHasCurrentBet(false);
          toast.success(response.message);
          router.refresh();
        } else {
          toast(response.message);
        }
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    interval = window.setInterval(pollBetResolution, 60000);
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
          "Your bet has been placed! The market will update soon. Your bet will be resolved when the price is updated. Please wait on this page."
        );
        startPolling(userId);
      } catch (error) {
        const errorMessage = (error as Error).message;
        toast.error(errorMessage);
      }
    });
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Header
        userScore={userScore}
        initialUSDPrice={initialUSDPrice}
        lastUpdated={lastUpdated}
      />
      <div className="flex flex-col bg-white shadow-2xl rounded-lg m-8 p-8 xl:p-12 text-center">
        <div className="mt-4 space-y-4">
          <h1 className="text-2xl xl:text-3xl tracking-tighter font-black">
            BTC guessing game
          </h1>
          <h2 className="text-base xl:text-xl">
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
        <div className="mt-8 flex flex-col">
          <span className="text-lg xl:text-lg font-bold">
            Ready to play? Choose one option:
          </span>
          <span className="text-xs font-light">
            (If the buttons are disabled, it may be because you have already
            placed a bet.)
          </span>
        </div>
        <div className="flex flex-col xl:flex-row justify-between space-y-4 xl:space-y-0 xl:space-x-4 mt-8">
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
      <div className="mb-8 xl:mb-0">
        <Button label="Logout" onClick={handleLogout} />
      </div>
      {isLoading && (
        <LoadingOverlay
          timerSeconds={timerSeconds}
          initialUSDPrice={initialUSDPrice}
        />
      )}
    </main>
  );
}

export default GuessingGame;
