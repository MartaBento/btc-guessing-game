# Introduction

This web application enables users to predict if the market price of Bitcoin (BTC/USD) will increase or decrease after a one-minute interval.

The web application can be accessed at [https://btc-guessing-game.vercel.app](https://btc-guessing-game.vercel.app).

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
