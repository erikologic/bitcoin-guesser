// The player can at all times see their current score and the latest available BTC price in USD
// The player can choose to enter a guess of either “up” or “down“
// After a guess is entered the player cannot make new guesses until the existing guess is resolved
// The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
// If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
// Players can only make one guess at a time
// New players start with a score of 0

import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from './page'

jest.mock('./state', () => ({
  getState: async () => ({
    score: {
      current: 0,
    },
    btc: {
      rateUsd: 1000,
    },
  }),
}))


test('The player can at all times see their current score', async () => {
  render(await Home())
  expect(screen.getByRole('status', {name: "Score"})).toHaveTextContent('0')
})

test('The player can at all times the latest available BTC price in USD', async () => {
  render(await Home())
  expect(screen.getByRole('status', {name: "Price"})).toHaveTextContent('1000')
})