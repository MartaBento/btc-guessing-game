import "@testing-library/jest-dom";
import GuessingGame from "@/components/pages/guessing-game";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { checkBetResolution, placeBet } from "@/actions/server-actions";
import { PAGES } from "@/constants/pages-apis-mapping";

jest.useFakeTimers();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("@/actions/server-actions", () => ({
  checkBetResolution: jest.fn(),
  placeBet: jest.fn(),
}));

jest.mock("date-fns", () => ({
  ...jest.requireActual("date-fns"),
  format: jest.fn(() => {
    return "June 24, 2024 20:02";
  }),
}));

describe("GuessingGame Component", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });

    mockPush.mockClear();
    mockRefresh.mockClear();
    (Cookies.get as jest.Mock).mockClear();
    (Cookies.set as jest.Mock).mockClear();
    (Cookies.remove as jest.Mock).mockClear();
    (toast.success as jest.Mock).mockClear();
    (toast.error as jest.Mock).mockClear();
    (checkBetResolution as jest.Mock).mockClear();
    (placeBet as jest.Mock).mockClear();
  });

  test("Renders the GuessingGame component correctly", () => {
    const initialUSDPrice = 50000;
    const userScore = 10;

    render(
      <GuessingGame
        initialUSDPrice={initialUSDPrice}
        lastUpdated="2024-06-24T20:02:00Z"
        userScore={userScore}
      />
    );

    expect(
      screen.getByText(`Your current score is: ${userScore}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Current BTC price (USD): $${initialUSDPrice}`)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Last updated: June 24, 2024 20:02")
    ).toBeInTheDocument();
    expect(screen.getByText("BTC guessing game")).toBeInTheDocument();
    expect(
      screen.getByText(
        "The goal of this game is to guess whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute. The rules are simple: In order to play, you have to guess. Press either “up” (☝🏻) or “down“ (👇🏻) to make your guess."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ready to play? Choose one option:")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Higher/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Lower/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logout/ })).toBeInTheDocument();
  });

  test("Allows user to place a new bet", async () => {
    const localStorageSpy = jest.spyOn(
      window.localStorage.__proto__,
      "setItem"
    );

    (Cookies.get as jest.Mock).mockReturnValue("123");

    render(
      <GuessingGame
        initialUSDPrice={10000}
        lastUpdated="2024-06-23T12:00:00Z"
        userScore={100}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Higher/ }));

    await waitFor(() => {
      expect(localStorageSpy).toHaveBeenCalledWith("betType", "up");
      expect(placeBet).toHaveBeenCalledWith("123", "up", 10000);
      expect(toast.success).toHaveBeenCalledWith(
        "Your bet has been placed! The market will update soon. Your bet will be resolved when the price is updated. Please wait on this page."
      );
    });

    localStorageSpy.mockRestore();
  });

  test("Displays loading overlay while waiting for bet resolution", async () => {
    render(
      <GuessingGame
        initialUSDPrice={10000}
        lastUpdated="2024-06-23T12:00:00Z"
        userScore={100}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Higher/ }));

    expect(
      screen.getByText(
        "We are evaluating your bet - please wait. The current value is $10000."
      )
    ).toBeInTheDocument();
  });

  test("Displays toast notification for correct bet resolution", async () => {
    const initialPrice = 10000;
    const currentPrice = 11000;

    const mockResolvedBet = {
      resolved: true,
      result: "up",
      initialPrice,
      currentPrice,
      correct: true,
      message: `Your bet has been resolved. Initial price: $${initialPrice.toFixed(
        2
      )}; Current price: $${currentPrice.toFixed(
        2
      )}. You guessed correctly! 🎉 Keep playing to improve your score.`,
    };

    (Cookies.get as jest.Mock).mockReturnValue("123");
    (checkBetResolution as jest.Mock).mockResolvedValue(mockResolvedBet);

    render(
      <GuessingGame
        initialUSDPrice={initialPrice}
        lastUpdated="2024-06-23T12:00:00Z"
        userScore={100}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Higher/ }));

    jest.advanceTimersByTime(60000);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(mockResolvedBet.message);
    });
  });

  test("Allows user to logout", async () => {
    render(
      <GuessingGame
        initialUSDPrice={10000}
        lastUpdated="2024-06-23T12:00:00Z"
        userScore={100}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Logout/ }));

    await waitFor(() => {
      expect(Cookies.remove).toHaveBeenCalledWith("userEmail");
      expect(Cookies.remove).toHaveBeenCalledWith("userId");
      expect(mockPush).toHaveBeenCalledWith(PAGES.LOGIN);
    });
  });
});
