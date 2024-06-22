"use server";

import { sql } from "@vercel/postgres";
import { CoinMarketCapResponse, UserScore } from "@/types/global-types";
import {
  CREATE_USER_ERRORS,
  GET_USER_SCORE,
  LOGIN_ERRORS,
  PLACE_BET_ERRORS,
  RESOLVE_BET,
} from "@/constants/error-mapping";

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
      cache: "no-cache",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    const { error } = errorData;
    throw new Error(error);
  }

  return response.json();
}

export async function fetchUserScore(userId: string): Promise<UserScore> {
  if (!userId) {
    throw GET_USER_SCORE.MISSING_PARAMS;
  }

  try {
    const result = await sql`
      SELECT Users.id, first_name, email, COALESCE(SUM(CASE WHEN result = TRUE THEN 1 ELSE -1 END), 0) AS score
      FROM Users
      LEFT JOIN Bets ON Users.id = Bets.user_id
      WHERE Users.id = ${userId}
      GROUP BY Users.id, first_name, email
    `;

    if (result.rows.length === 0) {
      throw new Error(GET_USER_SCORE.USER_NOT_FOUND);
    }

    const user = result.rows[0];
    const { id, first_name, email, score } = user;
    return { id, first_name, email, score };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function userLogin(email: string, password: string) {
  if (!email || !password) {
    throw LOGIN_ERRORS.MISSING_EMAIL_PWD;
  }

  try {
    const result = await sql`
      SELECT * FROM Users WHERE email = ${email}
    `;

    if (result.rows.length === 0) {
      throw new Error(LOGIN_ERRORS.USER_NOT_FOUND);
    }

    const user = result.rows[0];

    if (user.password !== password) {
      throw new Error(LOGIN_ERRORS.INVALID_CREDENTIALS);
    }

    return user.id;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function userRegister(
  email: string,
  password: string,
  firstName: string
) {
  if (!email || !password || !firstName) {
    throw CREATE_USER_ERRORS.MISSING_FIELDS;
  }

  try {
    const existingUserResult = await sql`
      SELECT * FROM Users WHERE email = ${email}
    `;

    if (existingUserResult.rows.length > 0) {
      throw new Error(CREATE_USER_ERRORS.USER_EXISTS);
    }

    await sql`
      INSERT INTO Users (first_name, email, password)
      VALUES (${firstName}, ${email}, ${password})
    `;

    return { message: "User created successfully" };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function placeBet(
  userId: string,
  betType: string,
  initialPrice: number
) {
  if (
    !userId ||
    !betType ||
    initialPrice === undefined ||
    isNaN(initialPrice)
  ) {
    throw PLACE_BET_ERRORS.MISSING_PARAMS;
  }

  try {
    const userQuery = await sql`SELECT id FROM Users WHERE id = ${userId};`;

    if (userQuery.rows.length === 0) {
      throw new Error(PLACE_BET_ERRORS.USER_NOT_FOUND);
    }

    const insertResult = await sql`
      INSERT INTO Bets (user_id, bet_type, created_at, resolved, initial_price)
      VALUES (${userId}, ${betType}, NOW(), FALSE, ${initialPrice})
      RETURNING id, user_id, bet_type, created_at, resolved, result, initial_price;
    `;

    const newBet = insertResult.rows[0];

    return newBet;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function checkBetResolution(userId: string) {
  if (!userId) {
    throw RESOLVE_BET.MISSING_PARAMS;
  }

  try {
    const betResult = await sql`
      SELECT id, created_at, resolved, bet_type, initial_price, resolved_price
      FROM Bets
      WHERE user_id = ${userId} AND resolved = false
    `;

    if (betResult.rows.length === 0) {
      return { resolved: true, message: "No pending bets.", scoreChange: 0 };
    }

    const bet = betResult.rows[0];
    const currentTime = new Date();
    const betTime = new Date(bet.created_at);
    const timeElapsed = (currentTime.getTime() - betTime.getTime()) / 1000;

    const currentCurrencyRatio = await fetchCoinMarketCap();
    const currentPrice = currentCurrencyRatio.data.BTC.quote.USD.price;

    let resolved = false;
    let message = "";
    let scoreChange = 0;

    if (timeElapsed >= 60 && currentPrice !== bet.initial_price) {
      resolved = true;
      message = "Your bet has been resolved!";

      const correct =
        (bet.bet_type === "up" && currentPrice > bet.initial_price) ||
        (bet.bet_type === "down" && currentPrice < bet.initial_price);

      scoreChange = correct ? 1 : -1;

      await sql`
        UPDATE Bets
        SET resolved = true,
            resolved_price = ${currentPrice}
        WHERE id = ${bet.id}
      `;

      await sql`
        UPDATE Users
        SET score = score + ${scoreChange}
        WHERE id = ${userId}
      `;

      message += correct
        ? " You guessed correctly!"
        : " You guessed incorrectly.";

      return { resolved, message, scoreChange };
    } else {
      return { resolved, message, scoreChange };
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
