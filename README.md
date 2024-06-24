# Introduction

This web application enables users to predict if the market price of Bitcoin (BTC/USD) will increase or decrease after a one-minute interval.

The web application can be accessed at [https://btc-guessing-game.vercel.app](https://btc-guessing-game.vercel.app).

## Functional overview

- When the user opens the app, he will be forwarded to `/login`
- If he doesn't have an account, he will be able to create a new account in `/create-user`
- Route guard are provided by Next.js middleware (e.g., logged out users will not be able to enter the game)
- Error handling provided (e.g., No user found, Invalid credentials, etc.)
- If the user is already logged in, he will be able to go immediately to his game
- When the user enters the homepage, he will see his current score, the current BTC price (USD) and the time this value was last updated
- In order to start, the user will click "higher" or "lower"
- After that, he will need to wait at least 60 seconds; if the value remains the same, he will continue waiting until the price chances, otherwise, he will see a toast message saying weather his bet was correct or incorrect
- During the time where we needs to wait for a bet resolution, user will not be able to play

Note: There's a lot (a lot!) of things that there weren't consider here in this small POC, like password hashing in the db, the user can edit his cookie information, remove the current bet from localStorage, and so on...

## Rules

- [x] The player can at all times see their current score and the latest available BTC price in USD
- [x] The player can choose to enter a guess of either “up” or “down“
- [x] After a guess is entered the player cannot make new guesses until the existing guess is resolved
- [x] The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
- [x] If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
- [x] Players can only make one guess at a time
- [x] New players start with a score of 0

## Requirements

- [x] The guesses should be resolved fairly using BTC price data from any available 3rd party API
- [x] The score of each player should be persisted in a backend data store
- [x] Players should be able to close their browser and return to see their score and continue to make more guesses

## Additional functionalities

- [x] Create new user in the db
- [x] Login and logout (very basic - just to have a user session in place)

## Technologies

- Frontend: Next.js, React, Typescript and Tailwind
- Database: Postgres (`btc_guessing_game_postgres_db`) (hosted in Vercel)
- Infrastructure: Vercel

## Local development setup

To set up and run the project locally, follow these steps:

1. Ensure you have Node.js installed on your machine.
2. Open your terminal.
3. Navigate to the project's root directory.
4. Install the project dependencies by running:

```bash
npm i
```

5. Start the development server with the following command:

```bash
npm run dev
```

## Credentials

To retrieve the currency exchange rates, the [CoinMarketCap API](https://coinmarketcap.com/api/documentation/v1/) was chosen to be the data provider. Follow these steps to set up the API access:

1. Visit the [CoinMarketCap API documentation](https://coinmarketcap.com/api/documentation/v1/) and sign up for an account to obtain an API key.

2. In the root directory of your project, create a file named `.env.local`.

3. Open the `.env.local` file and add your CoinMarketCap API key in the following format:

```bash
COIN_MARKET_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with the actual API key you received from CoinMarketCap. This key will be used by the application to authenticate and fetch the currency exchange ratios.
