"use server";

import { CoinMarketCapResponse } from "@/types/global-types";

export async function fetchCoinMarketCap(
  symbol: string = "BTC",
  convertTo: string = "USD"
): Promise<CoinMarketCapResponse> {
  const response = await fetch(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}&convert=${convertTo}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-CMC_PRO_API_KEY": process.env.COIN_MARKET_API_KEY || "",
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const { error } = errorData;
    throw new Error(error);
  }

  return response.json();
}
