// After a guess is entered the player cannot make new guesses until the existing guess is resolved
// The guess is resolved when the price changes and at least 60 seconds have passed since the guess was made
// If the guess is correct (up = price went higher, down = price went lower), the user gets 1 point added to their score. If the guess is incorrect, the user loses 1 point.
// Players can only make one guess at a time
// New players start with a score of 0

import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from './page'
import {voteUp, getState} from './actions'
import {setTimeout} from 'timers/promises'

jest.mock('./actions', () => {
  return {
    getScore: async () => 0,
    getBtc: async () => 1000,
    voteUp: jest.fn(),
    getState: jest.fn(),
  }
})

test('The player can at all times see their current score', async () => {
  render(await Home())
  expect(screen.getByRole('status', {name: "Score"})).toHaveTextContent('0')
})

test('The player can at all times the latest available BTC price in USD', async () => {
  render(await Home())
  expect(screen.getByRole('status', {name: "Price"})).toHaveTextContent('1000')
})

test('The player can choose to enter a guess of either “up” or “down“', async () => {
  render(await Home())
  expect(screen.getByRole('button', {name: "up"})).toBeEnabled()
  expect(screen.getByRole('button', {name: "down"})).toBeEnabled()
})

test('After a guess is entered the player cannot make new guesses until the existing guess is resolved', async () => {
  // mock something that when voting up, the voting is locked
  (voteUp as jest.Mock).mockImplementationOnce(async () => {
    console.log('voting up');
    (getState as jest.Mock).mockImplementationOnce(async () => 'guessing')
  });


  // GIVEN a new player
  render(await Home())
  expect(screen.getByRole('button', {name: "up"})).toBeEnabled()

  // WHEN the player makes a guess
  screen.getByRole('button', {name: "up"}).click()

  // THEN the player cannot make new guesses until the existing guess is resolved
  await setTimeout(1000)
  expect(screen.getByRole('button', {name: "up"})).not.toBeVisible()
})