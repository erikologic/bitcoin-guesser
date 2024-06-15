describe('Game', () => {
  describe("calculate score", () =>{
    test.each([
      {direction: "Up", rateAtGuessTime: 10, currentRate: 11, point: 1},
      {direction: "Up", rateAtGuessTime: 10, currentRate: 9, point: -1},
    ])
  })
})