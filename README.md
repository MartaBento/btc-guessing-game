# Introduction

This web app was built to allow users to guess whether the market price of Bitcoin (BTC/USD) will be higher or lower after one minute.

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
- Backend/Database: AWS Services (TBD)
